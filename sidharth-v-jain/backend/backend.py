"""
FastAPI backend for the AI Startup Validator.

- POST /validate -> send a one-line startup idea, get back a structured
                     validation report from Groq (rate limited, optional API key)
- GET  /history  -> past validation reports
- POST /clear    -> wipe history
- GET  /models   -> list of selectable Groq models
"""
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from groq import Groq
from pydantic import BaseModel, Field, ValidationError
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

# Setup
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
BACKEND_API_KEY = os.getenv("BACKEND_API_KEY")  
ANALYST_PERSONA = os.getenv(
    "ANALYST_PERSONA",
    "You are a sharp, encouraging startup analyst with experience at a top accelerator.",
)

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is missing. Add it to your .env file.")

client = Groq(api_key=GROQ_API_KEY)
MEMORY_FILE = Path(__file__).parent / "memory.json"

AVAILABLE_MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "gemma2-9b-it",
]
DEFAULT_MODEL = AVAILABLE_MODELS[0]

# Exact JSON format followed by model
REPORT_JSON_SCHEMA = """{
  "one_liner_summary": "a cleaned-up, punchy restatement of the idea",
  "competitors": [
    {"name": "...", "description": "...", "differentiator": "how this idea could stand out against them"}
  ],
  "swot": {
    "strengths": ["..."],
    "weaknesses": ["..."],
    "opportunities": ["..."],
    "threats": ["..."]
  },
  "target_customer": {
    "persona_name": "e.g. 'Busy Freelance Designer Dana'",
    "demographics": "...",
    "pain_points": ["..."],
    "buying_behavior": "..."
  },
  "revenue_ideas": [
    {"model": "e.g. 'Freemium subscription'", "description": "..."}
  ],
  "landing_page_copy": {
    "headline": "...",
    "subheadline": "...",
    "cta_button": "e.g. 'Start Free Trial'",
    "feature_bullets": ["..."]
  },
  "roadmap": [
    {"phase": "e.g. 'MVP'", "timeframe": "e.g. 'Weeks 1-4'", "goals": ["..."]}
  ]
}"""

SYSTEM_PROMPT = f"""{ANALYST_PERSONA}

A user will give you a one-line startup idea. Produce a full validation report
as a SINGLE JSON object and nothing else — no markdown fences, no preamble,
no commentary before or after. Match this exact structure and field names:

{REPORT_JSON_SCHEMA}

Guidelines:
- competitors: 3-5 realistic, named companies or well-known types of competitors
- swot: 3-5 concise bullet points per category
- target_customer.pain_points: 3-5 bullet points
- revenue_ideas: 3-4 distinct monetization models
- landing_page_copy.feature_bullets: 3-5 short, benefit-driven bullets
- roadmap: 3-4 phases in chronological order (e.g. MVP, Launch, Growth, Scale)
- Be specific and realistic, not generic filler."""

# App + rate limiting
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="AI Startup Validator API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to your deployed frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# Optional API-key auth 
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


def verify_api_key(key: str = Security(api_key_header)) -> None:
    """If BACKEND_API_KEY is set in .env, require a matching X-API-Key header."""
    if BACKEND_API_KEY and key != BACKEND_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key.")


def load_history() -> list[dict]:
    if not MEMORY_FILE.exists():
        return []
    try:
        return json.loads(MEMORY_FILE.read_text())
    except json.JSONDecodeError:
        return []


def save_history(history: list[dict]) -> None:
    MEMORY_FILE.write_text(json.dumps(history, indent=2))


# Report schema 
class Competitor(BaseModel):
    name: str
    description: str
    differentiator: str


class Swot(BaseModel):
    strengths: list[str]
    weaknesses: list[str]
    opportunities: list[str]
    threats: list[str]


class TargetCustomer(BaseModel):
    persona_name: str
    demographics: str
    pain_points: list[str]
    buying_behavior: str


class RevenueIdea(BaseModel):
    model: str
    description: str


class LandingPageCopy(BaseModel):
    headline: str
    subheadline: str
    cta_button: str
    feature_bullets: list[str]


class RoadmapPhase(BaseModel):
    phase: str
    timeframe: str
    goals: list[str]


class ValidationReport(BaseModel):
    one_liner_summary: str
    competitors: list[Competitor]
    swot: Swot
    target_customer: TargetCustomer
    revenue_ideas: list[RevenueIdea]
    landing_page_copy: LandingPageCopy
    roadmap: list[RoadmapPhase]


class HistoryRecord(BaseModel):
    id: str
    idea: str
    model: str
    created_at: str
    report: ValidationReport


# Request/response schemas
class ValidateRequest(BaseModel):
    idea: str = Field(min_length=3, max_length=300)
    model: str = DEFAULT_MODEL


# Groq call 
def strip_code_fence(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        lines = text.split("\n")[1:]
        if lines and lines[-1].strip().startswith("```"):
            lines = lines[:-1]
        text = "\n".join(lines)
    return text.strip()


def parse_json_response(raw: str) -> dict:
    text = strip_code_fence(raw)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start, end = text.find("{"), text.rfind("}")
        if start != -1 and end > start:
            return json.loads(text[start : end + 1])
        raise


def generate_report(idea: str, model: str) -> ValidationReport:
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f'Startup idea: "{idea}"'},
    ]

    try:
        completion = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.7,
            response_format={"type": "json_object"},
        )
    except Exception:
        # Fall back for models that don't support json object response
        try:
            completion = client.chat.completions.create(
                model=model, messages=messages, temperature=0.7
            )
        except Exception as exc:
            raise HTTPException(status_code=502, detail=f"Groq API error: {exc}") from exc

    raw = completion.choices[0].message.content

    try:
        data = parse_json_response(raw)
        return ValidationReport(**data)
    except (json.JSONDecodeError, ValidationError) as exc:
        raise HTTPException(
            status_code=502,
            detail=f"The model returned a malformed report. Try again. ({exc})",
        ) from exc


# Routes
@app.get("/")
def root():
    return {"status": "ok", "message": "Startup Validator API is running. See /docs."}


@app.get("/models")
def get_models():
    return {"models": AVAILABLE_MODELS, "default": DEFAULT_MODEL}


@app.get("/history")
def get_history():
    return {"history": load_history()}


@app.post("/validate", response_model=HistoryRecord, dependencies=[Security(verify_api_key)])
@limiter.limit("5/minute")
def validate_idea(request: Request, payload: ValidateRequest):
    report = generate_report(payload.idea, payload.model)

    record = HistoryRecord(
        id=str(uuid4()),
        idea=payload.idea,
        model=payload.model,
        created_at=datetime.now(timezone.utc).isoformat(),
        report=report,
    )

    history = load_history()
    history.append(record.model_dump())
    save_history(history)

    return record


@app.post("/clear", dependencies=[Security(verify_api_key)])
def clear_history():
    save_history([])
    return {"status": "cleared"}

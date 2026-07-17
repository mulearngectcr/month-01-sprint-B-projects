import os
import json
from fastapi import FastAPI, Request
from datetime import datetime
from slowapi import _rate_limit_exceeded_handler, Limiter
from pydantic import BaseModel
from groq import AsyncGroq
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv


load_dotenv()
limiter = Limiter(key_func=get_remote_address)

app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded,_rate_limit_exceeded_handler)

client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))
MEMORY_FILE = "memory.json"


class DraftRequest(BaseModel):
    message: str 
    context: str
    tones: list[str] = ["Gen-Z","Passive-Aggressive","Professional"]

class DraftResponse(BaseModel):
    drafts: dict[str,str]


def read_memory():
    if not os.path.exists(MEMORY_FILE):
        return []
    with open(MEMORY_FILE,"r") as f:
        return json.load(f)

def write_memory(new_record: dict):
    current_data = read_memory()
    current_data.append(new_record)

    with open(MEMORY_FILE,"w") as f:
        json.dump(current_data,f, indent=4)


async def generate_drafts(data: DraftRequest) -> dict:
    prompt = f"""
    You are an expert communication assistant specializing in tone modulation. 
    Your task is to draft exactly 3 reply messages to a received text based on the provided context and the requested tones.

    CRITICAL INSTRUCTIONS:
    1. Do not include any introductory text, pleasantries, or markdown formatting (like ```json).
    2. The output must be a single, valid JSON object.
    3. The keys of the JSON object must be the exact names of the requested tones.
    4. The values must be the direct, ready-to-use draft replies. 
    5. Keep the replies natural, concise, and realistic to human communication.

    INPUT DATA:
    - Received Message: "{data.message}"
    - Goal/Context: "{data.context}"
    - Requested Tones: {data.tones}

    EXPECTED JSON FORMAT:
    {{
        "{data.tones[0]}": "Draft reply text here...",
        "{data.tones[1]}": "Draft reply text here...",
        "{data.tones[2]}": "Draft reply text here..."
    }}
    """

    response = await client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type":"json_object"}
    )

    raw_content = response.choices[0].message.content
    return json.loads(raw_content)
    


@app.post("/api/v1/draft", response_model=DraftResponse)
@limiter.limit("5/minute")
async def create_draft(request: Request, data: DraftRequest):
    
    generated_drafts = await generate_drafts(data)
    
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "input_message": data.message,
        "context": data.context,
        "tones_requested": data.tones,
        "ai_output": generated_drafts
    }
    write_memory(log_entry)
    
    # Step C: Return the response to the frontend
    return {"drafts": generated_drafts}
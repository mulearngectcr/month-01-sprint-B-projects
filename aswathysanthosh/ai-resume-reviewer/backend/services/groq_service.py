import os
import json

from groq import Groq
from dotenv import load_dotenv

from utils.prompts import RESUME_REVIEW_PROMPT

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def analyze_with_llm(resume_text: str, role: str):

    prompt = RESUME_REVIEW_PROMPT.format(
        role=role,
        resume=resume_text
    )

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    text = response.choices[0].message.content.strip()

    if text.startswith("```json"):
        text = text.replace("```json", "").replace("```", "").strip()

    elif text.startswith("```"):
        text = text.replace("```", "").strip()

    return json.loads(text)
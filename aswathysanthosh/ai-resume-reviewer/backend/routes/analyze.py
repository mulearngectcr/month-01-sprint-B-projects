import os
import shutil

from fastapi import APIRouter, UploadFile, File, Form
from services.ats import analyze_resume
from services.parser import extract_text
from services.groq_service import analyze_with_llm

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/analyze")
async def analyze_resume_api(
    file: UploadFile = File(...),
    role: str = Form(...)
):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    resume_text = extract_text(file_path)

    analysis = analyze_resume(resume_text, role)
    ai_analysis = analyze_with_llm(
        resume_text,
        role
    )

    return {
        "role": role,
        "analysis": analysis,
        "ai_analysis": ai_analysis
    }
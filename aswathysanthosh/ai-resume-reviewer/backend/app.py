from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.analyze import router

app = FastAPI(title="AI Resume Reviewer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://ai-resume-reviewer-liard.vercel.app",
],  # Restrict this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def home():
    return {"message": "AI Resume Reviewer API Running 🚀"}
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Initialize FastAPI
app = FastAPI(title="Hackathon Pitch Generator API")

# Add CORS so the HTML frontend can communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define what the user will send to the API
class ThemeRequest(BaseModel):
    theme: str

# Connect to Google Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise RuntimeError("GEMINI_API_KEY environment variable not found. Please check your .env file.")

genai.configure(api_key=api_key)
# Using the updated model version
model = genai.GenerativeModel('gemini-2.5-flash')

@app.post("/generate-pitch")
def generate_pitch(request: ThemeRequest):
    try:
        # The hidden prompt combining the user's theme with our strict instructions
        prompt = f"""
        You are an expert startup and hackathon coach. 
        Generate a winning hackathon project idea based on this theme: '{request.theme}'.
        
        Provide the output in the following structure:
        1. Project Title & 1-Sentence Concept
        2. Recommended Tech Stack
        3. Team Distribution: Assign specific responsibilities for a 4-member team (e.g., AI Specialist, Frontend, Backend/Database, Project Strategist/Pitcher).
        4. A 60-Second Elevator Pitch script.
        """
        
        response = model.generate_content(prompt)
        return {"success": True, "pitch_plan": response.text}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
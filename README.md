# AI Hackathon Pitch Generator

A full-stack AI application built with FastAPI and Google Gemini that takes a hackathon theme and instantly generates a comprehensive project pitch, technical stack recommendation, and 4-member team role distribution.

## 🚀 Features

* **FastAPI Backend:** High-performance, clean REST API with CORS middleware configured for seamless frontend communication.
* **Gemini 2.5 Flash Integration:** Connects securely via Google GenAI SDK to generate structured, professional hackathon synopses.
* **4-Member Team Allocation:** Automatically delegates specialized responsibilities (AI Specialist, Frontend, Backend/IoT, Project Strategist) tailored to the theme.
* **Single-Page UI:** Clean, responsive HTML/JavaScript frontend to fetch and display the generated pitch live.

## 🛠️ Project Structure

```text
hackathon-pitch-api/
├── main.py            # FastAPI application logic & AI prompt handling
├── index.html         # Frontend user interface
├── .env               # Local environment variables (API Keys)
├── .gitignore         # Version control exclusion rules
└── requirements.txt   # Python project dependencies

```

## 💻 Tech Stack

* **Backend:** Python, FastAPI, Uvicorn
* **LLM Engine:** Google Gemini 2.5 Flash (`google-generativeai`)
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (Fetch API)

## 🔧 Installation & Local Setup

### 1. Clone and Navigate

```cmd
cd hackathon-pitch-api

```

### 2. Configure Environment Variables

Create a `.env` file in the root directory and add your Google AI Studio key:

```text
GEMINI_API_KEY=your_actual_api_key_here

```

### 3. Set Up Virtual Environment & Install Dependencies

```cmd
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

```

### 4. Run the Development Server

```cmd
uvicorn main:app --reload

```

* **API Documentation:** View and test the endpoints interactively at `[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)`

### 5. Open the Frontend

Double-click `index.html` to launch the user interface in any modern browser, type your hackathon theme, and generate your pitch.
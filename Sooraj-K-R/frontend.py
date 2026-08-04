"""
Tone-Adjusted Reply Drafter — Streamlit Frontend
Communicates with the FastAPI backend (configurable via BACKEND_URL env var).
Defaults to the Render deployment URL for production.
"""

import streamlit as st
import requests
import os

# ──────────────────────────────────────────────
# Page Config & Custom CSS
# ──────────────────────────────────────────────
st.set_page_config(
    page_title="Tone-Adjusted Reply Drafter",
    page_icon="✍️",
    layout="centered",
)

st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

    html, body, [class*="st-"] {
        font-family: 'Inter', sans-serif;
    }

    /* Header gradient */
    .main-header {
        text-align: center;
        padding: 1.2rem 0 0.4rem;
    }
    .main-header h1 {
        background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 2.2rem;
        font-weight: 700;
        margin-bottom: 0.1rem;
    }
    .main-header p {
        color: #94a3b8;
        font-size: 1rem;
    }

    /* Draft card */
    .draft-card {
        background: linear-gradient(145deg, #1e1b4b 0%, #312e81 100%);
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-radius: 14px;
        padding: 1.4rem 1.6rem;
        margin-bottom: 1rem;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .draft-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(139, 92, 246, 0.25);
    }
    .draft-card h3 {
        color: #c4b5fd;
        margin: 0 0 0.6rem;
        font-size: 1.05rem;
        letter-spacing: 0.02em;
    }
    .draft-card p {
        color: #e2e8f0;
        line-height: 1.65;
        margin: 0;
        font-size: 0.95rem;
    }

    /* Divider line */
    .styled-divider {
        border: none;
        height: 1px;
        background: linear-gradient(90deg, transparent, #6366f1, transparent);
        margin: 1.5rem 0;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# ──────────────────────────────────────────────
# Constants
# ──────────────────────────────────────────────
API_BASE = os.environ.get(
    "BACKEND_URL",
    "https://month-01-sprint-b-projects.onrender.com"
)
API_URL = f"{API_BASE}/api/v1/draft"
DEFAULT_TONES = ["Professional", "Gen-Z", "Passive-Aggressive"]
REQUEST_TIMEOUT_SECONDS = 60

# ──────────────────────────────────────────────
# Header
# ──────────────────────────────────────────────
st.markdown(
    '<div class="main-header">'
    "<h1>✍️ Tone-Adjusted Reply Drafter</h1>"
    "<p>Paste a message, set your goal, pick three tones — get instant AI-drafted replies.</p>"
    "</div>",
    unsafe_allow_html=True,
)
st.markdown('<hr class="styled-divider">', unsafe_allow_html=True)

# ──────────────────────────────────────────────
# Input Section
# ──────────────────────────────────────────────
st.subheader("📩 Received Message")
message = st.text_area(
    "Paste the message you want to reply to",
    height=140,
    placeholder="e.g. Hey, can you finish the report by tomorrow morning?",
)

st.subheader("🎯 Context / Goal")
context = st.text_input(
    "What's the goal of your reply?",
    placeholder="e.g. Politely ask for a deadline extension",
)

st.subheader("🎨 Tones (exactly 3)")
col1, col2, col3 = st.columns(3)
with col1:
    tone1 = st.text_input("Tone 1", value=DEFAULT_TONES[0])
with col2:
    tone2 = st.text_input("Tone 2", value=DEFAULT_TONES[1])
with col3:
    tone3 = st.text_input("Tone 3", value=DEFAULT_TONES[2])

st.markdown('<hr class="styled-divider">', unsafe_allow_html=True)

# ──────────────────────────────────────────────
# Generate Button & API Call
# ──────────────────────────────────────────────
generate = st.button("🚀 Generate Drafts", use_container_width=True, type="primary")

if generate:
    # ── Client-side validation ──────────────────
    tones = [t.strip() for t in [tone1, tone2, tone3]]

    if not message.strip():
        st.warning("⚠️ Please paste the received message before generating drafts.")
    elif not context.strip():
        st.warning("⚠️ Please provide a context or goal for your reply.")
    elif any(t == "" for t in tones):
        st.warning("⚠️ All three tone fields must be filled in.")
    elif len(set(tones)) < 3:
        st.warning("⚠️ Please enter three *distinct* tones — duplicates won't give you varied drafts.")
    else:
        # ── Build payload & call API ────────────
        payload = {
            "message": message.strip(),
            "context": context.strip(),
            "tones": tones,
        }

        with st.spinner("Generating your tone-adjusted drafts…"):
            try:
                response = requests.post(
                    API_URL,
                    json=payload,
                    timeout=REQUEST_TIMEOUT_SECONDS,
                )

                # — Rate-limit handling (HTTP 429) —
                if response.status_code == 429:
                    st.error(
                        "🚦 **Rate limit reached.** The API allows 5 requests per minute. "
                        "Please wait a moment and try again."
                    )
                # — Other HTTP errors —
                elif response.status_code != 200:
                    st.error(
                        f"❌ **Server error** (HTTP {response.status_code}): "
                        f"{response.text[:300]}"
                    )
                else:
                    # — Success —
                    data = response.json()
                    drafts: dict = data.get("drafts", {})

                    if not drafts:
                        st.error(
                            "😕 The API returned an empty response. "
                            "Please try again or check the backend logs."
                        )
                    else:
                        st.markdown('<hr class="styled-divider">', unsafe_allow_html=True)
                        st.subheader("📝 Your Drafted Replies")

                        for tone_name, draft_text in drafts.items():
                            st.markdown(
                                f'<div class="draft-card">'
                                f"<h3>🏷️ {tone_name}</h3>"
                                f"<p>{draft_text}</p>"
                                f"</div>",
                                unsafe_allow_html=True,
                            )
                            # Streamlit native code block for easy copy
                            st.code(draft_text, language=None)

            except requests.exceptions.ConnectionError:
                st.error(
                    "🔌 **Cannot reach the backend.** "
                    "Make sure the FastAPI server is running at "
                    f"`{API_URL}` (run `uvicorn backend:app --reload`)."
                )
            except requests.exceptions.Timeout:
                st.error(
                    "⏳ **Request timed out.** The AI took too long to respond. "
                    "Please try again in a moment."
                )
            except requests.exceptions.JSONDecodeError:
                st.error(
                    "🧩 **Invalid response from server.** "
                    "The backend returned data that couldn't be parsed as JSON."
                )
            except Exception as exc:
                st.error(f"💥 **Unexpected error:** {exc}")

import requests
import streamlit as st

BACKEND_URL = st.secrets.get("BACKEND_URL", "http://localhost:8000")
API_KEY = st.secrets.get("BACKEND_API_KEY", "")  # just for backend auth

st.set_page_config(page_title="AI Startup Validator", page_icon="🚀", layout="wide")


def api_headers() -> dict:
    return {"X-API-Key": API_KEY} if API_KEY else {}


@st.cache_data(ttl=300)
def fetch_models() -> tuple[list[str], str]:
    try:
        resp = requests.get(f"{BACKEND_URL}/models", timeout=10)
        resp.raise_for_status()
        data = resp.json()
        return data["models"], data["default"]
    except requests.RequestException:
        return ["llama-3.3-70b-versatile"], "llama-3.3-70b-versatile"


def fetch_history() -> list[dict]:
    try:
        resp = requests.get(f"{BACKEND_URL}/history", timeout=10)
        resp.raise_for_status()
        return resp.json().get("history", [])
    except requests.RequestException:
        return []


# Session state
if "history" not in st.session_state:
    st.session_state.history = fetch_history()
if "current_record" not in st.session_state:
    st.session_state.current_record = st.session_state.history[-1] if st.session_state.history else None

# Sidebar
with st.sidebar:
    st.header("Settings")
    models, default_model = fetch_models()
    selected_model = st.selectbox("Groq model", models, index=models.index(default_model))

    if st.button("🗑️ Clear History", use_container_width=True):
        try:
            requests.post(f"{BACKEND_URL}/clear", headers=api_headers(), timeout=10)
        except requests.RequestException as exc:
            st.error(f"Could not clear history on the server: {exc}")
        st.session_state.history = []
        st.session_state.current_record = None
        st.rerun()

    st.divider()
    st.subheader("Past ideas")
    if not st.session_state.history:
        st.caption("No ideas validated yet.")
    else:
        for record in reversed(st.session_state.history):
            if st.button(f"💡 {record['idea']}", key=record["id"], use_container_width=True):
                st.session_state.current_record = record
                st.rerun()

# Main part
st.title("🚀 AI Startup Validator")
st.caption("Describe your startup idea in one line and get a full validation report.")

with st.form("idea_form", clear_on_submit=False):
    idea = st.text_input(
        "Your startup idea",
        placeholder="e.g. An app that matches dog owners for spontaneous playdates",
        max_chars=300,
    )
    submitted = st.form_submit_button("Validate My Idea", type="primary", use_container_width=True)

if submitted:
    if not idea or len(idea.strip()) < 3:
        st.warning("Give me a bit more to work with — a short sentence is enough.")
    else:
        with st.spinner("Analyzing competitors, customers, and revenue paths..."):
            try:
                resp = requests.post(
                    f"{BACKEND_URL}/validate",
                    json={"idea": idea.strip(), "model": selected_model},
                    headers=api_headers(),
                    timeout=90,
                )
                resp.raise_for_status()
                record = resp.json()
                st.session_state.current_record = record
                st.session_state.history.append(record)
            except requests.RequestException as exc:
                st.error(f"⚠️ Error generating report: {exc}")

# Report 
def render_report(record: dict) -> None:
    report = record["report"]

    st.divider()
    st.subheader(f"📋 {report['one_liner_summary']}")
    st.caption(f"Original idea: \"{record['idea']}\" · model: {record['model']}")

    tabs = st.tabs(
        ["🏆 Competitors", "📊 SWOT", "🎯 Target Customer", "💰 Revenue Ideas", "📝 Landing Page", "🗺️ Roadmap"]
    )

    with tabs[0]:
        for c in report["competitors"]:
            with st.container(border=True):
                st.markdown(f"**{c['name']}**")
                st.write(c["description"])
                st.caption(f"🔑 Differentiator: {c['differentiator']}")

    with tabs[1]:
        swot = report["swot"]
        col1, col2 = st.columns(2)
        with col1:
            st.markdown("### 💪 Strengths")
            for item in swot["strengths"]:
                st.markdown(f"- {item}")
            st.markdown("### 🌱 Opportunities")
            for item in swot["opportunities"]:
                st.markdown(f"- {item}")
        with col2:
            st.markdown("### ⚠️ Weaknesses")
            for item in swot["weaknesses"]:
                st.markdown(f"- {item}")
            st.markdown("### 🔥 Threats")
            for item in swot["threats"]:
                st.markdown(f"- {item}")

    with tabs[2]:
        tc = report["target_customer"]
        st.markdown(f"### {tc['persona_name']}")
        st.write(tc["demographics"])
        st.markdown("**Pain points**")
        for item in tc["pain_points"]:
            st.markdown(f"- {item}")
        st.markdown("**Buying behavior**")
        st.write(tc["buying_behavior"])

    with tabs[3]:
        for r in report["revenue_ideas"]:
            with st.container(border=True):
                st.markdown(f"**{r['model']}**")
                st.write(r["description"])

    with tabs[4]:
        lp = report["landing_page_copy"]
        with st.container(border=True):
            st.markdown(f"# {lp['headline']}")
            st.markdown(f"##### {lp['subheadline']}")
            for feat in lp["feature_bullets"]:
                st.markdown(f"✅ {feat}")
            st.button(lp["cta_button"], disabled=True)

    with tabs[5]:
        for phase in report["roadmap"]:
            with st.expander(f"**{phase['phase']}** — {phase['timeframe']}", expanded=False):
                for goal in phase["goals"]:
                    st.markdown(f"- {goal}")


if st.session_state.current_record:
    render_report(st.session_state.current_record)

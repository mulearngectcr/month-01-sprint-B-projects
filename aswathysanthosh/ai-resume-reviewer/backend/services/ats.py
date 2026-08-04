import re

# ==========================================
# Role-specific keywords
# ==========================================

ROLE_KEYWORDS = {
    "AI Engineer": [
        "Python",
        "Machine Learning",
        "Deep Learning",
        "TensorFlow",
        "PyTorch",
        "FastAPI",
        "Docker",
        "Git",
        "SQL",
        "REST API"
    ],

    "Data Scientist": [
        "Python",
        "Pandas",
        "NumPy",
        "Scikit-learn",
        "Statistics",
        "Machine Learning",
        "Power BI",
        "Tableau",
        "SQL",
        "Data Visualization"
    ],

    "Backend Developer": [
        "Python",
        "FastAPI",
        "Django",
        "Flask",
        "REST API",
        "Docker",
        "Redis",
        "PostgreSQL",
        "Git",
        "SQL"
    ],

    "Frontend Developer": [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "TypeScript",
        "Tailwind",
        "Redux",
        "Git",
        "REST API"
    ]
}


# ==========================================
# Contact Information
# ==========================================

def check_contact_info(text: str):
    """Checks for email, phone, LinkedIn and GitHub."""

    score = 0
    found = []

    email_pattern = r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
    phone_pattern = r"\+?\d[\d\s\-()]{8,}"

    if re.search(email_pattern, text):
        score += 5
        found.append("Email")

    if re.search(phone_pattern, text):
        score += 5
        found.append("Phone")

    if "linkedin" in text.lower():
        score += 5
        found.append("LinkedIn")

    if "github" in text.lower():
        score += 5
        found.append("GitHub")

    return score, found


# ==========================================
# Resume Sections
# ==========================================

def check_sections(text: str):

    score = 0
    found = []

    sections = {
        "Education": "education",
        "Experience": "experience",
        "Projects": "project",
        "Skills": "skill",
        "Certifications": "certification",
    }

    text_lower = text.lower()

    for section, keyword in sections.items():

        if keyword in text_lower:
            score += 6
            found.append(section)

    return score, found


# ==========================================
# Keyword Match
# ==========================================

def keyword_analysis(text: str, role: str):

    text_lower = text.lower()

    keywords = ROLE_KEYWORDS.get(role, [])

    matched = []
    missing = []

    for keyword in keywords:

        if keyword.lower() in text_lower:
            matched.append(keyword)
        else:
            missing.append(keyword)

    if keywords:
        keyword_score = int((len(matched) / len(keywords)) * 30)
    else:
        keyword_score = 0

    return keyword_score, matched, missing


# ==========================================
# Formatting Score
# ==========================================

def formatting_score(text: str):

    score = 20

    if len(text) < 300:
        score -= 10

    if len(text.split()) < 100:
        score -= 5

    return max(score, 0)


# ==========================================
# ATS Score
# ==========================================

def calculate_ats_score(text: str, role: str):

    contact_score, contact_found = check_contact_info(text)

    section_score, sections_found = check_sections(text)

    keyword_score, matched_keywords, missing_keywords = keyword_analysis(
        text, role
    )

    format_score = formatting_score(text)

    total_score = (
        contact_score
        + section_score
        + keyword_score
        + format_score
    )

    total_score = min(total_score, 100)

    return {
        "ats_score": total_score,
        "breakdown": {
            "contact": contact_score,
            "sections": section_score,
            "keywords": keyword_score,
            "formatting": format_score,
        },
        "found_sections": sections_found,
        "matched_keywords": matched_keywords,
        "missing_keywords": missing_keywords,
    }


# ==========================================
# Suggestions
# ==========================================

def generate_suggestions(result):

    suggestions = []

    if result["breakdown"]["contact"] < 20:
        suggestions.append(
            "Include your email, phone number, LinkedIn profile, and GitHub profile."
        )

    if "Projects" not in result["found_sections"]:
        suggestions.append("Add a Projects section.")

    if "Experience" not in result["found_sections"]:
        suggestions.append("Include your work or internship experience.")

    if "Skills" not in result["found_sections"]:
        suggestions.append("Add a dedicated Skills section.")

    if result["missing_keywords"]:
        suggestions.append(
            "Include more role-specific keywords to improve ATS compatibility."
        )

    if result["breakdown"]["formatting"] < 20:
        suggestions.append(
            "Improve formatting by using clear section headings and more detailed content."
        )

    return suggestions


# ==========================================
# Main Analyzer
# ==========================================

def analyze_resume(text: str, role: str):

    result = calculate_ats_score(text, role)

    result["suggestions"] = generate_suggestions(result)

    return result
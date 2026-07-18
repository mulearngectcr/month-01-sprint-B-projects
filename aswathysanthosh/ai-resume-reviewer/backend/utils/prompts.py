RESUME_REVIEW_PROMPT = """
You are an expert ATS Resume Reviewer.

Analyze the following resume for the target role.

Target Role:
{role}

Resume:
{resume}

Return ONLY valid JSON in this format:

{{
    "strengths": [
        "...",
        "..."
    ],
    "weaknesses": [
        "...",
        "..."
    ],
    "rewritten_bullets": [
        "...",
        "..."
    ],
    "cover_letter": "..."
}}

Do not include markdown.
Do not include explanations.
Return only JSON.
"""
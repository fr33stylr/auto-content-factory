import os
from dotenv import load_dotenv
from pydantic import BaseModel
from google import genai
from google.genai import types

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# The strict blueprint for the Editor's decision
class EditorDecision(BaseModel):
    is_approved: bool
    feedback_notes: str

def review_drafts(fact_sheet_json: str, drafts_json: str) -> str:
    print("Agent 3 (Editor-in-Chief) is auditing the drafts...")
    
    # 1. The Persona & Rules
    system_instruction = """
    You are the "Editor-in-Chief" Agent. Your role is the "Gatekeeper."
    You will receive a 'Source of Truth Fact-Sheet' and a set of 'Copywriter Drafts'.

    Your Mission:
    1. Hallucination Check: Compare the drafts to the Fact-Sheet. If the copywriter invented specific capabilities, metrics (numbers/percentages), prices, or guarantees not present in the Fact-Sheet, you MUST reject it.
    2. Adjective Allowance: Do NOT reject a draft just because the copywriter used enthusiastic marketing adjectives (e.g., "amazing", "ultimate", "state-of-the-art") as long as they aren't inventing hard facts.
    3. Tone Audit: Ensure the language flows naturally and matches the requested tone.

    Output Rules:
    - If accurate (even with marketing flair), set is_approved to true and write "Approved for publishing" in feedback_notes.
    - If you find hard factual errors or invented capabilities, set is_approved to false and write a highly specific "Correction Note" detailing exactly what Agent 2 needs to fix.
    """

    # 2. The API Call
    # We use 'flash' here because comparing two texts is a fast, logical task, not a creative one.
    response = client.models.generate_content(
        model='gemini-2.5-flash-lite', 
        # We feed both pieces of data to the AI here
        contents=f"FACT-SHEET:\n{fact_sheet_json}\n\n--- \n\nDRAFTS TO REVIEW:\n{drafts_json}", 
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json",
            response_schema=EditorDecision,
            temperature=0.1 # Low temperature so the Editor is strict, cold, and logical
        ),
    )
    
    return response.text


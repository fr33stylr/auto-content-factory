import os
from dotenv import load_dotenv
from pydantic import BaseModel
from google import genai
from google.genai import types

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# The strict blueprint for the Copywriter's output
class CopywriterDrafts(BaseModel):
    blog_post: str
    social_thread: list[str] # Forces the AI to make a list of individual posts
    email_teaser: str

def generate_drafts(fact_sheet_json: str, tone: str) -> str:
    print(f"Agent 2 (Copywriter) is drafting in a '{tone}' tone...")
    
    # 1. The Persona (Notice how we inject the 'tone' variable dynamically)
    system_instruction = f"""
    You are the "Creative Copywriter" Agent. 
    You will receive a strict JSON Fact-Sheet. You must use ONLY the facts provided in this sheet.
    Ensure the specific "Value Proposition" from the Fact-Sheet is the central hero of every piece.

    CRITICAL ANTI-HALLUCINATION RULE: 
    If a feature, service, or component is listed but lacks specific details, you may use standard marketing adjectives (like "advanced", "premium", or "innovative"), but you MUST NOT invent specific functional benefits, metrics, or guarantees. 

    ❌ BAD EXAMPLE: 
    Fact-Sheet says: "Includes Proprietary System X."
    You write: "System X will automatically double your revenue and save you 10 hours a week!" (REJECTED: You invented metrics and capabilities).

    ✅ GOOD EXAMPLE:
    Fact-Sheet says: "Includes Proprietary System X."
    You write: "Powered by the innovative Proprietary System X." (APPROVED: You used an adjective, but didn't invent a function or metric).

    The user requested an overall campaign vibe of: '{tone}'.

    However, you MUST switch your length appropriately for each specific format:
    1. blog_post: Write exactly a 500-word article. 
    2. social_thread: Write exactly 5 punchy posts for platforms like Twitter/LinkedIn.
    3. email_teaser: Write exactly 1 paragraph.
    """

    # 2. The API Call
    # We upgrade to a 'Pro' model here because writing high-quality marketing copy requires deep reasoning and creativity.
    response = client.models.generate_content(
        model='gemini-2.5-flash-lite', 
        # We pass the facts from Agent 1 right here as the user input
        contents=f"Here is the Source of Truth Fact-Sheet:\n{fact_sheet_json}", 
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json",
            response_schema=CopywriterDrafts,
            temperature=0.7 # High temperature (0.7) gives the AI permission to be creative and use dynamic vocabulary.
        ),
    )
    
    return response.text

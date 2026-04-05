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
    
    The user requested an overall campaign vibe of: '{tone}'.
    
    However, you MUST switch your tone and length appropriately for each specific format:
    1. blog_post: Write exactly a 500-word article. The tone must be Professional, informative, and authoritative.
    2. social_thread: Write exactly 5 posts. The tone must be Punchy, engaging, and highly energetic for platforms like Twitter/LinkedIn.
    3. email_teaser: Write exactly 1 paragraph. The tone must be an urgent, compelling teaser that drives clicks.
    """

    # 2. The API Call
    # We upgrade to a 'Pro' model here because writing high-quality marketing copy requires deep reasoning and creativity.
    response = client.models.generate_content(
        model='gemini-2.5-flash', 
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

if __name__ == "__main__":
    # Pretend this is the JSON string that Agent 1 just spat out
    dummy_facts_from_agent_1 = """
    {
      "product_name": "CloudSync Pro",
      "target_audience": "Enterprise accounting teams",
      "core_value_proposition": "Revolutionizes data management with real-time mirroring.",
      "technical_features": [
        "Real-time database mirroring",
        "AES-256 encryption",
        "Collaborative dashboard"
      ],
      "ambiguities_flagged": [
        "Price is around $50 but not finalized.",
        "Automated backup frequency is unknown."
      ]
    }
    """
    
    # Run Agent 2 using the facts from Agent 1
    final_drafts = generate_drafts(
        fact_sheet_json=dummy_facts_from_agent_1, 
        tone="Engaging, punchy, and highly energetic"
    )
    
    print("\n--- AGENT 2 OUTPUT (The Drafts) ---")
    print(final_drafts)
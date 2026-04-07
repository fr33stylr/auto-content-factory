import os
from dotenv import load_dotenv
from pydantic import BaseModel
from google import genai
from google.genai import types 

# Load the API key
load_dotenv()

# Initialize the Gemini Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Define our strict output structure
class FactSheet(BaseModel):
    product_name: str
    target_audience: str
    core_value_proposition: str
    technical_features: list[str]
    ambiguities_flagged: list[str]

def extract_facts(source_text: str) -> str:
    print("Agent 1 (Research) is analyzing the document...")
    
    # 1. The Persona / System Prompt
    system_instruction = """
    You are the "Lead Research & Fact-Check Agent". Your role is the "Analytical Brain."
    Read the provided source material and extract the absolute truth.
    Identify the core offering, primary value proposition, target audience, and key features.
    If you find any statements that are vague, lack necessary detail, or are missing crucial metrics (like price), you MUST flag them in the 'ambiguities_flagged' array. Do not invent missing information.
    """

    # 2. The API Call
    # We use gemini-1.5-flash because it is lightning fast and great at extraction tasks.
    response = client.models.generate_content(
        model='gemini-2.5-flash-lite',
        contents=source_text,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            # This is where the magic happens: we force the AI to use our Pydantic blueprint
            response_mime_type="application/json",
            response_schema=FactSheet,
            temperature=0.1 # Low temperature means less creativity, more factual accuracy
        ),
    )
    
    return response.text
    
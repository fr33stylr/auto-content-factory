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
    Identify core product features, technical specifications, and the target audience.
    If you find any statements that are vague or lack necessary detail, you MUST flag them in the ambiguities_flagged array. Do not invent missing information.
    """

    # 2. The API Call
    # We use gemini-2.5-flash because it is lightning fast and great at extraction tasks.
    response = client.models.generate_content(
        model='gemini-2.5-flash',
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

# A messy dummy document to test our agent
dummy_raw_document = """
We are excited to announce our new product, CloudSync Pro! It's going to revolutionize how enterprise accounting teams manage their data. It features real-time database mirroring and AES-256 encryption. We also have a collaborative dashboard. I think the price is going to be around $50 a month, but marketing hasn't finalized that yet. It also has an automated backup feature, but I'm not sure how often it runs.
"""

if __name__ == "__main__":
    # Run the agent
    final_json = extract_facts(dummy_raw_document)
    
    # Print the result
    print("\n--- AGENT 1 OUTPUT (Source of Truth) ---")
    print(final_json)
    
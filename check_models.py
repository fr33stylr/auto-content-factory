from google import genai
from dotenv import load_dotenv
import os

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

print("🔍 Fetching available models...\n")

# Just print the raw name of every single model Google gives us
for model in client.models.list():
    print(f"✅ EXACT NAME: {model.name}")
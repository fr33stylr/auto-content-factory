from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import time
from google.genai import errors

# Import your custom AI agents
from agent_research import extract_facts
from agent_copywriter import generate_drafts
from agent_editor import review_drafts

app = FastAPI()

# Allow the Vite frontend (port 5173) to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define what data the frontend will send us
class CampaignRequest(BaseModel):
    source_text: str
    tone: str

# Create the web endpoint
@app.post("/generate")
def generate_campaign(request: CampaignRequest):
    print("🚀 Received request from frontend!")
    
    try:
    # --- Agent 1 ---
        print("Agent 1: Extracting facts...")
        fact_sheet_json = extract_facts(request.source_text)
        
        # --- The Feedback Loop ---
        is_approved = False
        attempt_count = 1
        max_attempts = 3
        final_drafts = ""
        
        while not is_approved and attempt_count <= max_attempts:

            print("Swarm cooling down...(3s) 🧊")
            time.sleep(3) # Cooldown period to prevent rate limits

            print(f"Agent 2: Drafting (Attempt {attempt_count})...")
            drafts_json = generate_drafts(fact_sheet_json, request.tone)
            
            print("Swarm cooling down...(3s) 🧊")
            time.sleep(3) # Cooldown period to prevent rate limits
            
            print("Agent 3: Reviewing...")
            editor_response = review_drafts(fact_sheet_json, drafts_json)
            editor_decision = json.loads(editor_response)
            
            if editor_decision.get("is_approved"):
                print("✅ Approved!")
                is_approved = True
                final_drafts = drafts_json
                break
            else:
                print(f"❌ Rejected: {editor_decision.get('feedback_notes')}")
                attempt_count += 1
                
        if is_approved:
            # Send the successful JSON back to the React frontend
            return {"status": "success", "data": json.loads(final_drafts)}
        else:
            return {"status": "failed", "message": "Editor rejected all attempts."}
    except errors.ClientError as e:
        if e.code == 429:
            print("⚠️ RATE LIMIT HIT!")
            return {"status": "error", "message": "The AI Swarm needs to cool down. Please wait 60 seconds and try again."}
        # Catch other API errors
        return {"status": "error", "message": f"API Error: {str(e)}"}
        
    # <-- 7. CATCH ANY OTHER CRASHES (e.g. JSON format errors) -->
    except Exception as e:
        print(f"⚠️ SERVER ERROR: {str(e)}")
        return {"status": "error", "message": f"System Error: {str(e)}"}
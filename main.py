import json
# Import the specialized functions from your agent files
from agent_research import extract_facts
from agent_copywriter import generate_drafts
from agent_editor import review_drafts

def run_content_factory(source_text: str, tone: str):
    print("🚀 Starting the Autonomous Content Factory...\n")

    # --- AGENT 1: THE RESEARCHER ---
    print("--- Step 1: Extracting Truth ---")
    fact_sheet_json = extract_facts(source_text)
    print("✅ Facts Extracted.\n")

    # --- THE FEEDBACK LOOP ---
    is_approved = False
    attempt_count = 1
    max_attempts = 3 # Prevent an infinite loop if the AI gets stuck
    
    # We pass the facts to Agent 2, but if Agent 3 rejects it, we loop back!
    # To make this work dynamically, we would normally pass the Editor's notes back into the 
    # Copywriter's prompt, but for this basic version, we just ask it to try again.
    while not is_approved and attempt_count <= max_attempts:
        print(f"--- Step 2: Drafting (Attempt {attempt_count}) ---")
        drafts_json = generate_drafts(fact_sheet_json, tone)
        
        print("--- Step 3: Editor Audit ---")
        editor_response = review_drafts(fact_sheet_json, drafts_json)
        
        # Parse the JSON response from the Editor
        editor_decision = json.loads(editor_response)
        
        if editor_decision.get("is_approved"):
            print("✅ Editor Approved the drafts!\n")
            is_approved = True
            break
        else:
            print(f"❌ Editor Rejected! Reason: {editor_decision.get('feedback_notes')}")
            print("🔄 Sending back to Copywriter...\n")
            attempt_count += 1

    if is_approved:
        print("🎉 CAMPAIGN READY 🎉")
        print(drafts_json)
    else:
        print("⚠️ Failed to generate approved content after 3 attempts.")

# --- RUN THE FACTORY ---
if __name__ == "__main__":
    # A dummy technical document
    raw_document = """
    Product: SecureVault V2. 
    It's our new enterprise password manager. It features Zero-Knowledge architecture and biometric login. 
    Target audience is IT Security Managers at mid-sized companies. 
    """
    
    run_content_factory(source_text=raw_document, tone="Professional and trustworthy")
# 🤖 Autonomous Content Factory

## The Problem
Marketing teams and creators often struggle with "AI hallucinations" and factual drift when generating platform-specific content from raw data. Manually converting technical product specs into engaging copy across multiple channels is time-consuming and prone to human and AI error, leading to inconsistent brand messaging and potential misinformation.

## The Solution
The Autonomous Content Factory utilizes a **Multi-Agent Swarm** architecture to automate the marketing lifecycle with built-in quality control. 
* **Fact-Grounded Research:** A specialized Researcher agent standardizes messy input into a "Source of Truth" JSON fact sheet.
* **Self-Correcting Loop:** An Editor agent audits every draft against the research facts; if inaccuracies are found, the content is rejected and sent back to the Copywriter for a mandatory rewrite.
* **Platform-Ready Outputs:** Instantly generates audited Blog Posts, Social Threads, and Email Teasers that are guaranteed to be 100% grounded in the original product data.

## Tech Stack
* **Programming Languages:** Python (Backend Logic), JavaScript (Frontend UI)
* **Frameworks:** FastAPI (Asynchronous API Handling), React.js (Vite)
* **APIs & Third-Party Tools:** Google Gemini 2.5 Flash API
* **Styling & UI:** Tailwind CSS, Framer Motion (Animations), Lucide React (Icons)
* **Deployment:** Vercel (Frontend Hosting), Render (Backend Hosting)

---

## Setup Instructions

#### 1. Backend Setup (FastAPI)
Navigate to the root directory and follow these steps to start the AI Swarm:
```bash
# Install required Python packages
pip install -r requirements.txt

# Set your Gemini API Key as an environment variable
# Windows: set GOOGLE_API_KEY=your_key_here
# Mac/Linux: export GOOGLE_API_KEY=your_key_here

# Run the FastAPI server locally
python api.py
```
#### 2.Frontend Setup (React)
Open a new terminal window and navigate to the frontend folder:
```bash
# Move to the frontend directory
cd frontend

# Install dependencies
npm install

# Run the project locally
npm run dev
```
---

## ✨ Features by Module
#### 🧠 The Swarm Logic
* **Researcher**: Extracts raw data and standardizes it into a factual JSON sheet.

* **Copywriter**: Drafts creative content in selected tones (Viral, Professional, Minimalist).

* **Editor**: Performs a cross-reference audit. If facts don't match the Source of Truth, the cycle repeats (Max 3 retries).

#### 💻 User Interface
* **Real-Time Logs**: A terminal-style feed showing live agent collaboration and "thinking" process.

* **Responsive Dashboard**: Fully optimized for both desktop and mobile devices.

* **Visual State Management**: Smooth transitions from raw data input to fully audited marketing results.

### 📸 Project Overview
#### 1. The Factory Input
The core interface for pasting product data and selecting the campaign personality.
<img width="1800" alt="Input Screen" src="https://www.google.com/search?q=https://via.placeholder.com/1800x900.png%3Ftext%3DInput%2BScreen%2BScreenshot" />

#### 2. Live Swarm Terminal
Real-time log feed showing the Researcher, Copywriter, and Editor agents collaborating.
<img width="1800" alt="Terminal Logs" src="https://www.google.com/search?q=https://via.placeholder.com/1800x900.png%3Ftext%3DTerminal%2BLogs%2BScreenshot" />

#### 3. Campaign Results
The final, audited marketing assets categorized by platform and ready for use.
<img width="1800" alt="Results Screen" src="https://www.google.com/search?q=https://via.placeholder.com/1800x900.png%3Ftext%3DResults%2BScreen%2BScreenshot" />

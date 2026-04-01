import { useState } from "react";

export default function App() {
  const [sourceText, setSourceText] = useState("");
  const [tone, setTone] = useState("Professional and authoritative");
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatLogs, setChatLogs] = useState(["System idle. Waiting for source document..."]);
  const [finalDrafts, setFinalDrafts] = useState(null);

  // THE BRIDGE: This function talks to your Python FastAPI server
  const startFactory = async () => {
    if (!sourceText) return alert("Please enter some source text first!");

    setIsProcessing(true);
    setFinalDrafts(null);
    setChatLogs([
      "🚀 System Initialized.",
      "🧠 Agent 1 (Researcher) is extracting facts...",
      "✍️ Agent 2 (Copywriter) is writing drafts...",
      "🧐 Agent 3 (Editor) is reviewing against the Fact-Sheet..."
    ]);

    try {
      const response = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_text: sourceText,
          tone: tone
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setChatLogs(prev => [...prev, "✅ Editor Approved! Campaign is ready."]);
        setFinalDrafts(data.data);
      } else {
        setChatLogs(prev => [...prev, "❌ Factory Failed: " + data.message]);
      }
    } catch (error) {
      setChatLogs(prev => [...prev, "⚠️ Connection Error. Is your Python server running?"]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 font-sans">
      
      {/* HEADER */}
      <header className="mb-8 border-b border-neutral-800 pb-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Autonomous Content Factory
        </h1>
        <p className="text-neutral-400">Marketing Campaign Assembly Line</p>
      </header>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMN 1: Inputs */}
        <div className="flex flex-col gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg">
            <h2 className="text-xl font-semibold mb-3">1. Campaign Start</h2>
            
            <select 
              className="w-full mb-3 bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-sm outline-none"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="Professional and authoritative">Tone: Professional</option>
              <option value="Punchy, energetic, and viral">Tone: Viral & Energetic</option>
              <option value="Technical and analytical">Tone: Technical</option>
            </select>

            <textarea 
              className="w-full h-32 bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Paste your raw technical document here..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
            />
            
            <button 
              onClick={startFactory}
              disabled={isProcessing}
              className={`w-full mt-3 font-semibold py-2 rounded-lg transition-colors ${
                isProcessing ? "bg-neutral-700 text-neutral-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              {isProcessing ? "Processing..." : "Initialize Agents"}
            </button>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg flex-grow min-h-[250px] flex flex-col">
            <h2 className="text-xl font-semibold mb-3">2. The Agent Room</h2>
            <div className="flex-grow border-2 border-dashed border-neutral-700 rounded-lg flex items-center justify-center bg-neutral-950/50">
              <p className="text-neutral-500 italic">[ 3D Spline Scene Ready ]</p>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Live Feed */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg flex flex-col">
          <h2 className="text-xl font-semibold mb-3">Live Collaboration Feed</h2>
          <div className="flex-grow bg-neutral-950 border border-neutral-700 rounded-lg p-4 font-mono text-sm overflow-y-auto space-y-2">
            {chatLogs.map((log, index) => (
              <div key={index} className="text-green-400">
                <span className="text-neutral-500">{`[${new Date().toLocaleTimeString()}] `}</span>
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 3: Final Output */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg flex flex-col h-[700px]">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Final Review View</h2>
          </div>
          
          <div className="flex-grow bg-neutral-950 border border-neutral-700 rounded-lg p-4 text-sm overflow-y-auto">
             {!finalDrafts ? (
               <p className="text-neutral-500 italic text-center mt-20">Drafts will appear here after Editor approval.</p>
             ) : (
               <div className="space-y-6">
                 <div>
                   <h3 className="text-blue-400 font-bold text-lg border-b border-neutral-800 pb-1 mb-2">Blog Post</h3>
                   <p className="text-neutral-300 whitespace-pre-wrap">{finalDrafts.blog_post}</p>
                 </div>
                 
                 <div>
                   <h3 className="text-blue-400 font-bold text-lg border-b border-neutral-800 pb-1 mb-2">Social Thread</h3>
                   <div className="space-y-3">
                     {finalDrafts.social_thread.map((tweet, i) => (
                       <div key={i} className="bg-neutral-800 p-3 rounded-lg border border-neutral-700 text-neutral-300">
                         {tweet}
                       </div>
                     ))}
                   </div>
                 </div>

                 <div>
                   <h3 className="text-blue-400 font-bold text-lg border-b border-neutral-800 pb-1 mb-2">Email Teaser</h3>
                   <p className="text-neutral-300 whitespace-pre-wrap">{finalDrafts.email_teaser}</p>
                 </div>
               </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
import { useState } from "react";
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';
import ShinyText from "./ShinyText";
import BorderGlow from "./BorderGlow";

export default function App() {
  const [appState, setAppState] = useState("LANDING"); // Can be "INPUT", "LOADING", or "RESULTS"
  const [sourceText, setSourceText] = useState("");
  const [tone, setTone] = useState("Professional and authoritative");
  const [chatLogs, setChatLogs] = useState([]);
  const [finalDrafts, setFinalDrafts] = useState(null);

  const startFactory = async () => {
    if (!sourceText) return alert("Please enter some source text first!");

    setAppState("LOADING");
    setChatLogs([
      "🚀 System Initialized.",
      "🧠 Agent 1 (Researcher) extracting facts...",
      "✍️ Agent 2 (Copywriter) drafting content...",
      "🧐 Agent 3 (Editor) running hallucination checks..."
    ]);

    try {
      const response = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_text: sourceText, tone: tone }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setFinalDrafts(data.data);
        setAppState("RESULTS"); // Move to the final reveal!
      } else {
        setChatLogs(prev => [...prev, "❌ Factory Failed: " + data.message]);
        // Stay on loading screen so they can read the error
      }
    } catch (error) {
      setChatLogs(prev => [...prev, "⚠️ Connection Error. Is your Python server running?"]);
    }
  };

  const resetFactory = () => {
    setSourceText("");
    setFinalDrafts(null);
    setAppState("INPUT");
  };

  return (
    <div className="relative h-screen text-white font-sans flex flex-col items-center justify-center p-6 z-0">
      
      {/* ---------------------------------------------------------------- */}
      {/* THE 3D SHADER GRADIENT BACKGROUND */}
      {/* ---------------------------------------------------------------- */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <ShaderGradientCanvas style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
<ShaderGradient
  animate="on"
  axesHelper="off"
  bgColor1="#000000"
  bgColor2="#000000"
  brightness={1}
  cAzimuthAngle={180}
  cDistance={2.8}
  cPolarAngle={80}
  cameraZoom={9.1}
  color1="#801821"
  color2="#000068"
  color3="#212121"
  destination="onCanvas"
  embedMode="off"
  envPreset="city"
  format="gif"
  fov={45}
  frameRate={10}
  gizmoHelper="hide"
  grain="on"
  lightType="3d"
  pixelDensity={1}
  positionX={0}
  positionY={0}
  positionZ={0}
  range="disabled"
  rangeEnd={40}
  rangeStart={0}
  reflection={0.1}
  rotationX={40}
  rotationY={0}
  rotationZ={-60}
  shader="defaults"
  type="waterPlane"
  uAmplitude={0}
  uDensity={1.5}
  uFrequency={0}
  uSpeed={0.3}
  uStrength={1.5}
  uTime={8}
  wireframe={false}
/>
        </ShaderGradientCanvas>
      </div>
      {/* ---------------------------------------------------------------- */}
      {/* STATE 0: THE SPLASH SCREEN */}
      {/* ---------------------------------------------------------------- */}
      {appState === "LANDING" && (
        <div className="flex flex-col items-center justify-center min-h-screen text-center animate-fade-in z-10 w-full px-4">
          
          {/* We added font-outward and italic here! */}
          <h1 className=" mb-4 drop-shadow-2xl flex items-center justify-center">
            <ShinyText text="Coast." speed={5} color="#e6e5e5" shineColor="#4d4c4c"  className="font-outward italic px-8 text-[12rem]" />
          </h1>
          
          <p className="text-neutral-400 md:text-3xl tracking-[0.1rem] mb-16">
            <ShinyText text="Do less. Publish more." speed={3} color="#a3a3a3" shineColor="#ffffff"  className="font-outward text-[5rem] py-5 " />
          </p>

          {/* Glowing Proximity Button */}
          <div 
            onClick={() => setAppState("INPUT")} 
            className="cursor-pointer active:scale-95 transition-transform drop-shadow-2xl"
          >
            <BorderGlow
              edgeSensitivity={40}
              glowColor="210 100 85" /* Icy blue-white glow */
              backgroundColor="#000000" /* Deep dark gray to blend with the background */
              borderRadius={50} /* 50px makes it a perfect pill shape */
              glowRadius={50}
              glowIntensity={1}
              coneSpread={30}
              animated={true}
              colors={['#ffffff', '#93c5fd', '#3b82f6']} /* Silver, light blue, and bright blue */
              className="w-auto inline-block"
            >
              <div className="px-12  text-gray font-outward italic text-[3rem] tracking-wide flex items-center justify-center">
                start now.
              </div>
            </BorderGlow>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* STATE 1: THE MINIMALIST LANDING PAGE */}
      {/* ---------------------------------------------------------------- */}
      {appState === "INPUT" && (
        <div className="max-w-2xl w-full animate-fade-in">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
              Autonomous Content Factory
            </h1>
            <p className="text-neutral-400 text-lg">Deploy three AI agents to instantly assemble your marketing campaign.</p>
          </div>

          {/* THE NEW MASSIVE BORDER GLOW WRAPPER */}
          <BorderGlow
            edgeSensitivity={50} /* Increased slightly so it tracks the mouse from further away */
            glowColor="210 100 85"
            backgroundColor="#000000" /* Keeps the center pitch black so the glow only bleeds OUTWARD */
            borderRadius={16} /* 16px perfectly matches Tailwind's rounded-2xl */
            glowRadius={60}
            glowIntensity={0.8}
            coneSpread={35}
            animated={true}
            colors={['#ffffff', '#93c5fd', '#3b82f6']}
            className="w-full drop-shadow-2xl"
          >
            {/* CHANGED: Increased outer border to white/30 */}
            <div className="w-full bg-transparent border border-white/30 rounded-2xl p-8 relative z-10">
              
              {/* CHANGED: Increased select border to white/30 */}
              <select 
                className="w-full mb-5 bg-transparent border border-white/30 rounded-lg p-3 text-white outline-none focus:border-white/60 transition-colors appearance-none cursor-pointer"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="Professional and authoritative" className="bg-neutral-900 text-white">Tone: Professional & Authoritative</option>
                <option value="Punchy, energetic, and viral" className="bg-neutral-900 text-white">Tone: Viral & Energetic</option>
                <option value="Technical and analytical" className="bg-neutral-900 text-white">Tone: Deeply Technical</option>
              </select>

              {/* CHANGED: Increased textarea border to white/30 and placeholder text to neutral-500 */}
              <textarea 
                className="w-full h-48 bg-transparent border border-white/30 rounded-lg p-4 text-base text-white focus:ring-1 focus:ring-white/60 outline-none resize-none mb-8 placeholder:text-neutral-500 transition-all"
                placeholder="Paste your raw technical document, transcript, or feature list here..."
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
              />
              
              {/* CHANGED: Increased button border to white/40 so it stands out slightly from the inputs */}
              <button 
                onClick={startFactory} 
                className="w-auto mx-auto py-3 px-12 bg-transparent hover:bg-white/90 border border-white/40 hover:border-white rounded-[50px] text-white hover:text-black font-nippo font-bold text-[1.5rem] tracking-wide flex items-center justify-center transition-all active:scale-95"
              >
                Create
              </button>
            </div>
          </BorderGlow>
          
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* STATE 2: THE 3D LOADING ROOM */}
      {/* ---------------------------------------------------------------- */}
      {/* ---------------------------------------------------------------- */}
      {/* STATE 2: THE LOADING TERMINAL */}
      {/* ---------------------------------------------------------------- */}
      {appState === "LOADING" && (
        <div className="w-full max-w-4xl animate-fade-in flex flex-col items-center justify-center">
          
          <BorderGlow
            edgeSensitivity={50}
            glowColor="210 100 85"
            backgroundColor="#000000"
            borderRadius={16}
            glowRadius={60}
            glowIntensity={0.8}
            coneSpread={35}
            animated={true}
            colors={['#ffffff', '#93c5fd', '#3b82f6']}
            className="w-full drop-shadow-2xl"
          >
            {/* The transparent wireframe container matching the input form */}
            <div className="w-full bg-transparent border border-white/30 rounded-2xl p-8 h-[500px] flex flex-col relative z-10 text-left">
              
              <h2 className="text-2xl font-Chillax tracking-[0.2em] uppercase text-white border-b border-white/20 pb-4 mb-4">
                Live Agent Telemetry
              </h2>
              
              {/* The Log Window */}
              <div className="flex-grow bg-transparent rounded-xl font-mono text-sm md:text-base overflow-y-auto space-y-3 pr-4">
                {chatLogs.map((log, index) => (
                  <div key={index} className="text-neutral-300 animate-fade-in">
                    {/* Timestamp in dark gray, message in light gray */}
                    <span className="text-neutral-600 mr-3">{`[${new Date().toLocaleTimeString()}]`}</span>
                    {log}
                  </div>
                ))}
                {/* Adding a blinking cursor effect at the bottom */}
                <div className="text-white animate-pulse">_</div>
              </div>

            </div>
          </BorderGlow>

        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* STATE 3: THE FINAL PREVIEWS */}
      {/* ---------------------------------------------------------------- */}
      {/* ---------------------------------------------------------------- */}
      {/* STATE 3: THE RESULTS DASHBOARD */}
      {/* ---------------------------------------------------------------- */}
      {appState === "RESULTS" && finalDrafts && (
        <div className="absolute inset-0 w-full h-full overflow-y-auto pt-20 px-6 flex justify-center z-50">
          <div className="w-full max-w-6xl animate-fade-in mt-10 mb-32 relative z-10">
            
            {/* THE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <h1 className="text-4xl font-nippo tracking-wide text-white mb-2 uppercase">Campaign Ready</h1>
                <p className="text-green-400 font-mono text-sm">✅ Cleared by Editor-in-Chief Agent</p>
              </div>
              
              {/* CHANGED: Pill-shaped wireframe button to match the rest of the app */}
              {/* THE GLOWING RESTART BUTTON */}
              <BorderGlow
                edgeSensitivity={40}
                glowColor="210 100 85"
                backgroundColor="#000000" /* Keeps the inner button dark until hovered */
                borderRadius={50} /* CRITICAL: Matches your rounded-[50px] pill shape! */
                glowRadius={40}
                glowIntensity={0.8}
                coneSpread={30}
                animated={true}
                colors={['#ffffff', '#93c5fd', '#3b82f6']}
                className="w-auto inline-block drop-shadow-xl"
              >
                <button 
                  onClick={resetFactory} 
                  className="bg-transparent border border-white/40 px-8 py-3 rounded-[50px] font-nippo text-white  transition-all active:scale-95 relative z-10 w-full h-full"
                >
                  Start New Campaign
                </button>
              </BorderGlow>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              
              <div className="bg-transparent border border-white/50 rounded-2xl p-6 shadow-2xl col-span-1 lg:col-span-2">
                <h2 className="text-xl font-nippo mb-4 border-b border-white/20 pb-2 text-white">Blog Post</h2>
                <div 
                  className="prose prose-invert max-w-none text-neutral-300 space-y-4"
                  dangerouslySetInnerHTML={{ __html: finalDrafts.blog_post }}
                />
              </div>

              <div className="flex flex-col gap-6">
                
                {/* EMAIL PREVIEW */}
                {/* CHANGED: Transparent wireframe border */}
                <div className="bg-transparent border border-white/50 rounded-2xl p-6 shadow-2xl">
                  <h2 className="text-xl font-nippo mb-4 border-b border-white/20 pb-2 text-white">Email Teaser</h2>
                  <p className="text-neutral-300 italic">"{finalDrafts.email_teaser}"</p>
                </div>

                {/* SOCIAL PREVIEW */}
                {/* CHANGED: Transparent wireframe border for main box and inner tweets */}
                <div className="bg-transparent border border-white/50 rounded-2xl p-6 shadow-2xl">
                  <h2 className="text-xl font-nippo mb-4 border-b border-white/20 pb-2 text-white">Social Thread</h2>
                  <div className="space-y-4">
                    {finalDrafts.social_thread.map((tweet, i) => (
                      <div key={i} className="bg-transparent p-4 rounded-xl border border-white/20 text-sm text-neutral-300">
                        {tweet}
                      </div>
                    ))}
                  </div>
                </div>
                
              </div>
            </div>
            
            {/* THE NUCLEAR SPACER */}
            <div className="h-32 w-full flex-shrink-0 pointer-events-none"></div>
          </div>
        </div>
      )}

    </div>
  );
}
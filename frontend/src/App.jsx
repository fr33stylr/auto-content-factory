import { useState, useEffect } from "react";
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';
import ShinyText from "./ShinyText";
import BorderGlow from "./BorderGlow";
import CircularText from "./CircularText";

export default function App() {
  const [appState, setAppState] = useState("LANDING"); // Can be "INPUT", "LOADING", or "RESULTS"
  const [sourceText, setSourceText] = useState("");
  const [tone, setTone] = useState("Professional and authoritative");
  const [chatLogs, setChatLogs] = useState([]);
  const [finalDrafts, setFinalDrafts] = useState(null);
  const [isBooting, setIsBooting] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const tones = [
    "Professional & Authoritative",
    "Viral & Energetic",
    "Deeply Technical"
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBooting(false);
    }, 2500); // 1.5 seconds feels premium and deliberate
    return () => clearTimeout(timer);
  }, []);

  const handleRestart = () => {
    // 1. Instantly trigger the black boot screen overlay
    setIsBooting(true);

    // 2. Reset all your data silently behind the black screen
    setAppState("INPUT"); // (Or "INPUT" if you want to skip the landing page)
    setSourceText("");
    setChatLogs([]);
    timerId.forEach(clearTimeout); // Clear any lingering timers from the previous run
    // 3. Turn the boot screen off after 3 seconds (matching your animation!)
    setTimeout(() => {
      setIsBooting(false);
    }, 5000); 
  };

  const startFactory = async () => {
    if (!sourceText) return alert("Please enter some source text first!");

    setAppState("LOADING");
    setChatLogs([]); 

    // 1. Create an array to hold all our active timers
    const activeTimeouts = [];

    const fakeMessages = [
      "🚀 System Initialized. Connecting to Swarm...",
      "🧠 Agent 1 (Researcher) scanning source document...",
      "🔍 Identifying key entities and core value props...",
      "✍️ Agent 2 (Copywriter) drafting multi-channel content...",
      "🎨 Applying the requested tone and style guides...",
      "🧐 Agent 3 (Editor) running hallucination checks...",
      "📦 Finalizing assets for deployment..."
    ];

    // Push a new log every 2 seconds AND save the timer ID
    fakeMessages.forEach((msg, index) => {
      const timerId = setTimeout(() => {
        const exactTime = new Date().toLocaleTimeString();

        setChatLogs(prev => [...prev, {text: msg, timestamp: exactTime}]);
      }, index * 2700);
      
      activeTimeouts.push(timerId); // <--- Save it to our kill list
    });

    // 2. THE REAL AI CALL
    try {
      const response = await fetch("https://auto-content-factory.onrender.com/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_text: sourceText, tone: tone }),
      });

      const data = await response.json();

      if (data.status === "success") {
        const transitionTimer = setTimeout(() => {
          setFinalDrafts(data.data);
          setAppState("RESULTS");
        }, 13000); 
        activeTimeouts.push(transitionTimer); 
      } else {
        // THE KILL SWITCH: Backend rejected the prompt (e.g. 404 model not found)
        activeTimeouts.forEach(clearTimeout); 
        setChatLogs(prev => [...prev, "❌ Factory Failed: " + data.message]);
      }
    } catch (error) {
      // THE KILL SWITCH: Backend is completely offline
      activeTimeouts.forEach(clearTimeout); 
      setChatLogs(prev => [...prev, "⚠️ Connection Error. Is your Python server running?"]);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden text-white font-sans flex flex-col items-center justify-center p-6 z-0">

      {/* ---------------------------------------------------------------- */}
      {/* THE BOOT SEQUENCE (Overlays everything else) */}
      {/* ---------------------------------------------------------------- */}
      {isBooting && (
        <div className="absolute inset-0 z-[999] bg-black flex flex-col items-center justify-center animate-fade-out" style={{ animationDelay: '2.5s' }}>
           
           {/* The Container for the spinning text */}
           <div className="relative flex items-center justify-center mb-8">
             {/* The Spinning Text */}
             <CircularText 
               text="COAST • COAST • COAST • " 
               onHover="speedUp" 
               spinDuration={10} /* Sped up slightly for a loading screen */
               className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
             />
             <div className="absolute text-3xl text-white animate-pulse">
               ⚡
             </div>
           </div>
        </div>
      )}

      <div className={`transition-opacity duration-1000 ${isBooting ? 'opacity-0' : 'opacity-100'} w-full h-full`}>
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
        <div className="flex flex-col items-center justify-center min-h-screen text-center animate-fade-in z-10 w-full px-2">
          
          {/* We added font-outward and italic here! */}
          <h1 className=" flex items-center justify-center">
            <ShinyText text="Coast." speed={3} color="#bababa" shineColor="#4a4a4a"  className="-mt-18 leading-none font-outward text-transparent [-webkit-text-stroke:0.5px_#969696] text-[16rem]" />
          </h1>
          
          <p className="text-neutral-400 md:text-3xl tracking mb-[8.5rem]">
            <ShinyText text="Do less. Publish more." speed={10} color="#ffffff" shineColor="#707070"  className=" font-melodrama text-[2.4 rem] " />
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
              <div className="px-9 py-4 text-black font-nippo text-[1.4rem] tracking-wide flex items-center justify-center text-transparent [-webkit-text-stroke:0.4px_white]">
                START NOW
              </div>
            </BorderGlow>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* STATE 1: THE MINIMALIST LANDING PAGE */}
      {/* ---------------------------------------------------------------- */}
      {appState === "INPUT" && (
      <div className="w-full max-w-3xl mx-auto h-full flex flex-col justify-center animate-fade-in">
        <div className="mb-10 pb-4 border-b border-neutral-800 flex justify-between items-end w-full max-w-4xl mx-auto">
        <div>
          <h1 className="text-neutral-200 font-nippo text-lg tracking-wide">
            Autonomous Content Factory
          </h1>
          <p className="text-neutral-500 text-sm font-mono tracking-wide">
            Multi-Agent Generation Protocol
          </p>
        </div>
        
        {/* A tiny status indicator for that authentic SaaS feel */}
        <div className="flex items-center gap-2 font-mono text-xs text-neutral-500">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          Systems Online
        </div>
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
            <div className="relative mb-5 w-full font-mono">
  {/* The Trigger Box */}
            <div 
              onClick={() => setIsOpen(!isOpen)}
              className="w-full bg-black border border-white/20 rounded-lg p-3 text-white cursor-pointer flex justify-between items-center hover:border-white/40 transition-all"
            >
              <span>Tone: {tone}</span>
              <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </div>

            {/* The All-Black Menu */}
            {isOpen && (
              <div className="absolute top-full left-0 w-full mt-1 bg-black border border-white/20 rounded-lg overflow-hidden z-[100] shadow-2xl">
                {tones.map((t) => (
                  <div 
                    key={t}
                    onClick={() => {
                      setTone(t);
                      setIsOpen(false);
                    }}
                    className="p-3 text-white hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-b-0"
                  >
                    {t}
                  </div>
                ))}
              </div>
            )}
          </div>




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
                className="w-auto mx-auto py-3 px-12 bg-transparent hover:bg-white/90 border border-white/40 hover:border-white rounded-[50px] text-white hover:text-black  font-nippo font-bold text-[1.5rem] tracking-wide flex items-center justify-center transition-all active:scale-95"
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
      <div className="w-full max-w-3xl mx-auto h-full flex flex-col justify-center animate-fade-in">
          
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
              
              <h2 className="text-2xl font tracking-[0.2em] uppercase text-white border-b border-white/20 pb-4 mb-4">
                Live Agent Telemetry
              </h2>
              
              {/* The Log Window */}
              <div className="flex-grow bg-transparent rounded-xl font-mono text-sm md:text-base overflow-y-auto space-y-3 pr-4">
                {chatLogs.map((log, index) => (
                  <div key={index} className="text-neutral-300 animate-fade-in">
                    {/* Timestamp in dark gray, message in light gray */}
                    <span className="text-neutral-600 mr-3">{log.timestamp}</span>
                    {log.msg}
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
              <button 
                onClick={handleRestart}
                className="relative inline-block w-auto transition-transform active:scale-95 drop-shadow-xl cursor-pointer outline-none overflow-visible bg-transparent border-none p-1"
              >
                <BorderGlow
                  edgeSensitivity={40}
                  glowColor="210 100 85"
                  backgroundColor="#000000" 
                  borderRadius={50} 
                  glowRadius={40}
                  glowIntensity={0.8}
                  coneSpread={30}
                  animated={true}
                  colors={['#ffffff', '#93c5fd', '#3b82f6']}
                  className="w-full h-full pointer-events-none" 
                >
                  {/* Changed from <button> to <div> so we don't have a button inside a button */}
                  <div className="bg-transparent border border-white/40 px-8 py-3 rounded-[50px] font-nippo text-white relative z-10 flex items-center justify-center w-full h-full">
                    Start New Campaign
                  </div>
                </BorderGlow>
              </button>
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
    </div>
  );
}
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useFocusStore } from "@/store/useFocusStore";
import { useAgentStore } from "@/store/useAgentStore";
import { cn } from "@/lib/utils";

import { chat } from "@/lib/ai";

export default function CompanionLayer() {
  const { isActive: isFocusing } = useFocusStore();
  const { isAgentRunning } = useAgentStore();
  const [mood, setMood] = useState<'idle' | 'happy' | 'focus' | 'thinking' | 'running'>('idle');
  const [message, setMessage] = useState<string | null>("Hello! I'm your Studyn Pet. Type below to chat! ✨");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [pos, setPos] = useState({ x: 100, y: 100 });

  // Auto-hide when idle
  useEffect(() => {
    let hideTimeout: NodeJS.Timeout;
    const resetTimer = () => {
      // We only auto-hide if we are not typing/running
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        if (!isAgentRunning && !isFocusing && !isTyping && !isHidden) {
          setIsHidden(true);
        }
      }, 5000); // Hide after 5s of inactivity
    };

    // Listen for activity ONLY to reset the hide timer
    // NOT to wake up (wake up is via click)
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      clearTimeout(hideTimeout);
    };
  }, [isAgentRunning, isFocusing, isTyping, isHidden]);

  const handleChat = async () => {
    if (!input.trim() || isTyping) return;
    
    const userQuery = input;
    setInput("");
    setIsTyping(true);
    setMood('thinking');
    setMessage(null);

    try {
      const response = await chat(userQuery, "You are a cute, helpful AI study pet. YOU MUST RESPOND IN UNDER 15 WORDS. Be encouraging and brief.");
      setMessage(response);
      setMood('happy');
      setTimeout(() => {
        setMessage(null);
        setMood('idle');
      }, 8000);
    } catch {
      setMessage("I'm exhausted! Check your Groq key.");
      setMood('idle');
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    const syncPetState = () => {
      if (isAgentRunning) {
        setMood('running');
        setMessage("I'm helping the agent now!");
      } else if (isFocusing) {
        setMood('focus');
        setMessage("Shhh... stay focused!");
      }
    };
    syncPetState();
  }, [isAgentRunning, isFocusing]);

  // Calculate final animation properties (Top-Right with healthy margin)
  const cornerX = typeof window !== 'undefined' ? window.innerWidth - 120 : 1000;
  const cornerY = 40; // High margin from top

  return (
    <div className="fixed inset-0 pointer-events-none z-[150]">
      {/* The Pet Widget */}
      <motion.div
        drag
        dragMomentum={false}
        dragConstraints={{ 
          left: 10, 
          right: typeof window !== 'undefined' ? window.innerWidth - 140 : 1000, 
          top: 10, 
          bottom: typeof window !== 'undefined' ? window.innerHeight - 180 : 800 
        }}
        onDragEnd={(_, info) => {
          setPos({
            x: pos.x + info.offset.x,
            y: pos.y + info.offset.y
          });
        }}
        onClick={() => {
          if (isHidden) setIsHidden(false);
        }}
        animate={{ 
          opacity: isHidden ? 0.3 : 1,
          scale: isHidden ? 0.6 : 1,
          x: isHidden ? cornerX : pos.x,
          y: isHidden ? cornerY : pos.y,
          filter: isHidden ? 'grayscale(1) blur(2px)' : 'grayscale(0) blur(0px)'
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="absolute w-32 flex flex-col items-center pointer-events-auto cursor-grab active:cursor-grabbing"
      >
        <div className="relative w-32 h-32 group">
          {/* Speech Bubble (Message) - MOVED TO TOP */}
          <AnimatePresence>
            {message && !isHidden && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: -40, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute -top-1 left-1/2 -translate-x-1/2 z-40"
              >
                <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl shadow-xl min-w-[120px] max-w-[180px]">
                  <p className="text-[9px] font-bold text-white/80 text-center leading-tight">
                    {message}
                  </p>
                </div>
                {/* Arrow pointing DOWN to pet */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/10 rotate-45 border-b border-r border-white/10" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Thought Cloud (Thinking Mood) */}
          <AnimatePresence>
            {mood === 'thinking' && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.5 }}
                animate={{ opacity: 1, y: -35, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.5 }}
                className="absolute -top-1 left-1/2 -translate-x-1/2 z-30"
              >
                <div className="relative bg-white/40 backdrop-blur-2xl border border-white/40 px-4 py-2 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-1 min-w-[60px]">
                   <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]" />
                   <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]" />
                   <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]" />
                </div>
                <div className="absolute -bottom-2 left-[40%] w-3 h-3 bg-white/30 rounded-full backdrop-blur-md border border-white/20" />
                <div className="absolute -bottom-4 left-[30%] w-2 h-2 bg-white/20 rounded-full backdrop-blur-md border border-white/20" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pet Body Image */}
          <motion.img 
            src="/studyn_pet.png" 
            alt="Studyn Pet"
            draggable="false"
            className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] select-none pointer-events-none"
          />

          {/* Animated Face Overlays (Aligned to the cat robot's visor) */}
          <div className="absolute top-[39%] left-[42%] -translate-x-1/2 flex flex-col items-center gap-2">
            {/* Eyes - CLEARLY SEPARATED */}
            <div className="flex gap-5">
              <motion.div 
                animate={{ 
                  scaleY: mood === 'focus' ? 0.3 : (mood === 'happy' ? [1, 0.8, 1] : [1, 1, 0.1, 1, 1]),
                  height: (mood === 'running' || mood === 'thinking') ? [7, 12, 7] : 7,
                }} 
                transition={{ duration: 3, repeat: Infinity, times: [0, 0.4, 0.5, 0.6, 1] }}
                className={cn(
                  "w-2.5 rounded-full",
                  (mood === 'running' || mood === 'thinking') ? "bg-cyan-400 shadow-[0_0_15px_cyan]" : "bg-white/90 shadow-[0_0_10px_white]"
                )}
              />
              <motion.div 
                animate={{ 
                  scaleY: mood === 'focus' ? 0.3 : (mood === 'happy' ? [1, 0.8, 1] : [1, 1, 0.1, 1, 1]),
                  height: (mood === 'running' || mood === 'thinking') ? [7, 12, 7] : 7,
                }} 
                transition={{ duration: 3, repeat: Infinity, times: [0, 0.4, 0.5, 0.6, 1] }}
                className={cn(
                  "w-2.5 rounded-full",
                  (mood === 'running' || mood === 'thinking') ? "bg-cyan-400 shadow-[0_0_15px_cyan]" : "bg-white/90 shadow-[0_0_10px_white]"
                )}
              />
            </div>
            
            {/* Mouth - POSITIONED BELOW */}
            <motion.div
              animate={{ 
                scaleX: mood === 'focus' ? 1.4 : (mood === 'happy' ? 1.2 : 1),
                borderRadius: mood === 'happy' ? "0 0 100px 100px" : "100px",
                height: (mood === 'thinking' || mood === 'running') ? 6 : 2,
                width: (mood === 'thinking' || mood === 'running') ? 6 : 14,
                backgroundColor: (mood === 'running' || mood === 'thinking') ? "rgba(34, 211, 238, 0.6)" : "rgba(255, 255, 255, 0.5)"
              }}
              className="shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            />
          </div>

          {/* Glow Effect when Active */}
          <AnimatePresence>
            {(mood === 'running' || mood === 'focus' || mood === 'thinking') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1.5 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={cn(
                  "absolute inset-0 -z-10 blur-[50px] opacity-10",
                  (mood === 'running' || mood === 'thinking') ? "bg-cyan-500" : "bg-red-500"
                )}
              />
            )}
          </AnimatePresence>
        </div>

        {/* User Input Field */}
        <div className="mt-1 w-full flex flex-col items-center">
          {!isHidden && (
            <div className="w-full px-2">
               <input 
                 type="text"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                 placeholder="Chat..."
                 className="w-full bg-black/40 backdrop-blur-md border border-white/5 rounded-lg px-2 py-1 text-[9px] text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-white/10"
               />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

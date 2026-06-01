"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Sparkles, Brain, Bot } from "lucide-react";
import { useVoiceStore } from "@/store/useVoiceStore";
import { cn } from "@/lib/utils";

export default function VoiceInterface() {
  const { isListening, setListening, transcript, response, amplitude, updateAmplitude } = useVoiceStore();
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (isListening) {
      const animate = () => {
        updateAmplitude();
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      cancelAnimationFrame(animationRef.current);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isListening, updateAmplitude]);

  return (
    <AnimatePresence>
      {isListening && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center pointer-events-none">
          {/* Dark Backdrop with Bloom */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-2xl pointer-events-auto"
            onClick={() => setListening(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl flex flex-col items-center"
          >
            {/* Neural Ripple Visualizer */}
            <div className="relative w-96 h-96 flex items-center justify-center">
              <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl animate-pulse" />
              <div className="flex items-end justify-center gap-1.5 h-32 relative z-10">
                {amplitude.map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: `${h}%` }}
                    className="w-1.5 bg-white/40 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                ))}
              </div>
              
              {/* Outer Glow Rings */}
              {[1, 2, 3].map((r) => (
                <motion.div
                  key={r}
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ 
                    opacity: [0.1, 0.3, 0.1], 
                    scale: [1, 1.5, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: r * 0.5 }}
                  className="absolute w-64 h-64 border border-white/5 rounded-full"
                />
              ))}
            </div>

            {/* Transcript & Response */}
            <div className="text-center space-y-6 mt-12 px-12 relative z-20">
               <AnimatePresence mode="wait">
                 {transcript ? (
                   <motion.p 
                     key="transcript"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="text-2xl font-light tracking-tight text-white/40 italic"
                   >
                     &quot;{transcript}...&quot;
                   </motion.p>
                 ) : (
                   <motion.div 
                     key="prompt"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="flex flex-col items-center gap-4"
                   >
                      <div className="flex gap-2 p-2 px-4 bg-white/5 border border-white/10 rounded-full">
                         <Sparkles className="w-4 h-4 text-white/40" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Listening for Directive</span>
                      </div>
                      <p className="text-3xl font-bold tracking-tighter text-white">How can I assist your study flow?</p>
                   </motion.div>
                 )}
               </AnimatePresence>

               <AnimatePresence>
                 {response && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-12 p-8 bg-white/5 border border-white/10 rounded-[2.5rem] shadow-2xl"
                    >
                       <div className="flex items-center gap-3 mb-4 justify-center">
                          <Bot className="w-5 h-5 text-indigo-400" />
                          <span className="text-[11px] font-black uppercase tracking-widest text-white/40">Neural Response</span>
                       </div>
                       <p className="text-xl text-white font-medium leading-relaxed">{response}</p>
                    </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* UI Controls */}
            <div className="mt-12 flex gap-8 pointer-events-auto">
               <button 
                onClick={() => setListening(false)}
                className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/40"
               >
                  <X className="w-6 h-6" />
               </button>
               <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                  <Mic className="w-6 h-6 text-black fill-black" />
               </div>
               <button className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/40">
                  <Brain className="w-6 h-6" />
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

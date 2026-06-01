"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useFocusStore } from "@/store/useFocusStore";
import { Zap, Coffee, Trophy, X, Star, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const PARTICLE_COUNT = 30;
const STATIC_PARTICLES = [...Array(PARTICLE_COUNT)].map(() => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  x: Math.random() * 200 - 100,
  duration: 10 + Math.random() * 10
}));

export default function FocusOverlay() {
  const { 
    showNotification, notificationType, currentQuote, closeNotification, 
    timeLeft, sessionsCompleted, isImmersive, sessionType, isActive, toggleImmersive, pauseTimer
  } = useFocusStore();

  const [quoteIndex, setQuoteIndex] = useState(0);

  // Auto-rotate quotes in immersive mode
  useEffect(() => {
    if (isImmersive) {
      const id = setInterval(() => {
        setQuoteIndex(prev => prev + 1);
      }, 10000);
      return () => clearInterval(id);
    }
  }, [isImmersive]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isVisible = showNotification || isImmersive;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center overflow-hidden p-12 text-center"
        >
          {/* Cinematic Background */}
          <div className={cn(
            "absolute inset-0 transition-colors duration-1000",
            sessionType === 'work' ? "bg-radial-gradient from-blue-500/5 to-transparent" : "bg-radial-gradient from-emerald-500/5 to-transparent"
          )} />
          
          {/* Subtle Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
             {STATIC_PARTICLES.map((p, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 100 }}
                 animate={{ opacity: [0, 0.2, 0], y: -100, x: p.x }}
                 transition={{ duration: p.duration, repeat: Infinity, delay: i * 0.5 }}
                 className="absolute w-1 h-1 bg-white/40 rounded-full"
                 style={{ left: p.left, top: p.top }}
               />
             ))}
          </div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 100 }}
            className="relative space-y-12 max-w-4xl w-full"
          >
            {/* NOTIFICATION VIEW (START/END OF SESSION) */}
            {showNotification ? (
              <div className="space-y-12">
                {notificationType === 'complete' ? (
                  <div className="space-y-12">
                     <div className="flex flex-col items-center gap-8">
                        <motion.div 
                          animate={{ rotate: [0, -5, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 4 }}
                          className="w-32 h-32 rounded-[3rem] bg-white/10 flex items-center justify-center border-2 border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                        >
                           <Trophy className="w-14 h-14 text-white" />
                        </motion.div>
                        <div className="space-y-4">
                           <h2 className="text-7xl font-bold tracking-tighter text-white uppercase italic">Session <span className="font-light not-italic">Complete</span></h2>
                           <p className="text-xl text-white/40 font-medium tracking-widest uppercase">You have attained mastery through focus.</p>
                        </div>
                     </div>
    
                     <div className="flex flex-wrap items-center justify-center gap-8 max-w-4xl mx-auto">
                        <div className="flex-1 min-w-[200px] p-8 bg-white/[0.03] rounded-[2rem] border border-white/5">
                           <div className="text-[10px] text-white/20 uppercase font-black tracking-widest mb-2">Total Sessions</div>
                           <div className="text-3xl font-bold">{sessionsCompleted}</div>
                        </div>
                        <div className="flex-1 min-w-[200px] p-8 bg-white/[0.03] rounded-[2rem] border border-white/5 relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-4 opacity-10">
                              <Star className="w-12 h-12 text-white" />
                           </div>
                           <div className="text-[10px] text-white/20 uppercase font-black tracking-widest mb-2">XP Earned</div>
                           <div className="text-3xl font-bold text-white/90">+{sessionsCompleted * 100}</div>
                        </div>
                     </div>
                  </div>
                ) : (
                  <div className="space-y-12">
                    <div className="flex flex-col items-center gap-8">
                      <div className={cn(
                        "w-24 h-24 rounded-[2.5rem] flex items-center justify-center border-2",
                        notificationType === 'work' ? "border-white/20 bg-white/5" : "border-white/10 bg-white/[0.02]"
                      )}>
                        {notificationType === 'work' ? <Zap className="w-10 h-10 text-white/80" /> : <Coffee className="w-10 h-10 text-white/40" />}
                      </div>
                      
                      <div className="space-y-4">
                        <h2 className="text-6xl font-light tracking-tight text-white">
                          {notificationType === 'work' ? "Focus Time" : "Enjoy Your Break"}
                        </h2>
                        <p className="text-xl text-white/30 font-medium tracking-wide">
                          {notificationType === 'work' ? "Time to study and level up." : "Your break starts now."}
                        </p>
                      </div>
                    </div>
    
                    <div className="text-9xl font-extralight tracking-tighter text-white tabular-nums opacity-90">
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={closeNotification}
                  className="mt-12 px-12 py-5 bg-white text-black rounded-[2.5rem] text-xs font-black uppercase tracking-[0.4em] transition-all hover:scale-105 active:scale-95"
                >
                  {notificationType === 'complete' ? "Continue Journey" : "Start Session"}
                </button>
              </div>
            ) : (
              /* IMMERSIVE FOCUS MODE (PERSISTENT VIEW) */
              <div className="space-y-16 py-12">
                 <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 flex items-center justify-center gap-4">
                    <div className="w-8 h-px bg-white/10" />
                    {sessionType === 'work' ? 'Deep Focus Active' : 'Relaxation Phase'}
                    <div className="w-8 h-px bg-white/10" />
                 </div>

                 <motion.div 
                   key={timeLeft}
                   className="text-[12rem] font-extralight tracking-tighter text-white tabular-nums opacity-90 leading-none"
                 >
                    {formatTime(timeLeft)}
                 </motion.div>

                 <div className="max-w-xl mx-auto space-y-4">
                    <AnimatePresence mode="wait">
                      <motion.p 
                        key={quoteIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-2xl text-white/40 italic font-light leading-relaxed"
                      >
                        &quot;{currentQuote}&quot;
                      </motion.p>
                    </AnimatePresence>
                    <div className="flex items-center justify-center gap-1.5 pt-4">
                       {[...Array(4)].map((_, i) => (
                         <div key={i} className={cn("h-1 rounded-full transition-all duration-1000", i === (quoteIndex % 4) ? "w-8 bg-white/20" : "w-1.5 bg-white/5")} />
                       ))}
                    </div>
                 </div>

                 <div className="pt-12 flex items-center justify-center gap-6">
                    <button 
                      onClick={() => toggleImmersive(false)}
                      className="group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
                    >
                       <Minimize2 className="w-4 h-4 text-white/40 group-hover:text-white/60" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 group-hover:text-white/60">Minimize</span>
                    </button>
                    <button 
                      onClick={() => { pauseTimer(); toggleImmersive(false); }}
                      className="group flex items-center gap-3 px-8 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl transition-all"
                    >
                       <X className="w-4 h-4 text-red-500/40 group-hover:text-red-500/60" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/30 group-hover:text-red-500/60">Stop Session</span>
                    </button>
                 </div>
              </div>
            )}
          </motion.div>

          {/* Background Ambient Glow */}
          {isActive && (
            <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-gradient-to-t from-white/[0.03] to-transparent pointer-events-none" />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

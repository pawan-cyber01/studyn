"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Timer, Zap } from "lucide-react";
import { useFocusStore } from "@/store/useFocusStore";
import { useGamificationStore } from "@/store/useGamificationStore";
import { cn } from "@/lib/utils";

export default function DynamicIsland() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isActive, sessionType, timeLeft } = useFocusStore();
  const { xp, level } = useGamificationStore();
  
  const isFocusMode = isActive && sessionType === 'work';
  
  // Format time for the island
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200]">
      <motion.div
        layout
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "bg-black/80 backdrop-blur-3xl border border-white/10 rounded-full cursor-pointer overflow-hidden flex items-center gap-4 transition-all duration-500 shadow-2xl",
          isExpanded ? "p-6 rounded-[2.5rem] w-[350px]" : "px-4 py-2 w-auto min-w-[140px]"
        )}
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-3 w-full justify-between"
            >
              {isFocusMode ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold text-white/90 tabular-nums">{formatTime(timeLeft)}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Studyn OS</span>
                </div>
              )}
              
              <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                <span className="text-[10px] font-bold text-white/60">Lv. {level}</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="w-full space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Timer className={cn("w-5 h-5", isFocusMode ? "text-red-400" : "text-white/40")} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Session</div>
                    <div className="text-sm font-bold text-white">
                      {isFocusMode ? "Focusing..." : "Ready to Start"}
                    </div>
                  </div>
                </div>
                <div className="text-xl font-black tabular-nums text-white">
                  {formatTime(timeLeft)}
                </div>
              </div>

              <div className="h-px bg-white/5" />

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col gap-1">
                  <div className="text-[8px] font-black uppercase tracking-widest text-white/20">Current XP</div>
                  <div className="text-xs font-bold text-white">{xp} XP</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col gap-1">
                  <div className="text-[8px] font-black uppercase tracking-widest text-white/20">Status</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <div className="text-xs font-bold text-white">Online</div>
                  </div>
                </div>
              </div>

              <button className="w-full p-3 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:scale-[0.98] transition-transform">
                View Full Stats
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

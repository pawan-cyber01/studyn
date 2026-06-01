"use client";

import { motion } from "framer-motion";
import { useFocusStore } from "@/store/useFocusStore";
import { useWidgetStore } from "@/store/useWidgetStore";
import { Zap, Play, Pause, RotateCcw, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FocusWidgetProps {
  id: string;
  x?: number;
  y?: number;
}

export default function FocusWidget({ id, x: propX, y: propY }: FocusWidgetProps) {
  const { 
    timeLeft, isActive, sessionType, currentCycle, totalCyclesGoal,
    startTimer, pauseTimer, resetTimer, toggleImmersive
  } = useFocusStore();
  const { updateWidget, removeWidget, activeWidgets } = useWidgetStore();
  const widget = activeWidgets.find(w => w.id === id);
  const x = propX ?? widget?.x ?? 100;
  const y = propY ?? widget?.y ?? 100;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (sessionType === 'work' ? 1500 : 300)) * 100;

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
        updateWidget(id, { x: x + info.offset.x, y: y + info.offset.y });
      }}
      initial={{ x, y, opacity: 0, scale: 0.9 }}
      animate={{ x, y, opacity: 1, scale: 1 }}
      className="absolute group w-[300px] bg-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl"
    >
      {/* Close Button - Premium Style */}
      <button 
        onClick={(e) => { e.stopPropagation(); removeWidget(id); }}
        className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:border-red-500 z-50"
      >
        <X className="w-3.5 h-3.5 text-white" />
      </button>

      {/* Header */}
      <div className="p-4 flex items-center gap-2 border-b border-white/5 bg-white/[0.02]">
        <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Focus Engine</span>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32 flex items-center justify-center">
             <svg className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="60" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                <motion.circle 
                   cx="64" cy="64" r="60" fill="none" stroke="currentColor" strokeWidth="4" 
                   strokeDasharray="377"
                   animate={{ strokeDashoffset: 377 - (377 * progress) / 100 }}
                   className={cn("transition-colors duration-1000", sessionType === 'work' ? "text-blue-500" : "text-emerald-500")}
                />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-extralight tracking-tighter tabular-nums">
                   {formatTime(timeLeft)}
                </div>
                <div className="text-[8px] font-black uppercase tracking-widest text-white/20">
                   {sessionType === 'work' ? 'focus' : 'break'}
                </div>
             </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={resetTimer}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/30 hover:text-white/60 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={isActive ? pauseTimer : () => { startTimer(); toggleImmersive(true); }}
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95",
                isActive ? "bg-white/10 text-white" : "bg-white text-black shadow-lg"
              )}
            >
              {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
            </button>
            <button 
              onClick={() => toggleImmersive(true)}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/30 hover:text-white/60 transition-all"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5">
           <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Session Progress</span>
              <div className="flex gap-1">
                 {[...Array(totalCyclesGoal)].map((_, i) => (
                    <div key={i} className={cn("w-3 h-1 rounded-full", i < currentCycle - 1 ? "bg-white/40" : "bg-white/5")} />
                 ))}
              </div>
           </div>
           <div className="text-right">
              <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Goal</span>
              <div className="text-[10px] font-bold">Cycle {currentCycle}/{totalCyclesGoal}</div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

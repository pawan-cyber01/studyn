"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, List, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWidgetStore } from "@/store/useWidgetStore";

export default function StopwatchWidget({ id }: { id?: string }) {
  const { removeWidget, updateWidget, activeWidgets } = useWidgetStore();
  const widget = activeWidgets.find(w => w.id === id);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => setTime(t => t + 10), 10);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const msec = Math.floor((ms % 1000) / 10);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${msec.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={{
        left: 0,
        right: typeof window !== "undefined" ? window.innerWidth - 300 : 0,
        top: 0,
        bottom: typeof window !== "undefined" ? window.innerHeight - 400 : 0,
      }}
      onDragEnd={(_, info) => {
        if (id) {
          updateWidget(id, { 
            x: (widget?.x || 0) + info.offset.x, 
            y: (widget?.y || 0) + info.offset.y 
          });
        }
      }}
      whileDrag={{ scale: 1.05, cursor: "grabbing" }}
      initial={{ x: widget?.x || 700, y: widget?.y || 150, opacity: 0 }}
      animate={{ x: widget?.x, y: widget?.y, opacity: 1 }}
      className="absolute cursor-grab select-none w-[300px] group"
    >
      {/* Close Button - Premium Style */}
      {id && (
        <button 
          onClick={(e) => { e.stopPropagation(); removeWidget(id); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:border-red-500 z-50"
        >
          <X className="w-3.5 h-3.5 text-white" />
        </button>
      )}

      <div className="glass-panel rounded-[2.5rem] p-8 shadow-2xl bg-white/[0.01] backdrop-blur-[40px] flex flex-col h-full hover:border-white/10 transition-colors relative">
        <div className="flex-1 flex flex-col items-center justify-center relative mb-8">
          {/* Animated Ring */}
          <svg className="w-40 h-40 -rotate-90">
            <circle cx="80" cy="80" r="76" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/5" />
            <motion.circle 
              cx="80" cy="80" r="76" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3" 
              className="text-white/30" 
              strokeDasharray="477" 
              animate={{ strokeDashoffset: isActive ? 0 : 477 }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </svg>
          
          <div className="absolute flex flex-col items-center">
            <div className="text-3xl font-light tabular-nums tracking-tighter text-white">
              {formatTime(time)}
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mt-1">Elapsed</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setIsActive(!isActive)}
            className="flex-1 aspect-5-3 btn-premium"
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => { setTime(0); setLaps([]); setIsActive(false); }}
            className="w-16 aspect-square btn-premium opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setLaps([time, ...laps])}
            className="w-16 aspect-square btn-premium opacity-30"
            disabled={!isActive}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-24 overflow-y-auto space-y-1.5 scroll-smooth pr-2 mt-6">
          <AnimatePresence>
            {laps.map((lap, i) => (
              <motion.div 
                key={`${i}-${lap}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex justify-between items-center text-[10px] text-white/40 border-b border-white/5 pb-1"
              >
                <span className="font-black uppercase tracking-widest">Lap {laps.length - i}</span>
                <span className="tabular-nums font-medium">{formatTime(lap)}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

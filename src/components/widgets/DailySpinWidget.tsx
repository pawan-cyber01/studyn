"use client";

import { motion } from "framer-motion";
import { Gift, Sparkles, Trophy, X } from "lucide-react";
import { useGamificationStore } from "@/store/useGamificationStore";
import { useWidgetStore } from "@/store/useWidgetStore";
import { useOSStore } from "@/store/useOSStore";
import { cn } from "@/lib/utils";

export default function DailySpinWidget({ id }: { id?: string }) {
  const { lastSpinDate } = useGamificationStore();
  const { removeWidget, updateWidget, activeWidgets } = useWidgetStore();
  const { openWindow } = useOSStore();
  
  const widget = activeWidgets.find(w => w.id === id);
  const canSpin = lastSpinDate !== new Date().toDateString();

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={{
        left: 20,
        right: typeof window !== "undefined" ? window.innerWidth - 320 : 0,
        top: 20,
        bottom: typeof window !== "undefined" ? window.innerHeight - 350 : 0,
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
      initial={{ x: widget?.x || 100, y: widget?.y || 100, opacity: 0 }}
      animate={{ x: widget?.x, y: widget?.y, opacity: 1 }}
      className="absolute cursor-grab select-none w-[300px] group"
    >
      {id && (
        <button 
          onClick={(e) => { e.stopPropagation(); removeWidget(id); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:border-red-500 z-50"
        >
          <X className="w-3.5 h-3.5 text-white" />
        </button>
      )}

      <div className="glass-panel rounded-[2.5rem] p-6 bg-black/40 backdrop-blur-[100px] flex flex-col items-center justify-center text-center gap-4 hover:border-white/10 transition-colors border border-white/5 relative h-full">
        <div className="relative">
          <div className={cn(
            "w-20 h-20 rounded-[2rem] flex items-center justify-center border transition-all duration-500",
            canSpin 
              ? "bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]" 
              : "bg-white/5 border-white/10"
          )}>
            <Gift className={cn("w-10 h-10", canSpin ? "text-emerald-400" : "text-white/20")} />
          </div>
          {canSpin && (
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </motion.div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-black text-white uppercase tracking-widest">
            {canSpin ? "Daily Reward" : "Reward Collected"}
          </h3>
          <p className="text-[10px] text-white/30 font-medium uppercase tracking-tighter">
            {canSpin ? "Your lucky spin is ready" : "Check back in 24 hours"}
          </p>
        </div>

        <button
          onClick={() => openWindow('dailyspin', 'Daily Spin', 'dailyspin')}
          className={cn(
            "w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all",
            canSpin 
              ? "bg-white text-black hover:scale-105 active:scale-95" 
              : "bg-white/5 text-white/20 border border-white/5"
          )}
        >
          {canSpin ? "SPIN NOW" : "VIEW STATUS"}
        </button>

        {!canSpin && (
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-white/20 uppercase tracking-widest">
             <Trophy className="w-3 h-3" /> Streak: Active
          </div>
        )}
      </div>
    </motion.div>
  );
}

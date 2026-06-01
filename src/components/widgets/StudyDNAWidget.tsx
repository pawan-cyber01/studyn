"use client";

import { motion } from "framer-motion";
import { Dna, Brain, Sparkles, X } from "lucide-react";
import { useDNAStore } from "@/store/useDNAStore";
import { useOSStore } from "@/store/useOSStore";

import { useWidgetStore } from "@/store/useWidgetStore";

export default function StudyDNAWidget({ id }: { id?: string }) {
  const { personalityTags, insights } = useDNAStore();
  const { removeWidget, updateWidget, activeWidgets } = useWidgetStore();
  const { openWindow } = useOSStore();

  const widget = activeWidgets.find(w => w.id === id);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={{
        left: 20,
        right: typeof window !== "undefined" ? window.innerWidth - 320 : 0,
        top: 20,
        bottom: typeof window !== "undefined" ? window.innerHeight - 250 : 0,
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

      <div className="glass-panel rounded-[2.5rem] p-5 flex flex-col gap-4 relative overflow-hidden bg-black/40 backdrop-blur-[100px] border border-white/5 hover:border-white/10 transition-colors h-full">
        {/* Helix Background Glow */}
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
          <Dna className="w-24 h-24 text-blue-400" />
        </div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Dna className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Study DNA</span>
          </div>
          <div className="flex items-center gap-1">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-blue-400"
            />
            <span className="text-[8px] font-bold text-blue-400/60 uppercase">Active</span>
          </div>
        </div>

        <div className="flex-1 space-y-4 relative z-10">
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-white/80 italic">
              {personalityTags[0] || "Synthesizing Profile..."}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {personalityTags.slice(1, 3).map((tag, i) => (
                <span key={i} className="text-[8px] font-black uppercase tracking-widest text-white/20 bg-white/5 px-2 py-0.5 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 group-hover:border-white/10 transition-all">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/40">
              <Brain className="w-3 h-3 text-emerald-400" /> Peak Insight
            </div>
            <p className="text-[10px] text-white/60 leading-relaxed line-clamp-2">
              {insights[0] || "Analyze your DNA to reveal hidden productivity patterns."}
            </p>
          </div>
        </div>

        <button
          onClick={() => openWindow('studydna', 'Study DNA', 'studydna')}
          className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3 h-3" /> Full Analysis
        </button>
      </div>
    </motion.div>
  );
}

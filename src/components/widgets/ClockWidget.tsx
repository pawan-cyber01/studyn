"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useWidgetStore } from "@/store/useWidgetStore";

export default function ClockWidget({ id }: { id?: string }) {
  const [time, setTime] = useState(new Date());
  const { removeWidget, updateWidget, activeWidgets } = useWidgetStore();
  const widget = activeWidgets.find(w => w.id === id);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';

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
      {/* Close Button - Premium Style */}
      {id && (
        <button 
          onClick={(e) => { e.stopPropagation(); removeWidget(id); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:border-red-500 z-50"
        >
          <X className="w-3.5 h-3.5 text-white" />
        </button>
      )}

      <div className="glass-panel rounded-[2.5rem] p-8 bg-transparent backdrop-blur-[100px] flex flex-col h-full hover:border-white/10 transition-colors relative border border-white/5">

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="relative">
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full" />
            <div className="relative flex items-baseline gap-2">
              <span className="text-7xl font-extralight tracking-tighter text-white">
                {hours}:{minutes}
              </span>
              <div className="flex flex-col mb-2">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest leading-none mb-1">
                  {seconds}
                </span>
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">
                  {ampm}
                </span>
              </div>
            </div>
          </div>
          <div className="text-[11px] font-black text-white/10 uppercase tracking-[0.3em]">
            {time.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
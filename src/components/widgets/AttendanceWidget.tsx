"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Info, X } from "lucide-react";
import { useWidgetStore } from "@/store/useWidgetStore";
import { cn } from "@/lib/utils";

export default function AttendanceWidget({ id }: { id: string }) {
  const { removeWidget, updateWidget, activeWidgets } = useWidgetStore();
  const widget = activeWidgets.find(w => w.id === id);
  
  const [attended, setAttended] = useState(0);
  const [total, setTotal] = useState(0);
  const [target, setTarget] = useState(75);

  const percentage = total === 0 ? 0 : Math.round((attended / total) * 100);
  
  const calculateRequired = () => {
    if (total === 0 || percentage >= target) return 0;
    // (attended + x) / (total + x) = target/100
    // attended + x = (target/100) * (total + x)
    // attended + x = (target/100) * total + (target/100) * x
    // x - (target/100) * x = (target/100) * total - attended
    // x * (1 - target/100) = (target/100) * total - attended
    // x = ((target/100) * total - attended) / (1 - target/100)
    const req = Math.ceil(((target / 100) * total - attended) / (1 - target / 100));
    return req > 0 ? req : 0;
  };

  const calculateBunkable = () => {
    if (total === 0 || percentage <= target) return 0;
    // attended / (total + x) = target/100
    // attended = (target/100) * (total + x)
    // attended / (target/100) = total + x
    // x = attended / (target/100) - total
    const bunk = Math.floor(attended / (target / 100) - total);
    return bunk > 0 ? bunk : 0;
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
        updateWidget(id, { 
          x: (widget?.x || 0) + info.offset.x, 
          y: (widget?.y || 0) + info.offset.y 
        });
      }}
      initial={{ opacity: 0, scale: 0.9, x: widget?.x ?? 100, y: widget?.y ?? 450 }}
      animate={{ opacity: 1, scale: 1, x: widget?.x, y: widget?.y }}
      className="absolute group w-[320px] cursor-grab active:cursor-grabbing z-50"
    >
      <div className="glass-panel rounded-[2rem] p-6 border border-white/5 bg-black/40 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
        {/* Close Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); removeWidget(id); }}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:border-red-500 z-50"
        >
          <X className="w-3.5 h-3.5 text-white" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <CalendarCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Attendance</h3>
            <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Eligibility Tracker</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Attended</label>
            <input 
              type="number"
              value={attended || ''}
              onChange={(e) => setAttended(parseInt(e.target.value) || 0)}
              className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-3 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/30 transition-colors"
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Total Classes</label>
            <input 
              type="number"
              value={total || ''}
              onChange={(e) => setTotal(parseInt(e.target.value) || 0)}
              className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-3 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/30 transition-colors"
              placeholder="0"
            />
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-center mb-6">
           <svg className="w-32 h-32 -rotate-90">
             <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
             <motion.circle 
               cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="8" 
               strokeDasharray="364.4"
               animate={{ strokeDashoffset: 364.4 - (364.4 * percentage) / 100 }}
               className={cn(
                 "transition-colors duration-1000",
                 percentage >= target ? "text-emerald-500" : "text-red-500"
               )}
             />
           </svg>
           <div className="absolute inset-0 flex flex-col items-center justify-center">
             <span className="text-3xl font-black text-white tabular-nums">{percentage}%</span>
             <span className="text-[8px] font-black uppercase text-white/20">Current</span>
           </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
            <span>Target: {target}%</span>
            <input 
              type="range" min="0" max="100" value={target} 
              onChange={(e) => setTarget(parseInt(e.target.value))}
              className="w-24 accent-emerald-500 h-1 rounded-full bg-white/10 appearance-none"
            />
          </div>
          
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            {percentage < target ? (
              <div className="flex items-center gap-3">
                <Info className="w-4 h-4 text-red-400" />
                <p className="text-[10px] font-medium text-white/60">
                  Attend <span className="text-red-400 font-bold">{calculateRequired()}</span> more classes to reach {target}%
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Info className="w-4 h-4 text-emerald-400" />
                <p className="text-[10px] font-medium text-white/60">
                  You can bunk <span className="text-emerald-400 font-bold">{calculateBunkable()}</span> more classes safely.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

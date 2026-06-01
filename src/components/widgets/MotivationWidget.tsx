"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useWidgetStore } from "@/store/useWidgetStore";
import { X, Flame } from "lucide-react";

export default function MotivationWidget({ id }: { id: string }) {
  const { updateWidget, activeWidgets, removeWidget } = useWidgetStore();
  const widget = activeWidgets.find(w => w.id === id);
  
  const [percentage, setPercentage] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`studyn-motivation-${id}`);
      return saved ? parseInt(saved, 10) : 65;
    }
    return 65;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(percentage.toString());

  useEffect(() => {
    localStorage.setItem(`studyn-motivation-${id}`, percentage.toString());
  }, [id, percentage]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(inputValue, 10);
    if (!isNaN(val) && val >= 0 && val <= 100) {
      setPercentage(val);
    }
    setIsEditing(false);
  };

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={{
        left: 0,
        right: typeof window !== "undefined" ? window.innerWidth - 220 : 0,
        top: 0,
        bottom: typeof window !== "undefined" ? window.innerHeight - 280 : 0,
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
      initial={{ x: widget?.x || 200, y: widget?.y || 200, opacity: 0 }}
      animate={{ x: widget?.x, y: widget?.y, opacity: 1 }}
      className="absolute cursor-grab select-none w-[220px] group"
    >
      {id && (
        <button 
          onClick={(e) => { e.stopPropagation(); removeWidget(id); }}
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-black/80 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:border-red-500 z-50 shadow-xl"
        >
          <X className="w-3.5 h-3.5 text-white" />
        </button>
      )}

      <div className="glass-panel p-6 rounded-[2rem] flex flex-col items-center bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group/card text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
        
        <div className="relative w-32 h-32 mb-4">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-white/5"
            />
            {/* Progress Circle */}
            <motion.circle
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              cx="64"
              cy="64"
              r={radius}
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>
          
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {isEditing ? (
              <form onSubmit={handleSave} className="flex flex-col items-center">
                <input
                  type="text"
                  autoFocus
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onBlur={handleSave}
                  className="w-12 bg-transparent text-center text-xl font-black text-white focus:outline-none"
                />
              </form>
            ) : (
              <>
                <span className="text-3xl font-black text-white">{percentage}%</span>
                <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold mt-1">Previous</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Wake Up Call</span>
        </div>
        
        <p className="text-xs font-medium text-white/80 leading-snug italic">
          &quot;Padle Barna firse itni hi rh jayegi&quot;
        </p>
      </div>
    </motion.div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, Timer, FileText, Activity, Trophy, Zap, Plus, X, Quote, GraduationCap, Gift, Dna, ListTodo, Bell, Flame, Image as ImageIcon } from "lucide-react";
import { useWidgetStore, WidgetType } from "@/store/useWidgetStore";
import { useState } from "react";

const WIDGET_TEMPLATES: { type: WidgetType, name: string, category: string, icon: React.ElementType }[] = [
  { type: 'clock', name: 'Digital Clock', category: 'Utilities', icon: Clock },
  { type: 'focus', name: 'Pomodoro', category: 'Focus', icon: Timer },
  { type: 'notes', name: 'Sticky Notes', category: 'Productivity', icon: FileText },
  { type: 'todo', name: 'To-Do List', category: 'Productivity', icon: ListTodo },
  { type: 'stopwatch', name: 'Stopwatch', category: 'Utilities', icon: Activity },
  { type: 'analytics', name: 'Analytics', category: 'Study', icon: Trophy },
  { type: 'ai', name: 'AI Thought', category: 'AI', icon: Zap },
  { type: 'quote', name: 'Daily Quote', category: 'Inspiration', icon: Quote },
  { type: 'cgpa', name: 'CGPA Tracker', category: 'Academic', icon: GraduationCap },
  { type: 'reminder', name: 'Up Next', category: 'Productivity', icon: Bell },
  { type: 'dailyspin', name: 'Daily Spin', category: 'Rewards', icon: Gift },
  { type: 'studydna', name: 'Study DNA', category: 'Focus', icon: Dna },
  { type: 'motivation', name: 'Motivation', category: 'Inspiration', icon: Flame },
  { type: 'image', name: 'Image', category: 'Customization', icon: ImageIcon },
];

export default function WidgetPicker() {
  const { isPickerOpen, setPickerOpen, addWidget } = useWidgetStore();
  const [search, setSearch] = useState("");

  const filtered = WIDGET_TEMPLATES.filter(w => 
    w.name.toLowerCase().includes(search.toLowerCase()) || 
    w.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isPickerOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPickerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ type: "spring", damping: 25, stiffness: 200, mass: 0.5 }}
            className="fixed inset-x-8 bottom-8 top-24 bg-zinc-900/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] z-[201] flex flex-col p-10 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Widget <span className="font-light">Store</span></h2>
                <p className="text-[11px] text-white/40 uppercase tracking-[0.2em] font-black mt-2">Personalize your workspace</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search widgets..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-colors placeholder:text-white/20 text-white"
                  />
                </div>
                <button 
                  onClick={() => setPickerOpen(false)}
                  className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 hover:scale-105 active:scale-95"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-4 gap-6">
                {filtered.map(widget => (
                  <motion.button 
                    key={widget.type}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      addWidget(widget.type);
                      setPickerOpen(false);
                    }}
                    className="group relative flex flex-col items-center justify-center p-8 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/20 rounded-[2rem] transition-all duration-300 text-center shadow-lg hover:shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 mb-4 group-hover:scale-110 transition-transform shadow-inner">
                      <widget.icon className="w-8 h-8 text-white/60 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-base font-bold text-white tracking-wide mb-1">{widget.name}</div>
                    <div className="text-[10px] text-white/30 font-black uppercase tracking-widest">{widget.category}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 flex justify-center">
               <div className="px-6 py-4 bg-white/[0.02] rounded-3xl border border-white/5 flex items-center gap-3">
                  <Activity className="w-5 h-5 text-white/30" />
                  <p className="text-xs text-white/40 leading-relaxed font-medium italic">
                    &quot;Your environment shapes your focus. Choose wisely.&quot;
                  </p>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

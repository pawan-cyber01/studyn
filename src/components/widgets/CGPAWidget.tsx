"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Plus, Trash2, X } from "lucide-react";
import { useWidgetStore } from "@/store/useWidgetStore";

interface Semester {
  id: string;
  gpa: number;
  credits: number;
}

export default function CGPAWidget({ id }: { id: string }) {
  const { removeWidget, updateWidget, activeWidgets } = useWidgetStore();
  const widget = activeWidgets.find(w => w.id === id);
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: '1', gpa: 0, credits: 0 }
  ]);

  const addSemester = () => {
    setSemesters([...semesters, { id: Math.random().toString(), gpa: 0, credits: 0 }]);
  };

  const updateSemester = (semId: string, updates: Partial<Semester>) => {
    setSemesters(semesters.map(s => s.id === semId ? { ...s, ...updates } : s));
  };

  const removeSemester = (semId: string) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter(s => s.id !== semId));
    }
  };

  const calculateCGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    semesters.forEach(s => {
      totalPoints += s.gpa * s.credits;
      totalCredits += s.credits;
    });
    return totalCredits === 0 ? "0.00" : (totalPoints / totalCredits).toFixed(2);
  };

  const cgpaValue = calculateCGPA();
  const percentage = (parseFloat(cgpaValue) / 10 * 100).toFixed(0); // Assuming 10 point scale

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
      initial={{ opacity: 0, scale: 0.9, x: widget?.x ?? 100, y: widget?.y ?? 100 }}
      animate={{ opacity: 1, scale: 1, x: widget?.x, y: widget?.y }}
      className="absolute group w-[340px] cursor-grab active:cursor-grabbing z-50"
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
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">CGPA Tracker</h3>
            <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Academic Progress</p>
          </div>
        </div>

        <div className="space-y-3 mb-6 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
          {semesters.map((sem) => (
            <div key={sem.id} className="flex gap-2 items-center">
              <div className="flex-1 grid grid-cols-2 gap-2 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-white/20 uppercase">GPA</label>
                  <input 
                    type="number" 
                    value={sem.gpa || ''} 
                    placeholder="0.0"
                    onChange={(e) => updateSemester(sem.id, { gpa: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-transparent text-xs font-bold focus:outline-none text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-white/20 uppercase">Credits</label>
                  <input 
                    type="number" 
                    value={sem.credits || ''} 
                    placeholder="0"
                    onChange={(e) => updateSemester(sem.id, { credits: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-transparent text-xs font-bold focus:outline-none text-white"
                  />
                </div>
              </div>
              <button 
                onClick={() => removeSemester(sem.id)}
                className="p-2 text-white/10 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          <button 
            onClick={addSemester}
            className="w-full py-3 border border-dashed border-white/10 rounded-xl text-[10px] font-black text-white/20 hover:text-white/40 hover:border-white/20 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-3 h-3" />
            Add Semester
          </button>
        </div>

        <div className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-center justify-between">
          <div>
             <span className="text-[10px] font-black text-indigo-400/60 uppercase tracking-widest">Cumulative GPA</span>
             <div className="text-3xl font-black text-white tabular-nums">{cgpaValue}</div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 flex items-center justify-center">
             <span className="text-[10px] font-bold text-indigo-400">{percentage}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

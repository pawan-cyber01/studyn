"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  TrendingDown, TrendingUp, X
} from "lucide-react";
import { useFocusStore } from "@/store/useFocusStore";
import { useWidgetStore } from "@/store/useWidgetStore";
import { cn } from "@/lib/utils";

export default function StudyDebtWidget({ id }: { id?: string }) {
  const { weeklyGoalHours, dailyHistory } = useFocusStore();
  const { removeWidget } = useWidgetStore();

  const stats = useMemo(() => {
    const weeklyGoalMins = weeklyGoalHours * 60;
    const dailyTargetMins = weeklyGoalMins / 7;
    const totalMinutes = dailyHistory.reduce((acc, curr) => acc + curr.minutes, 0);
    const dayOfWeek = new Date().getDay(); 
    const elapsedDays = dayOfWeek === 0 ? 7 : dayOfWeek; 
    const expectedMinutes = dailyTargetMins * elapsedDays;
    const debt = expectedMinutes - totalMinutes;
    return {
      status: debt <= 0 ? 'ahead' : 'behind',
      percent: Math.min(100, (totalMinutes / expectedMinutes) * 100) || 0
    };
  }, [weeklyGoalHours, dailyHistory]);

  return (
    <div className="w-full h-full p-6 flex flex-col items-center justify-center gap-4 relative group bg-white/[0.01]">
      {id && (
        <button 
          onClick={() => removeWidget(id)}
          className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/10 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="64" cy="64" r="58"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-white/5"
          />
          <motion.circle
            cx="64" cy="64" r="58"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeDasharray={364.4}
            initial={{ strokeDashoffset: 364.4 }}
            animate={{ strokeDashoffset: 364.4 - (364.4 * stats.percent) / 100 }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className={cn(
              "transition-colors duration-500",
              stats.status === 'ahead' ? "text-emerald-500" : "text-red-500"
            )}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-white">{Math.round(stats.percent)}%</span>
          <div className="flex items-center gap-1">
            {stats.status === 'ahead' ? <TrendingUp className="w-3 h-3 text-emerald-400" /> : <TrendingDown className="w-3 h-3 text-red-400" />}
            <span className="text-[8px] font-black uppercase tracking-widest text-white/20 italic">Focus</span>
          </div>
        </div>
      </div>
      
      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
         Study Goal
      </div>
    </div>
  );
}

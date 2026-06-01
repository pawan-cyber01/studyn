"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Sparkles, RefreshCcw, X, AlertCircle
} from "lucide-react";
import { useFocusStore } from "@/store/useFocusStore";
import { useWidgetStore } from "@/store/useWidgetStore";
import { useAI } from "@/lib/ai";
import { cn } from "@/lib/utils";

export default function CurrentDebtWidget({ id }: { id?: string }) {
  const { weeklyGoalHours, dailyHistory } = useFocusStore();
  const { removeWidget } = useWidgetStore();
  const { chat } = useAI();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const stats = useMemo(() => {
    const weeklyGoalMins = weeklyGoalHours * 60;
    const dailyTargetMins = weeklyGoalMins / 7;
    const totalMinutes = dailyHistory.reduce((acc, curr) => acc + curr.minutes, 0);
    const dayOfWeek = new Date().getDay(); 
    const elapsedDays = dayOfWeek === 0 ? 7 : dayOfWeek; 
    const expectedMinutes = dailyTargetMins * elapsedDays;
    const debt = expectedMinutes - totalMinutes;
    return {
      debt,
      debtHours: Math.max(0, Math.floor(debt / 60)),
      debtMins: Math.max(0, Math.round(debt % 60)),
      status: debt <= 0 ? 'ahead' : 'behind'
    };
  }, [weeklyGoalHours, dailyHistory]);

  const generateRecoveryPlan = async () => {
    setIsLoading(true);
    const prompt = `Analyze my study debt: ${stats.debtHours}h ${stats.debtMins}m. 3-step plan. 1 sentence motivation.`;
    try {
      const response = await chat(prompt);
      if (response) setAnalysis(response);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full p-6 flex flex-col items-center justify-center gap-4 relative group text-center bg-white/[0.01]">
      {id && (
        <button 
          onClick={() => removeWidget(id)}
          className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/10 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      <div className="space-y-1">
        <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
           <AlertCircle className="w-3 h-3" /> Status
        </div>
        <h3 className={cn(
          "text-3xl font-black italic tracking-tighter",
          stats.status === 'ahead' ? "text-emerald-400" : "text-white"
        )}>
          {stats.status === 'ahead' ? "CLEAN" : `${stats.debtHours}H ${stats.debtMins}M`}
        </h3>
        <p className="text-[9px] font-black uppercase tracking-widest text-white/40">
          {stats.status === 'ahead' ? "No Debt Detected" : "Study Debt Found"}
        </p>
      </div>

      <button
        onClick={generateRecoveryPlan}
        disabled={isLoading}
        className="w-full py-3 rounded-2xl bg-white text-black flex items-center justify-center gap-2 hover:scale-[0.98] active:scale-[0.95] transition-all disabled:opacity-50"
      >
        <Sparkles className="w-4 h-4" />
        <span className="text-[10px] font-black uppercase tracking-widest">
           {isLoading ? "Analyzing..." : "Recover"}
        </span>
      </button>

      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-10 bg-black/98 backdrop-blur-3xl p-6 flex flex-col text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">AI Strategy</span>
              <button onClick={() => setAnalysis(null)} className="p-1 hover:bg-white/10 rounded-lg">
                <RefreshCcw className="w-3.5 h-3.5 text-white/40" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto text-[10px] text-white/80 leading-relaxed space-y-3 font-medium">
              {analysis.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

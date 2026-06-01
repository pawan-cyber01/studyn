"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Dna, Sparkles, Brain, Clock, Zap, 
  TrendingUp, Activity, Moon, Sun, 
  RefreshCcw, ArrowRight, Lightbulb
} from "lucide-react";
import { useDNAStore } from "@/store/useDNAStore";
import { useAI } from "@/lib/ai";

export default function StudyDNAApp() {
  const { sessions, quizzes, insights, personalityTags, setInsights } = useDNAStore();
  const { chat } = useAI();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const stats = useMemo(() => {
    const totalFocus = sessions.filter(s => s.type === 'work').reduce((acc, curr) => acc + curr.duration, 0);
    const avgScore = quizzes.length > 0 ? quizzes.reduce((acc, curr) => acc + (curr.score / curr.total), 0) / quizzes.length * 100 : 0;
    
    // Find peak focus hour
    const hourCounts: Record<number, number> = {};
    sessions.forEach(s => {
      hourCounts[s.hourOfDay] = (hourCounts[s.hourOfDay] || 0) + 1;
    });
    const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    
    return {
      totalFocus,
      avgScore,
      peakHour: peakHour !== undefined ? parseInt(peakHour) : null,
      sessionCount: sessions.length,
      quizCount: quizzes.length
    };
  }, [sessions, quizzes]);

  const analyzeDNA = async () => {
    if (sessions.length < 2 && quizzes.length < 1) return;
    
    setIsAnalyzing(true);
    const prompt = `Analyze my Study DNA based on these logs:
    Sessions: ${JSON.stringify(sessions.slice(-20))}
    Quizzes: ${JSON.stringify(quizzes.slice(-10))}
    
    Tasks:
    1. Identify 3 personality tags (e.g., "Night Owl", "Visual Learner", "Sprint Master").
    2. Provide 3 specific, data-driven insights (e.g., "You focus 20% better with Rain ambience").
    3. Suggest one workspace optimization.
    
    Format JSON: { "tags": ["tag1", "tag2", "tag3"], "insights": ["insight1", "insight2", "insight3", "optimization"] }`;
    
    try {
      const response = await chat(prompt, "You are the Studyn DNA Engine. Analyze patterns and be concise/premium.");
      const data = JSON.parse(response);
      setInsights(data.insights, data.tags);
    } catch (err) {
      console.error("DNA Analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full bg-black flex flex-col overflow-hidden relative">
      {/* Helix Background Animation */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2)_0%,transparent_70%)]" />
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full"
         />
      </div>

      <div className="p-8 flex items-center justify-between border-b border-white/5 relative z-10 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <Dna className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter">STUDY DNA <span className="text-blue-500">ENGINE</span></h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 italic">AI Pattern Synthesis v4.0</p>
          </div>
        </div>
        <button 
          onClick={analyzeDNA}
          disabled={isAnalyzing || (sessions.length < 2 && quizzes.length < 1)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {isAnalyzing ? <RefreshCcw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          {isAnalyzing ? "Synthesizing..." : "Recalibrate DNA"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-12 pb-24 relative z-10">
        {/* DNA Personality Tags */}
        <div className="flex flex-wrap gap-3">
          {personalityTags.length > 0 ? personalityTags.map((tag, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 flex items-center gap-2"
            >
              <Activity className="w-3 h-3 text-blue-400" />
              {tag}
            </motion.div>
          )) : (
            <div className="text-[10px] font-black uppercase tracking-widest text-white/10 italic">Awaiting pattern detection...</div>
          )}
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Visual Stats */}
          <div className="col-span-8 space-y-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 relative group hover:bg-white/[0.04] transition-all">
                <Clock className="w-5 h-5 text-blue-400 mb-4" />
                <div className="text-2xl font-black text-white italic">{Math.round(stats.totalFocus / 60)}h</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Total Focus</div>
              </div>
              <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 relative group hover:bg-white/[0.04] transition-all">
                <Brain className="w-5 h-5 text-emerald-400 mb-4" />
                <div className="text-2xl font-black text-white italic">{Math.round(stats.avgScore)}%</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Quiz Accuracy</div>
              </div>
              <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 relative group hover:bg-white/[0.04] transition-all">
                {stats.peakHour !== null ? (
                   stats.peakHour >= 18 || stats.peakHour <= 4 ? <Moon className="w-5 h-5 text-purple-400 mb-4" /> : <Sun className="w-5 h-5 text-yellow-400 mb-4" />
                ) : <Activity className="w-5 h-5 text-white/20 mb-4" />}
                <div className="text-2xl font-black text-white italic">
                  {stats.peakHour !== null ? `${stats.peakHour}:00` : "--:--"}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Peak Activity</div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-3">
                <TrendingUp className="w-4 h-4" /> Cognitive Insights
              </h3>
              <div className="space-y-3">
                {insights.map((insight, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 flex items-start gap-4 group hover:border-white/20 transition-all"
                  >
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 mt-1">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-white/80 leading-relaxed font-medium">{insight}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Dynamic Recommendations */}
          <div className="col-span-4 space-y-8">
            <div className="p-8 rounded-[2.5rem] bg-blue-500/10 border border-blue-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                <Zap className="w-20 h-20 text-white" />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-4">Smart Recommendation</h4>
              <p className="text-lg font-black text-white tracking-tight leading-snug italic mb-6">
                {stats.peakHour && stats.peakHour > 18 
                  ? "Schedule your hardest math problems for after 9PM tonight."
                  : "Start a focus sprint now while your cognitive load is low."}
              </p>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                Apply Optimization <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Learning Tendencies</h4>
               <div className="space-y-3">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                    <span>Deep Focus</span>
                    <span>High</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                    />
                 </div>
                 
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40 mt-4">
                    <span>Consistency</span>
                    <span>Stable</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "60%" }}
                      className="h-full bg-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.5)]" 
                    />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Placeholder if empty */}
      {sessions.length < 2 && (
        <div className="absolute inset-0 top-[100px] bg-black/60 backdrop-blur-sm z-20 flex items-center justify-center p-12 text-center">
           <div className="max-w-xs space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto animate-pulse">
                <Dna className="w-8 h-8 text-white/20" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Synthesizing History</h3>
                <p className="text-xs text-white/40 leading-relaxed font-medium">We need at least 2 study sessions to begin mapping your learning DNA.</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

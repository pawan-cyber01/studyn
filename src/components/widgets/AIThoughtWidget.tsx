"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, RefreshCw, X, Send } from "lucide-react";
import { useAI, AIMessage } from "@/lib/ai";
import { useWidgetStore } from "@/store/useWidgetStore";
import { useFocusStore } from "@/store/useFocusStore";
import { cn } from "@/lib/utils";

export default function AIThoughtWidget({ id }: { id: string }) {
  const { removeWidget, updateWidget, activeWidgets } = useWidgetStore();
  const widget = activeWidgets.find(w => w.id === id);
  const { chat } = useAI();
  const { totalFocusTime, sessionsCompleted, isActive } = useFocusStore();
  const [thought, setThought] = useState("Analyzing cognitive patterns...");
  const [isGenerating, setIsGenerating] = useState(false);
  const [question, setQuestion] = useState("");

  const generateThought = useCallback(async (userQuestion?: string) => {
    setIsGenerating(true);
    try {
      const messages: AIMessage[] = [
        { 
          role: 'system', 
          content: `You are a high-performance study analyst and mentor. 
          The user has studied for ${Math.floor(totalFocusTime / 60)} minutes and completed ${sessionsCompleted} sessions today. 
          Current status: ${isActive ? 'Focused' : 'Idle'}.
          If there is a user question, answer it concisely (max 30 words) with a focus on productivity.
          If no question, provide a brief (max 12 words) futuristic observation about performance.` 
        }
      ];
      
      if (userQuestion) {
        messages.push({ role: 'user', content: userQuestion });
      }

      const response = await chat(messages);
      setThought(response.replace(/"/g, ''));
      if (userQuestion) setQuestion("");
    } catch (error) {
      console.error("AI generation failed:", error);
      setThought("Neural efficiency optimal. Maintain current focus density.");
    } finally {
      setIsGenerating(false);
    }
  }, [chat, totalFocusTime, sessionsCompleted, isActive]);

  useEffect(() => {
    const timer = setTimeout(() => {
      generateThought();
    }, 0);
    const interval = setInterval(() => {
      if (!question) generateThought();
    }, 300000); 
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [generateThought, question]);

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      generateThought(question);
    }
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
      initial={{ opacity: 0, scale: 0.9, x: widget?.x ?? 400, y: widget?.y ?? 100 }}
      animate={{ opacity: 1, scale: 1, x: widget?.x, y: widget?.y }}
      className="absolute group w-[320px] cursor-grab active:cursor-grabbing z-50"
    >
      <div className="glass-panel rounded-[2rem] p-6 bg-black/60 backdrop-blur-[80px] border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); removeWidget(id); }}
          className="absolute top-4 right-4 w-6 h-6 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:border-red-500 z-50"
        >
          <X className="w-3 h-3 text-white" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Cognitive Analysis</h3>
          </div>
        </div>

        <div className="min-h-[100px] flex flex-col justify-center relative bg-white/[0.02] rounded-2xl p-4 border border-white/5 mb-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={thought}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs font-medium text-white/90 leading-relaxed italic"
            >
              &quot;{thought}&quot;
            </motion.p>
          </AnimatePresence>
          
          {isGenerating && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl"
            >
              <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
            </motion.div>
          )}
        </div>

        {/* Ask AI Box */}
        <form onSubmit={handleAsk} className="relative group/input mb-4">
          <input 
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-[11px] text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all"
          />
          <button 
            type="submit"
            disabled={!question.trim() || isGenerating}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-purple-500/20 rounded-lg transition-all disabled:opacity-0"
          >
            <Send className="w-3.5 h-3.5 text-purple-400" />
          </button>
        </form>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-purple-400/50" />
            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Live Engine Feed</span>
          </div>
          <button 
            onClick={() => generateThought()}
            disabled={isGenerating}
            className="p-1.5 hover:bg-white/5 rounded-lg transition-colors group/btn"
          >
            <RefreshCw className={cn("w-3 h-3 text-white/20 group-hover/btn:text-white/60 transition-colors", isGenerating && "animate-spin")} />
          </button>
        </div>

        {/* Decorative ambient light */}
        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-purple-500/10 blur-[40px] rounded-full pointer-events-none" />
      </div>
    </motion.div>
  );
}


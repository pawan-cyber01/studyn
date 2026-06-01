"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useAI, AIMessage } from "@/lib/ai";
import { useWidgetStore } from "@/store/useWidgetStore";
import { cn } from "@/lib/utils";

const STATIC_QUOTES = [
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Study while others are sleeping; work while others are loafing; prepare while others are playing; and dream while others are competing.", author: "William Arthur Ward" },
  { text: "Your talent determines what you can do. Your motivation determines how much you are willing to do.", author: "Lou Holtz" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" }
];

export default function QuoteWidget({ id }: { id?: string }) {
  const [quote, setQuote] = useState(STATIC_QUOTES[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { chat } = useAI();
  const { updateWidget, activeWidgets } = useWidgetStore();
  const widget = activeWidgets.find(w => w.id === id);

  const fetchAIQuote = async () => {
    setIsRefreshing(true);
    try {
      const messages: AIMessage[] = [
        { role: 'system', content: 'Generate a short, powerful, and minimalist study-motivating quote for a student OS. Return ONLY the quote and author in JSON format: { "text": "...", "author": "..." }. Keep it professional and calming.' }
      ];
      const response = await chat(messages);
      const data = JSON.parse(response);
      if (data.text && data.author) {
        setQuote(data);
      }
    } catch (error) {
      console.error("Failed to fetch AI quote:", error);
      setQuote(STATIC_QUOTES[Math.floor(Math.random() * STATIC_QUOTES.length)]);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Rotation logic
  }, []);

  return (
    <motion.div 
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={{
        left: 0,
        right: typeof window !== "undefined" ? window.innerWidth - 500 : 0,
        top: 0,
        bottom: typeof window !== "undefined" ? window.innerHeight - 300 : 0,
      }}
      onDragEnd={(_, info) => {
        if (id) {
          updateWidget(id, { 
            x: (widget?.x || 0) + info.offset.x, 
            y: (widget?.y || 0) + info.offset.y 
          });
        }
      }}
      whileDrag={{ scale: 1.02, cursor: "grabbing" }}
      initial={{ opacity: 0, y: widget?.y || 300, x: widget?.x || 100 }}
      animate={{ x: widget?.x, y: widget?.y, opacity: 1 }}
      className="absolute group w-full max-w-lg cursor-grab select-none"
    >
      <div className="quote-box glass-panel backdrop-blur-[60px] border border-white/5 hover:border-white/10 transition-colors relative group">
        <AnimatePresence mode="wait">
          <motion.div
            key={quote.text}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4"
          >
            <p className="text-2xl font-light leading-relaxed text-white/90 italic">
              {quote.text}
            </p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                — {quote.author}
              </span>
              
              <button 
                onClick={fetchAIQuote}
                disabled={isRefreshing}
                className={cn(
                  "p-2 rounded-full hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100",
                  isRefreshing && "animate-spin opacity-100"
                )}
              >
                <RefreshCw className="w-3 h-3 text-white/40" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/5 rounded-tl-2xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/5 rounded-br-2xl" />
      </div>
    </motion.div>
  );
}

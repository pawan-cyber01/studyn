"use client";

import { useState, useEffect } from "react";
import { Pin, Sparkles, CheckCircle2, X } from "lucide-react";
import { motion } from "framer-motion";
import { useWidgetStore } from "@/store/useWidgetStore";
import { cn } from "@/lib/utils";

interface NoteWidgetProps {
  id: string;
  initialContent?: string;
}

export default function StickyNoteWidget({ id, initialContent = "" }: NoteWidgetProps) {
  const { updateWidget, activeWidgets, removeWidget } = useWidgetStore();
  const widget = activeWidgets.find(w => w.id === id);
  const [content, setContent] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(`studyn-note-${id}`) || initialContent;
    }
    return initialContent;
  });
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    localStorage.setItem(`studyn-note-${id}`, content);
  }, [id, content]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={{
        left: 20,
        right: typeof window !== "undefined" ? window.innerWidth - 320 : 0,
        top: 20,
        bottom: typeof window !== "undefined" ? window.innerHeight - 450 : 0,
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
      initial={{ x: widget?.x || 400, y: widget?.y || 100, opacity: 0 }}
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

      <div className="glass-panel rounded-[2.5rem] p-6 shadow-2xl bg-white/[0.01] backdrop-blur-[40px] flex flex-col h-full hover:border-white/10 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
              <Sparkles className="w-4 h-4 text-white/20" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Thought</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsPinned(!isPinned)}
              className={cn("p-2 rounded-lg transition-colors", isPinned ? "text-white/80 bg-white/10" : "text-white/10 hover:text-white/30")}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a note..."
          className="flex-1 w-full bg-transparent text-sm leading-relaxed focus:outline-none resize-none placeholder:text-white/5 font-light min-h-[200px]"
        />

        <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-4">
          <div className="flex gap-2">
             <div className="w-3 h-3 rounded-full bg-white/20" />
             <div className="w-3 h-3 rounded-full bg-white/10" />
             <div className="w-3 h-3 rounded-full bg-white/5" />
          </div>
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/10">
            <CheckCircle2 className="w-3 h-3" />
            Sync
          </div>
        </div>
      </div>
    </motion.div>
  );
}

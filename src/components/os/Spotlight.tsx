"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, Bot, FileText, Timer, Calendar, Trophy, Sparkles } from "lucide-react";
import { useOSStore } from "@/store/useOSStore";

const COMMANDS = [
  { id: 'ai', title: 'Open AI Assistant', icon: Bot, shortcut: 'A' },
  { id: 'notes', title: 'Create New Note', icon: FileText, shortcut: 'N' },
  { id: 'focus', title: 'Start Focus Timer', icon: Timer, shortcut: 'F' },
  { id: 'calendar', title: 'Check Calendar', icon: Calendar, shortcut: 'C' },
  { id: 'quiz', title: 'Join Quiz Arena', icon: Trophy, shortcut: 'Q' },
];

export default function Spotlight() {
  const { isSpotlightOpen, setSpotlightOpen, openWindow } = useOSStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSpotlightOpen(!isSpotlightOpen);
      }
      if (e.key === "Escape") {
        setSpotlightOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSpotlightOpen, setSpotlightOpen]);

  const filteredCommands = COMMANDS.filter(cmd => 
    cmd.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCommand = (cmd: typeof COMMANDS[0]) => {
    openWindow(cmd.id, cmd.title.replace('Open ', ''), cmd.id);
    setSpotlightOpen(false);
    setSearch("");
  };

  return (
    <AnimatePresence>
      {isSpotlightOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSpotlightOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-[600px] glass-dark window-shadow rounded-2xl overflow-hidden"
          >
            <div className="flex items-center px-4 py-4 border-b border-white/10">
              <Search className="w-5 h-5 text-white/40 mr-3" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search apps, tasks, or ask AI..."
                className="flex-1 bg-transparent border-none outline-none text-white text-lg font-light placeholder:text-white/20"
              />
              <div className="flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded-md">
                <Command className="w-3 h-3 text-white/40" />
                <span className="text-[10px] text-white/40">K</span>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2">
              {search.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-2 text-[11px] font-semibold text-white/30 uppercase tracking-wider">
                    AI Insights
                  </div>
                  <button
                    onClick={() => {
                      openWindow('ai', 'AI Assistant', 'ai');
                      setSpotlightOpen(false);
                      setSearch("");
                    }}
                    className="w-full flex items-center justify-between px-3 py-4 rounded-xl bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-all group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                        <Bot className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-white/90">Ask Studyn AI</p>
                         <p className="text-[10px] text-white/40 italic truncate max-w-[400px]">&quot;{search}&quot;</p>
                      </div>
                    </div>
                    <Sparkles className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              )}

              {filteredCommands.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-[11px] font-semibold text-white/30 uppercase tracking-wider">
                    Applications
                  </div>
                  {filteredCommands.map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={() => handleCommand(cmd)}
                      className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/10 transition-colors group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/20 transition-colors">
                          <cmd.icon className="w-4 h-4 text-white/80" />
                        </div>
                        <span className="text-sm text-white/80">{cmd.title}</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                          {cmd.shortcut}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-white/20 text-sm">
                  No results found for &quot;{search}&quot;
                </div>
              )}
            </div>

            <div className="px-4 py-2 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[10px] text-white/30">
              <div className="flex gap-4">
                <span><span className="text-white/50">↑↓</span> to navigate</span>
                <span><span className="text-white/50">↵</span> to open</span>
              </div>
              <div>Studyn Spotlight</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

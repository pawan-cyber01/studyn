"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Globe, Sparkles, FileText, Music, Settings,
  ShoppingBag, Users, Trophy, Calculator, Keyboard,
  MonitorPlay, Calendar, Bot, Zap, X, Dna, Gift
} from "lucide-react";
import { useState } from "react";
import { useOSStore } from "@/store/useOSStore";
import { cn } from "@/lib/utils";

const ALL_APPS = [
  { id: 'browser', title: 'Browser', icon: Globe, color: 'bg-blue-500' },
  { id: 'ai', title: 'AI Assistant', icon: Sparkles, color: 'bg-purple-500' },
  { id: 'notes', title: 'Notes', icon: FileText, color: 'bg-amber-500' },
  { id: 'music', title: 'Music', icon: Music, color: 'bg-emerald-500' },
  { id: 'settings', title: 'Settings', icon: Settings, color: 'bg-zinc-500' },
  { id: 'marketplace', title: 'Marketplace', icon: ShoppingBag, color: 'bg-rose-500' },
  { id: 'social', title: 'Social', icon: Users, color: 'bg-sky-500' },
  { id: 'leaderboard', title: 'Leaderboard', icon: Trophy, color: 'bg-yellow-500' },
  { id: 'math', title: 'Math Combat', icon: Calculator, color: 'bg-orange-500' },
  { id: 'typing', title: 'Typing Sprint', icon: Keyboard, color: 'bg-indigo-500' },
  { id: 'youtube', title: 'YouTube', icon: MonitorPlay, color: 'bg-red-500' },
  { id: 'calendar', title: 'Calendar', icon: Calendar, color: 'bg-teal-500' },
  { id: 'agent', title: 'Agent Hub', icon: Bot, color: 'bg-blue-600' },
  { id: 'quiz', title: 'Quiz Arena', icon: Zap, color: 'bg-violet-600' },
  { id: 'studydna', title: 'Study DNA', icon: Dna, color: 'bg-blue-700' },
  { id: 'dailyspin', title: 'Daily Spin', icon: Gift, color: 'bg-emerald-600' },
  { id: 'resume', title: 'Resume Builder', icon: FileText, color: 'bg-emerald-600' },
  { id: 'ide', title: 'IDE', icon: Keyboard, color: 'bg-indigo-600' },
];

export default function Launchpad() {
  const { isLaunchpadOpen, setLaunchpad, openWindow } = useOSStore();
  const [search, setSearch] = useState("");

  const filteredApps = ALL_APPS.filter(app =>
    app.title.toLowerCase().includes(search.toLowerCase())
  );

  if (!isLaunchpadOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ type: "spring", damping: 25, stiffness: 200, mass: 0.5 }}
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-10xl flex flex-col items-center p-12 overflow-y-auto no-scrollbar"
      >
        {/* Backdrop click to close */}
        <div className="absolute inset-0 z-0" onClick={() => setLaunchpad(false)} />

        {/* Search Bar */}
        <div className="absolute left-113 top-14 -translate-y-1/2">
          <Search className="w-5 h-5 text-white/40" />
        </div>
        <div className="absolute top-10 relative z-10 w-full max-w-xl mb-16">
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Apps..."
            className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] pl-16 pr-8 py-5 text-xl font-light text-white focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all placeholder:text-white/20 placeholder:text-center"
          />
          <button
            onClick={() => setLaunchpad(false)}
            className="absolute -right-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5 text-white/40" />
          </button>
        </div>

        {/* App Grid */}
        <div className="absolute top-25 relative z-10 w-full max-w-6xl grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-12">
          {filteredApps.map((app, i) => (
            <motion.button
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => {
                openWindow(app.id, app.title, app.id);
                setLaunchpad(false);
              }}
              className="group flex flex-col items-center gap-4 transition-all hover:scale-110 active:scale-95"
            >
              <div className={cn(
                "w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]",
                app.color,
                "relative overflow-hidden"
              )}>
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                <app.icon className="w-10 h-10 text-white" />
              </div>
              <span className="text-xs font-bold tracking-wide text-white/80 group-hover:text-white transition-colors">{app.title}</span>
            </motion.button>
          ))}
        </div>

        {filteredApps.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-white/20 gap-4">
            <Search className="w-16 h-16 opacity-10" />
            <p className="text-xl font-light tracking-widest uppercase">No Apps Found</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

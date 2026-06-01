"use client";

import React from "react";
import { useOSStore, WindowInstance } from "@/store/useOSStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Maximize2, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import SettingsApp from "../apps/SettingsApp";
import AIAssistant from "../apps/AIAssistant";
import NotesApp from "../apps/NotesApp";
import QuizArena from "../apps/QuizArena";
import MarketplaceApp from "../apps/MarketplaceApp";
import SocialFeed from "../apps/SocialFeed";
import AgentHub from "../apps/AgentHub";
import MusicApp from "../apps/MusicApp";
import YouTubeApp from "../apps/YouTubeApp";
import CalendarApp from "../apps/CalendarApp";
import LeaderboardApp from "../apps/LeaderboardApp";
import BrowserApp from "../apps/BrowserApp";
import TypingGame from "../apps/TypingGame";
import MessengerApp from "../apps/MessengerApp";
import MathGame from "../apps/MathGame";
import FocusApp from "../apps/FocusApp";
import DashboardApp from "../apps/DashboardApp";
import DailySpinApp from "../apps/DailySpinApp";
import StudyDNAApp from "../apps/StudyDNAApp";
import ResumeBuilderApp from "../apps/ResumeBuilderApp";
import IDEApp from "../apps/IDEApp";

const APP_COMPONENTS: Record<string, React.ComponentType<{ window: WindowInstance }>> = {
  settings: SettingsApp,
  ai: AIAssistant,
  notes: NotesApp,
  quiz: QuizArena,
  marketplace: MarketplaceApp, 
  social: SocialFeed,
  agent: AgentHub,
  music: MusicApp,
  youtube: YouTubeApp,
  calendar: CalendarApp,
  leaderboard: LeaderboardApp,
  browser: BrowserApp,
  typing: TypingGame,
  messenger: MessengerApp,
  math: MathGame,
  focus: FocusApp,
  dashboard: DashboardApp,
  dailyspin: DailySpinApp,
  studydna: StudyDNAApp,
  resume: ResumeBuilderApp,
  ide: IDEApp,
};

function OSWindow({ window }: { window: WindowInstance }) {
  const { closeWindow, focusWindow, minimizeWindow, toggleMaximize, toggleAlwaysOnTop, updateWindowPos } = useOSStore();

  if (window.isMinimized) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 200, originY: 1 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        originY: 0.5,
        zIndex: window.zIndex,
        width: window.isMaximized ? "100vw" : window.width,
        height: window.isMaximized ? "100vh" : window.height,
        top: window.isMaximized ? 0 : window.y,
        left: window.isMaximized ? 0 : window.x,
      }}
      exit={{ opacity: 0, scale: 0.7, y: 200, originY: 1, filter: "blur(10px)" }}
      transition={{ 
        type: "spring", 
        stiffness: 350, 
        damping: 35,
        mass: 1,
        opacity: { duration: 0.2 }
      }}
      drag={!window.isMaximized}
      dragMomentum={false}
      dragConstraints={typeof globalThis.window !== "undefined" ? { 
        left: 20, 
        right: globalThis.window.innerWidth - (window.width as number || 800) - 20, 
        top: 20, 
        bottom: globalThis.window.innerHeight - (window.height as number || 600) - 100 
      } : { left: 0, right: 1200, top: 0, bottom: 800 }}
      onDragStart={() => focusWindow(window.id)}
      onDragEnd={(_, info) => {
        if (!window.isMaximized) {
          updateWindowPos(window.id, window.x + info.offset.x, window.y + info.offset.y);
        }
      }}
      className={cn(
        "absolute overflow-hidden bg-black window-shadow rounded-2xl flex flex-col transition-shadow duration-300 pointer-events-auto",
        window.isMaximized ? "rounded-none" : "border border-white/10 ring-1 ring-white/5 shadow-2xl"
      )}
      onClick={() => focusWindow(window.id)}
    >
      {/* Title Bar */}
      <div 
        className="h-11 flex items-center justify-between px-4 bg-white/[0.03] border-b border-white/[0.05] cursor-default select-none backdrop-blur-md"
        onDoubleClick={() => toggleMaximize(window.id)}
      >
        <div className="flex items-center gap-2.5">
          {/* Window Controls */}
          <div className="flex gap-1.5 group/controls">
            <button 
              onClick={(e) => { e.stopPropagation(); closeWindow(window.id); }}
              className="w-6 h-6 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all hover:bg-red-500 hover:border-red-500 group"
            >
              <X className="w-3 h-3 text-white/20 group-hover:text-white transition-colors" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); minimizeWindow(window.id); }}
              className="w-6 h-6 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all hover:bg-white/10 group"
            >
              <Minus className="w-3 h-3 text-white/20 group-hover:text-white transition-colors" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); toggleMaximize(window.id); }}
              className="w-6 h-6 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all hover:bg-white/10 group"
            >
              <Maximize2 className="w-3 h-3 text-white/20 group-hover:text-white transition-colors" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); toggleAlwaysOnTop(window.id); }}
              className={cn(
                "w-6 h-6 rounded-lg flex items-center justify-center transition-all border",
                window.isAlwaysOnTop ? "bg-indigo-600 border-indigo-500" : "bg-white/[0.03] border-white/5 hover:bg-white/10"
              )}
            >
              <Pin className={cn("w-3 h-3", window.isAlwaysOnTop ? "text-white" : "text-white/20")} />
            </button>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <span className="text-[12px] font-medium text-white/40 tracking-tight uppercase">
              {window.title}
            </span>
          </div>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-auto bg-black">
        {APP_COMPONENTS[window.component] ? (
          <div className="h-full">
            {React.createElement(APP_COMPONENTS[window.component], { window })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white/20 space-y-6 p-12">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
              <div className="relative w-20 h-20 rounded-[2rem] bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-2xl">
                 <span className="text-3xl animate-pulse">⚡</span>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-light tracking-wide text-white/80 mb-2">{window.title}</h2>
              <p className="text-sm font-medium text-white/30 uppercase tracking-widest">Studyn Application Framework</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function WindowManager() {
  const { windows } = useOSStore();

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="relative w-full h-full pointer-events-none">
        <AnimatePresence mode="popLayout">
          {windows.map((window) => (
            <OSWindow key={window.id} window={window} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Settings, FileText, Globe, LayoutGrid, Sparkles, Mic,
  Timer, Home
} from "lucide-react";
import { useOSStore } from "@/store/useOSStore";
import { useVoiceStore } from "@/store/useVoiceStore";
import { useFocusStore } from "@/store/useFocusStore";
import { useRef } from "react";
import { MotionValue } from "framer-motion";
import AudioVisualizer from "./AudioVisualizer";
import { cn } from "@/lib/utils";

const DOCK_APPS = [
  { id: 'dashboard', icon: Home, label: 'Dashboard', color: 'bg-zinc-800' },
  { id: 'ai', icon: Sparkles, label: 'AI Assistant', color: 'bg-zinc-600' },
  { id: 'notes', icon: FileText, label: 'Notes', color: 'bg-zinc-800' },
  { id: 'settings', icon: Settings, label: 'Settings', color: 'bg-zinc-500' },
];

function DockItem({ app, mouseX }: { app: typeof DOCK_APPS[0], mouseX: MotionValue<number> }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { openWindow, windows, focusWindow, minimizeWindow } = useOSStore();
  const w = windows.find(w => w.component === app.id);
  const isOpen = !!w;
  const isMinimized = w?.isMinimized;

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [44, 72, 44]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <div className="relative flex flex-col items-center gap-1 group/app">
      <motion.button
        ref={ref}
        style={{ width }}
        onClick={() => {
          if (isOpen) {
            if (isMinimized) {
              focusWindow(w!.id);
            } else {
              minimizeWindow(w!.id);
            }
          } else {
            openWindow(app.id, app.label, app.id);
          }
        }}
        className={cn(
          "aspect-square rounded-[14px] flex items-center justify-center transition-colors relative overflow-hidden",
          "shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/50"
        )}
      >
        {/* App icon background */}
        <div className={cn("absolute inset-0", app.color)} />
        {/* Gloss overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/10 pointer-events-none" />
        <app.icon className="w-5 h-5 text-white relative z-10 drop-shadow-sm" />
      </motion.button>

      {/* App Name Tooltip */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-white/80 opacity-0 group-hover/app:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-xl group-hover/app:-translate-y-1">
        {app.label}
      </div>

      {/* Active indicator dot */}
      {isOpen && (
        <motion.div
          layoutId={`dot-${app.id}`}
          className="w-1 h-1 rounded-full bg-white/60"
        />
      )}
      {!isOpen && <div className="w-1 h-1" />}
    </div>
  );
}

export default function Dock() {
  const { setLaunchpad, isLaunchpadOpen } = useOSStore();
  const { setListening } = useVoiceStore();
  const { isActive, timeLeft, sessionType } = useFocusStore();
  const mouseX = useMotionValue(Infinity);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[400] flex flex-col items-center gap-2">
      {/* Focus Timer Pill (floats above dock when active) */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          className="flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold shadow-xl"
        >
          <div className={cn(
            "w-2 h-2 rounded-full animate-pulse",
            sessionType === 'work' ? 'bg-red-400' : 'bg-green-400'
          )} />
          <span className="text-white tabular-nums">{formatTime(timeLeft)}</span>
          <span className="text-white/30">{sessionType === 'work' ? 'Focus' : 'Break'}</span>
        </motion.div>
      )}

      {/* Main Dock */}
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end gap-1.5 px-4 py-3 bg-black/50 backdrop-blur-[60px] border border-white/[0.08] rounded-[2.2rem] shadow-2xl shadow-black/60 relative"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        }}
      >
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-[2.2rem] bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

        {/* Audio Visualizer */}
        <div className="flex items-center px-2 mr-1 self-center border-r border-white/[0.06] h-8">
          <AudioVisualizer />
        </div>

        {/* Launchpad Trigger */}
        <div className="relative flex flex-col items-center gap-1 group/launchpad">
          <motion.button
            onClick={() => setLaunchpad(!isLaunchpadOpen)}
            whileHover={{ scale: 1.15, y: -8 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-11 h-11 rounded-[14px] flex items-center justify-center shadow-lg overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/[0.03]" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none" />
            <LayoutGrid className="w-5 h-5 text-white/80 relative z-10" />
          </motion.button>
          
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-white/80 opacity-0 group-hover/launchpad:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-xl group-hover/launchpad:-translate-y-1">
            Launchpad
          </div>
          <div className="w-1 h-1" />
        </div>

        <div className="w-px h-8 bg-white/[0.06] mx-1 self-center" />

        {/* App Icons */}
        {DOCK_APPS.map((app) => (
          <DockItem key={app.id} app={app} mouseX={mouseX} />
        ))}

        {/* Separator */}
        <div className="w-px h-8 bg-white/[0.06] mx-1 self-center" />

        {/* Voice Trigger */}
        <div className="relative flex flex-col items-center gap-1 group/voice">
          <motion.button
            onClick={() => setListening(true)}
            whileHover={{ scale: 1.15, y: -8 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-11 h-11 rounded-[14px] flex items-center justify-center shadow-lg shadow-black/30 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-black/10 pointer-events-none" />
            <Mic className="w-5 h-5 text-black relative z-10" />
          </motion.button>
          
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-white/80 opacity-0 group-hover/voice:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-xl group-hover/voice:-translate-y-1">
            Voice AI
          </div>
          <div className="w-1 h-1" />
        </div>
      </motion.div>
    </div>
  );
}

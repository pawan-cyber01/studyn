"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useFocusStore, FocusGoal, AmbientSoundType } from "@/store/useFocusStore";
import { useGamificationStore } from "@/store/useGamificationStore";
import { 
  Play, Pause, RotateCcw, Zap, Target, Check
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function FocusApp() {
  const { 
    timeLeft, isActive, sessionType,
    autoStart, focusGoal,
    ambientSound, currentQuote,
    startTimer, pauseTimer, resetTimer, tick, setFocusGoal, setAmbientSound, toggleImmersive, setAutoStart
  } = useFocusStore();
  const { addXP } = useGamificationStore();

  // Timer tick
  useEffect(() => {
    if (!isActive) return;
    const id = setInterval(() => tick(), 1000);
    return () => clearInterval(id);
  }, [isActive, tick]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const totalTime = sessionType === 'work' ? 25 * 60 : sessionType === 'short' ? 5 * 60 : 15 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const handleStart = () => {
    startTimer();
    addXP(10); 
    toggleImmersive(true);
  };

  const focusGoals: { id: FocusGoal; label: string; sessions: number }[] = [
    { id: '1h', label: '1 Hour', sessions: 2 },
    { id: '2h', label: '2 Hours', sessions: 4 },
    { id: '4h', label: '4 Hours', sessions: 8 },
  ];

  const ambientOptions: { id: AmbientSoundType; label: string; icon: string }[] = [
    { id: 'rain', label: 'Rain', icon: '🌧️' },
    { id: 'cafe', label: 'Cafe', icon: '☕' },
    { id: 'thunder', label: 'Storm', icon: '⚡' },
    { id: 'keyboard', label: 'Typing', icon: '⌨️' },
    { id: 'lofi', label: 'Lo-Fi', icon: '🎵' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex h-full bg-black text-white overflow-hidden font-sans"
    >
      {/* LEFT PANEL */}
      <div className="w-80 border-r border-white/5 flex flex-col p-10 gap-10 bg-black">
        <section>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6">Focus Goal</div>
          <div className="grid grid-cols-1 gap-2.5">
            {focusGoals.map(goal => (
              <button
                key={goal.id}
                onClick={() => setFocusGoal(goal.id)}
                className={cn(
                  "group flex items-center justify-between px-6 py-5 rounded-[2rem] border transition-all text-left",
                  focusGoal === goal.id
                    ? "bg-white text-black border-white shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                    : "bg-white/[0.02] border-white/5 hover:border-white/10"
                )}
              >
                <div>
                  <div className="text-xs font-black uppercase tracking-tight">{goal.label}</div>
                  <div className={cn("text-[10px] font-bold mt-1", focusGoal === goal.id ? "text-black/50" : "text-white/20")}>
                    {goal.sessions} segments
                  </div>
                </div>
                <Target className={cn("w-4 h-4 transition-transform group-hover:scale-110", focusGoal === goal.id ? "text-black/40" : "text-white/10")} />
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6">Atmosphere</div>
          <div className="grid grid-cols-2 gap-2.5">
            {ambientOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => setAmbientSound(ambientSound === opt.id ? 'none' : opt.id)}
                className={cn(
                  "flex flex-col items-center gap-3 p-5 rounded-[1.5rem] border transition-all",
                  ambientSound === opt.id
                    ? "bg-white/10 border-white/20 text-white"
                    : "bg-white/[0.02] border-white/5 hover:bg-white/5 text-white/30"
                )}
              >
                <span className="text-2xl">{opt.icon}</span>
                <span className="text-[9px] font-black uppercase tracking-widest">{opt.label}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="mt-auto space-y-4">
           <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
              <div className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-3">Daily Insight</div>
              <p className="text-[12px] text-white/50 italic leading-relaxed font-light">
                &quot;{currentQuote}&quot;
              </p>
           </div>
           <button 
             onClick={() => toggleImmersive(true)}
             className="w-full py-5 bg-white text-black border border-white/10 rounded-[2rem] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] font-black text-[11px] uppercase tracking-[0.2em]"
           >
              <Zap className="w-4 h-4 fill-current" />
              Enter Immersive Mode
           </button>
        </div>
      </div>

      {/* MAIN TIMER AREA */}
      <div className="flex-1 flex flex-col items-center justify-center gap-16 relative bg-[#050505]">
        {/* Session label */}
        <div className="flex items-center gap-4">
           <div className="w-12 h-px bg-white/5" />
           <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
             {sessionType === 'work' ? 'Deep Focus' : 'Recovery Phase'}
           </div>
           <div className="w-12 h-px bg-white/5" />
        </div>

        {/* Ring Timer */}
        <div className="relative">
          <svg width="340" height="340" className="-rotate-90">
            <circle cx="170" cy="170" r="150" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
            <motion.circle
              cx="170" cy="170" r="150"
              fill="none"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 150}
              animate={{ strokeDashoffset: (2 * Math.PI * 150) * (1 - (progress / 100)) }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              key={timeLeft}
              className="text-8xl font-extralight tracking-tighter tabular-nums text-white"
            >
              {formatTime(timeLeft)}
            </motion.div>
            <div className="text-[11px] text-white/20 font-black uppercase tracking-[0.4em] mt-4 flex items-center gap-2">
              <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isActive ? "bg-emerald-500" : "bg-white/20")} />
              {isActive ? 'in progress' : 'paused'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-10">
          <button
            onClick={resetTimer}
            className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 text-white/20 hover:text-white/60"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <motion.button
            onClick={isActive ? pauseTimer : handleStart}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all",
              sessionType === 'work' ? "bg-white text-black" : "bg-emerald-500 text-white"
            )}
          >
            {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1.5" />}
          </motion.button>

          <button
            onClick={() => setAutoStart(!autoStart)}
            className={cn(
              "w-14 h-14 rounded-full border flex items-center justify-center transition-all active:scale-95",
              autoStart ? "bg-white/10 border-white/20 text-white" : "bg-white/[0.03] border-white/5 text-white/20"
            )}
          >
            <Check className={cn("w-5 h-5", autoStart ? "text-white" : "text-white/10")} />
          </button>
        </div>

        {/* Task list section */}
        <div className="w-full max-w-sm px-8 pt-8 border-t border-white/5">
           <FocusTasks />
        </div>
      </div>
    </motion.div>
  );
}

function FocusTasks() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Focus on deep work", done: false },
    { id: 2, text: "Eliminate distractions", done: false },
  ]);
  const [newTask, setNewTask] = useState("");

  const add = () => {
    if (!newTask.trim()) return;
    setTasks(t => [...t, { id: Date.now(), text: newTask, done: false }]);
    setNewTask("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Session Tasks</span>
         <span className="text-[10px] font-bold text-white/40">{tasks.filter(t => t.done).length}/{tasks.length}</span>
      </div>
      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
        {tasks.map(task => (
          <button
            key={task.id}
            onClick={() => setTasks(t => t.map(i => i.id === task.id ? { ...i, done: !i.done } : i))}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all text-left group"
          >
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
              task.done ? "bg-white border-white" : "border-white/10 group-hover:border-white/30"
            )}>
              {task.done && <Check className="w-3 h-3 text-black" />}
            </div>
            <span className={cn("text-xs font-medium", task.done ? "line-through text-white/20" : "text-white/70")}>{task.text}</span>
          </button>
        ))}
      </div>
      <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/5 rounded-2xl">
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="What are you focusing on?"
          className="flex-1 bg-transparent px-4 py-3 text-xs text-white placeholder:text-white/10 focus:outline-none transition-all"
        />
        <button
          onClick={add}
          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/80 transition-all text-lg flex items-center justify-center"
        >+</button>
      </div>
    </div>
  );
}

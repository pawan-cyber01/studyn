"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, Zap, Target, 
  Code, Quote, Crown, Flame, ArrowRight
} from "lucide-react";
import { useGamificationStore } from "@/store/useGamificationStore";
import { useLeaderboardStore, LeaderboardEntry } from "@/store/useLeaderboardStore";
import { useUserStore } from "@/store/useUserStore";
import { cn } from "@/lib/utils";

const QUOTES = [
  "The only way to do great work is to love what you do.",
  "Stay hungry, stay foolish.",
  "Your time is limited, don't waste it living someone else's life.",
  "Focus creates mastery. Small progress is still progress.",
  "Deep work is the ability to focus without distraction.",
  "Simplicity is the soul of efficiency.",
  "Consistency beats intensity every single time.",
  "Don't stop until you are proud."
];

const CODE_SNIPPETS = [
  "export default function App() { return <div>Studyn OS</div>; }",
  "const [data, setData] = useState(null); useEffect(() => { fetchData(); }, []);",
  "def calculate_wpm(chars, seconds): return (chars / 5) / (seconds / 60)",
  "for (let i = 0; i < items.length; i++) { console.log(items[i]); }",
  "interface User { id: string; name: string; age: number; }",
  "async function getData() { const res = await fetch(url); return res.json(); }",
  "const theme = useMemo(() => ({ primary: '#000', secondary: '#fff' }), []);",
  "git commit -m 'feat: add premium typing game' && git push origin main"
];

const KEYS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"]
];

export default function TypingGame() {
  const [mode, setMode] = useState<'quote' | 'code'>('quote');
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const addXP = useGamificationStore(state => state.addXP);
  const addEntry = useLeaderboardStore(state => state.addEntry);
  const entries = useLeaderboardStore(state => state.entries);
  const profile = useUserStore(state => state.profile);

  const typingLeaderboard = useMemo(() => {
    return entries
      .filter((e: LeaderboardEntry) => e.type === 'typing')
      .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score)
      .slice(0, 5);
  }, [entries]);

  const startNewGame = useCallback((newMode?: 'quote' | 'code') => {
    const activeMode = newMode || mode;
    const source = activeMode === 'quote' ? QUOTES : CODE_SNIPPETS;
    const randomText = source[Math.floor(Math.random() * source.length)];
    
    setText(randomText);
    setInput("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setMistakes(0);
    setCombo(0);
    setMaxCombo(0);
    setIsFinished(false);
    setTimeLeft(30);
    setIsActive(false);
    setLastKeyPressed(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [mode]);

  useEffect(() => {
    const source = mode === 'quote' ? QUOTES : CODE_SNIPPETS;
    setText(source[Math.floor(Math.random() * source.length)]);
  }, [mode]);

  const finishGame = useCallback(() => {
    if (isFinished) return;
    setIsFinished(true);
    setIsActive(false);
    
    const timeElapsed = (Date.now() - (startTime || Date.now())) / 60000;
    const finalWpm = Math.round((input.length / 5) / (timeElapsed || 0.01));
    setWpm(finalWpm);

    if (finalWpm > 0) {
      addXP(finalWpm * 2 + maxCombo);
      addEntry({
        userId: profile.studynId || 'anonymous',
        userName: profile.name,
        userPfp: profile.pfp,
        score: finalWpm,
        type: 'typing',
        timestamp: Date.now()
      });
    }
  }, [startTime, input.length, addXP, maxCombo, addEntry, profile, isFinished]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0 && !isFinished) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      finishGame();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isFinished, finishGame]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;

    const value = e.target.value;
    const lastChar = value[value.length - 1];
    setLastKeyPressed(lastChar?.toLowerCase() || null);

    if (!isActive) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    if (value.length < input.length) {
      setInput(value);
      setCombo(0);
      return;
    }

    const isCorrect = value[value.length - 1] === text[value.length - 1];
    
    if (isCorrect) {
      setCombo(prev => {
        const next = prev + 1;
        if (next > maxCombo) setMaxCombo(next);
        return next;
      });
    } else {
      setMistakes(prev => prev + 1);
      setCombo(0);
    }
    
    setInput(value);
    
    const timeElapsed = (Date.now() - (startTime || Date.now())) / 60000;
    const currentWpm = Math.round((value.length / 5) / (timeElapsed || 0.01));
    setWpm(currentWpm);

    const currentAccuracy = Math.round(((value.length - mistakes) / value.length) * 100);
    setAccuracy(isNaN(currentAccuracy) ? 100 : currentAccuracy);

    if (value.length === text.length) {
      finishGame();
    }
  };

  const progress = text.length > 0 ? (input.length / text.length) * 100 : 0;

  return (
    <div className="flex h-full bg-[#050505] overflow-hidden select-none">
      <div className="w-80 border-r border-white/5 p-8 flex flex-col gap-8 bg-black/40">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Crown className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Hall of Fame</h3>
          </div>
          <div className="space-y-3">
            {typingLeaderboard.map((entry: LeaderboardEntry, i: number) => (
              <div key={entry.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] font-bold text-white/20 w-4">{i + 1}</span>
                <img src={entry.userPfp} alt={entry.userName} className="w-8 h-8 rounded-lg bg-white/5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{entry.userName}</p>
                  <p className="text-[10px] text-white/20 uppercase font-black">{entry.score} WPM</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto space-y-4">
          <div className="p-5 rounded-3xl bg-blue-500/5 border border-blue-500/10">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400/60 mb-2">Personal Best</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">84</span>
              <span className="text-xs font-bold text-white/20 uppercase">WPM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-12 relative">
        <div className="flex items-center justify-between mb-16">
          <div className="flex gap-2">
            <button 
              onClick={() => { setMode('quote'); startNewGame('quote'); }}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                mode === 'quote' ? "bg-white text-black shadow-lg shadow-white/10" : "bg-white/5 text-white/40 hover:bg-white/10"
              )}
            >
              <Quote className="w-4 h-4" /> Quotes
            </button>
            <button 
              onClick={() => { setMode('code'); startNewGame('code'); }}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                mode === 'code' ? "bg-white text-black shadow-lg shadow-white/10" : "bg-white/5 text-white/40 hover:bg-white/10"
              )}
            >
              <Code className="w-4 h-4" /> Coding
            </button>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">WPM</span>
              <span className="text-2xl font-black text-white">{wpm}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Accuracy</span>
              <span className="text-2xl font-black text-white">{accuracy}%</span>
            </div>
            <div className="h-10 w-px bg-white/10 mx-2" />
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Timer</span>
              <span className={cn("text-2xl font-black tabular-nums", timeLeft < 10 ? "text-red-500 animate-pulse" : "text-white")}>
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full relative">
          <AnimatePresence>
            {combo > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.5, y: -20 }}
                className="absolute top-[-40px] flex flex-col items-center"
              >
                <div className="flex items-center gap-2">
                  <Flame className={cn("w-6 h-6", combo > 20 ? "text-orange-500" : "text-blue-400")} />
                  <span className="text-4xl font-black text-white italic tracking-tighter">{combo}x</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Combo Streak</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative w-full">
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-12">
              <motion.div 
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              />
            </div>

            <div className="relative text-3xl font-medium tracking-tight leading-relaxed font-mono p-4">
              <div className="text-white/10 whitespace-pre-wrap">{text}</div>
              <div className="absolute top-4 left-4 w-full whitespace-pre-wrap">
                {text.split('').map((char, i) => {
                  let color = "text-transparent";
                  let decoration = "";
                  if (i < input.length) {
                    const isCorrect = input[i] === char;
                    color = isCorrect ? "text-white" : "text-red-500";
                    decoration = isCorrect ? "" : "bg-red-500/20 rounded-md";
                  }
                  return (
                    <span key={i} className={cn(color, decoration, i === input.length && "border-b-2 border-blue-500 animate-pulse")}>
                      {char}
                    </span>
                  );
                })}
              </div>
            </div>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInput}
              className="opacity-0 absolute inset-0 cursor-default"
              autoFocus
            />
          </div>

          <div className="mt-20 flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
            {KEYS.map((row, i) => (
              <div key={i} className="flex gap-1.5">
                {row.map(key => (
                  <motion.div
                    key={key}
                    animate={{ 
                      scale: lastKeyPressed === key ? 0.95 : 1,
                      backgroundColor: lastKeyPressed === key ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
                      borderColor: lastKeyPressed === key ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)"
                    }}
                    className="w-10 h-10 rounded-xl border flex items-center justify-center text-[10px] font-black uppercase text-white/40"
                  >
                    {key}
                  </motion.div>
                ))}
              </div>
            ))}
            <div className="w-64 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center mt-2">
               <div className={cn("w-32 h-1 rounded-full transition-colors", lastKeyPressed === " " ? "bg-white/40" : "bg-white/10")} />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isFinished && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl rounded-3xl"
            >
              <div className="text-center space-y-12 max-w-2xl w-full p-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 rounded-[2.5rem] bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto shadow-2xl"
                >
                  <Trophy className="w-12 h-12 text-yellow-500" />
                </motion.div>
                
                <div className="space-y-4">
                  <h2 className="text-5xl font-black text-white tracking-tighter italic">LEGENDARY!</h2>
                  <p className="text-xs font-black uppercase tracking-[0.4em] text-white/20">Sprint Performance Analysis</p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 flex flex-col items-center group hover:bg-white/10 transition-colors">
                    <Zap className="w-5 h-5 text-yellow-400 mb-4" />
                    <span className="text-3xl font-black text-white">{wpm}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-2">WPM</span>
                  </div>
                  <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 flex flex-col items-center group hover:bg-white/10 transition-colors">
                    <Target className="w-5 h-5 text-green-400 mb-4" />
                    <span className="text-3xl font-black text-white">{accuracy}%</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-2">Accuracy</span>
                  </div>
                  <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 flex flex-col items-center group hover:bg-white/10 transition-colors">
                    <Flame className="w-5 h-5 text-orange-500 mb-4" />
                    <span className="text-3xl font-black text-white">{maxCombo}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-2">Max Combo</span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-6 pt-8">
                  <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-white/40">
                    <span>+{wpm * 2} XP Gained</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    <span>Level Up Imminent</span>
                  </div>
                  <button 
                    onClick={() => startNewGame()}
                    className="group relative px-12 py-5 bg-white rounded-full overflow-hidden active:scale-95 transition-transform"
                  >
                    <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                    <span className="relative text-black text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                      Start New Sprint <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      </div>
    </div>
  );
}

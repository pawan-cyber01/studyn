"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, RotateCcw, Brain } from "lucide-react";
import { useGamificationStore } from "@/store/useGamificationStore";
import { cn } from "@/lib/utils";

export default function MathGame() {
  const [problem, setProblem] = useState(() => {
    const n1 = Math.floor(Math.random() * 50) + 1;
    const n2 = Math.floor(Math.random() * 50) + 1;
    return { q: `${n1} + ${n2}`, a: n1 + n2 };
  });
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFinished, setIsFinished] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const { addXP } = useGamificationStore();

  const generateProblem = useCallback(() => {
    const operators = ['+', '-', '*'];
    const op = operators[Math.floor(Math.random() * 3)];
    let n1, n2, ans;

    if (op === '+') {
      n1 = Math.floor(Math.random() * 50) + 1;
      n2 = Math.floor(Math.random() * 50) + 1;
      ans = n1 + n2;
    } else if (op === '-') {
      n1 = Math.floor(Math.random() * 50) + 10;
      n2 = Math.floor(Math.random() * n1);
      ans = n1 - n2;
    } else {
      n1 = Math.floor(Math.random() * 12) + 1;
      n2 = Math.floor(Math.random() * 12) + 1;
      ans = n1 * n2;
    }

    setProblem({ q: `${n1} ${op} ${n2}`, a: ans });
    setUserInput("");
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setCombo(0);
    setTimeLeft(30);
    setIsFinished(false);
    setIsActive(false);
    generateProblem();
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [generateProblem]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0 && !isFinished) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      Promise.resolve().then(() => {
        setIsFinished(true);
        setIsActive(false);
        addXP(score * 5);
      });
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isFinished, score, addXP]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    if (!isActive) setIsActive(true);

    const val = e.target.value;
    setUserInput(val);

    if (parseInt(val) === problem.a) {
      setFeedback('correct');
      setScore(s => s + 10 * (Math.floor(combo / 5) + 1));
      setCombo(c => c + 1);
      setTimeout(() => {
        setFeedback(null);
        generateProblem();
      }, 200);
    } else if (val.length >= problem.a.toString().length && parseInt(val) !== problem.a) {
      // Don't penalize too much, just reset combo if they hit enter or reach length
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-md p-8 overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Math <span className="text-white/40 font-light">Combat</span></h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Speed Arithmetic</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Time Left</span>
            <span className={cn("text-2xl font-black tabular-nums", timeLeft < 10 ? "text-red-500 animate-pulse" : "text-white")}>
              {timeLeft}s
            </span>
          </div>
          <button 
            onClick={startGame}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Game Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        <div className="relative w-full p-16 rounded-[4rem] bg-white/[0.02] border border-white/5 shadow-2xl flex flex-col items-center">
          
          <div className="flex gap-12 mb-16">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Score</span>
              <span className="text-4xl font-black text-white">{score}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Combo</span>
              <span className="text-4xl font-black text-indigo-400">x{combo}</span>
            </div>
          </div>

          <motion.div 
            key={problem.q}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl font-black text-white tracking-tighter mb-12"
          >
            {problem.q}
          </motion.div>

          <div className="relative w-64">
            <input
              ref={inputRef}
              type="number"
              value={userInput}
              onChange={handleInput}
              className={cn(
                "w-full bg-white/5 border-2 border-white/10 rounded-3xl py-6 px-4 text-4xl font-black text-center text-white focus:outline-none transition-all",
                feedback === 'correct' ? "border-green-500 bg-green-500/10" : "focus:border-white/20"
              )}
              placeholder="?"
              autoFocus
            />
          </div>

          {!isActive && !isFinished && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-[4rem] z-10">
              <p className="text-xl font-bold text-white tracking-widest uppercase animate-bounce">Type to start</p>
            </div>
          )}

          <AnimatePresence>
            {isFinished && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl rounded-[4rem] z-20 p-12 text-center"
              >
                <div className="w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center mb-8">
                  <Brain className="w-12 h-12 text-indigo-500" />
                </div>
                <h3 className="text-5xl font-black text-white mb-2">Mental Giant!</h3>
                <p className="text-white/40 mb-12 uppercase tracking-widest font-black">You earned {score * 5} XP</p>
                
                <div className="grid grid-cols-2 gap-6 w-full max-w-sm mb-12">
                   <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5">
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Final Score</div>
                      <div className="text-3xl font-black text-white">{score}</div>
                   </div>
                   <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5">
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Max Combo</div>
                      <div className="text-3xl font-black text-white">{combo}</div>
                   </div>
                </div>

                <button 
                  onClick={startGame}
                  className="px-16 py-5 rounded-full bg-white text-black text-xs font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl shadow-white/10"
                >
                  Restart Battle
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

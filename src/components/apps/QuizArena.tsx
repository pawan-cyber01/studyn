"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Trophy, Zap, Users, Brain, Timer, ChevronRight } from "lucide-react";
import { useGamificationStore } from "@/store/useGamificationStore";
import { useDNAStore } from "@/store/useDNAStore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type GameState = "idle" | "matchmaking" | "playing" | "results";

export default function QuizArena() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(15);
  const { addXP, addCoins } = useGamificationStore();

  const subjects = [
    { id: "ai", title: "AI & Machine Learning", icon: Brain, questions: 12 },
    { id: "cs", title: "Computer Science", icon: Zap, questions: 15 },
    { id: "math", title: "Advanced Mathematics", icon: Trophy, questions: 10 },
  ];

  const questions = useMemo(() => [
    {
      q: "What does 'GPT' stand for in Generative AI?",
      options: ["General Purpose Text", "Generative Pre-trained Transformer", "Global Processing Tool", "Grid Pattern Technology"],
      correct: 1
    },
    {
      q: "Which algorithm is commonly used for pathfinding in games?",
      options: ["QuickSort", "Dijkstra's", "A*", "MergeSort"],
      correct: 2
    },
    {
      q: "What is the primary goal of Reinforcement Learning?",
      options: ["Maximize Reward", "Minimize Loss", "Label Data", "Cluster Objects"],
      correct: 0
    }
  ], []);

  const handleAnswer = useCallback((index: number) => {
    if (index !== -1 && index === questions[questionIndex].correct) {
      setScore(s => s + 100);
    }

    if (questionIndex < questions.length - 1) {
      setQuestionIndex(i => i + 1);
      setTimer(15);
    } else {
      setGameState("results");
      addXP(250);
      addCoins(50);
      useDNAStore.getState().logQuiz({
        subject: "General",
        score: score,
        total: questions.length * 100,
        timestamp: new Date().toISOString()
      });
    }
  }, [questionIndex, score, questions, addXP, addCoins]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === "playing" && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && gameState === "playing") {
      // Use a small timeout to avoid cascading render
      const timeout = setTimeout(() => handleAnswer(-1), 10);
      return () => clearTimeout(timeout);
    }
    return () => clearInterval(interval);
  }, [gameState, timer, handleAnswer]);

  const startMatchmaking = () => {
    setGameState("matchmaking");
    setTimeout(() => {
      setGameState("playing");
      setTimer(15);
    }, 2000);
  };

  return (
    <div className="h-full bg-white/[0.01] flex flex-col items-center justify-center p-8 text-white">
      {gameState === "idle" && (
        <div className="w-full max-w-2xl space-y-8 text-center">
          <div className="space-y-4">
             <div className="w-20 h-20 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Trophy className="w-10 h-10 text-white/40" />
             </div>
             <h2 className="text-3xl font-light tracking-tight">Multiplayer <span className="font-bold">Arena</span></h2>
             <p className="text-sm text-white/30 max-w-sm mx-auto">Battle other students in real-time and climb the global ranks.</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {subjects.map(subject => (
              <button 
                key={subject.id}
                onClick={startMatchmaking}
                className="group flex items-center justify-between p-6 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-[2rem] transition-all duration-500"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                    <subject.icon className="w-6 h-6 text-white/40" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold tracking-tight">{subject.title}</div>
                    <div className="text-[10px] text-white/20 font-black uppercase tracking-widest">{subject.questions} Questions</div>
                  </div>
                </div>
                <div className="w-12 aspect-5-3 btn-premium opacity-50 group-hover:opacity-100">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === "matchmaking" && (
        <div className="flex flex-col items-center gap-12 py-12">
           <div className="relative">
              <div className="w-32 h-32 rounded-full border-2 border-white/5 border-t-white/40 animate-spin" />
              <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white/20" />
           </div>
           <div className="text-center space-y-2">
              <div className="text-xl font-bold">Finding Opponent...</div>
              <div className="text-xs text-white/20 uppercase tracking-[0.2em] font-black">Connecting to global arena</div>
           </div>
        </div>
      )}

      {gameState === "playing" && (
        <div className="w-full max-w-3xl space-y-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs font-black">
                  {questionIndex + 1}/{questions.length}
               </div>
               <div className="text-sm font-bold text-white/40">Level 05 Battle</div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 px-6 py-2 rounded-full border border-white/5">
               <Timer className="w-4 h-4 text-white/40" />
               <span className="text-sm font-black tabular-nums">{timer}s</span>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-light leading-relaxed text-center">
              {questions[questionIndex].q}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {questions[questionIndex].options.map((opt: string, i: number) => (
                <button 
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className="aspect-5-3 btn-premium text-sm normal-case font-medium p-8"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: `${(timer / 15) * 100}%` }}
              className="h-full bg-white/20" 
            />
          </div>
        </div>
      )}

      {gameState === "results" && (
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center mb-4 relative">
             <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full" />
             <Trophy className="w-12 h-12 text-white/60 relative" />
          </div>
          <div className="space-y-2">
            <div className="text-sm text-white/20 uppercase tracking-[0.3em] font-black">Match Complete</div>
            <h2 className="text-4xl font-light">Victory <span className="font-bold">Attained</span></h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
             <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5">
                <div className="text-[10px] text-white/20 uppercase font-black mb-1">XP Earned</div>
                <div className="text-2xl font-bold text-white/80">+250</div>
             </div>
             <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5">
                <div className="text-[10px] text-white/20 uppercase font-black mb-1">Coins</div>
                <div className="text-2xl font-bold text-white/80">+50</div>
             </div>
          </div>

          <button 
            onClick={() => {
              setGameState("idle");
              setQuestionIndex(0);
              setScore(0);
            }}
            className="mt-8 w-64 aspect-5-3 btn-premium"
          >
            Return to Hub
          </button>
        </div>
      )}
    </div>
  );
}

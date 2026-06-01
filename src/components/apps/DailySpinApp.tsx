"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Coins, Heart, Trophy, Sparkles, 
  RotateCcw, Gift, Star, ArrowRight
} from "lucide-react";
import { useGamificationStore } from "@/store/useGamificationStore";
import { cn } from "@/lib/utils";

const REWARDS = [
  { id: 1, type: 'xp', value: 100, label: '100 XP', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 2, type: 'coins', value: 50, label: '50 Coins', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { id: 3, type: 'heart', value: 1, label: '1 Heart', color: 'text-red-400', bg: 'bg-red-500/10' },
  { id: 4, type: 'xp', value: 250, label: '250 XP', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 5, type: 'coins', value: 100, label: '100 Coins', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { id: 6, type: 'xp', value: 500, label: '500 XP', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 7, type: 'heart', value: 3, label: '3 Hearts', color: 'text-red-400', bg: 'bg-red-500/10' },
  { id: 8, type: 'xp', value: 1000, label: '1K XP MEGA', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
];

const PARTICLE_CONFIGS = [
  { x: '10%', y: '20%', scale: 1.2, duration: 1.2 },
  { x: '80%', y: '15%', scale: 0.8, duration: 1.5 },
  { x: '45%', y: '70%', scale: 1.5, duration: 1.1 },
  { x: '90%', y: '60%', scale: 1.1, duration: 1.8 },
  { x: '20%', y: '85%', scale: 0.9, duration: 1.4 },
  { x: '50%', y: '40%', scale: 1.3, duration: 1.6 },
  { x: '30%', y: '10%', scale: 0.7, duration: 1.3 },
  { x: '70%', y: '90%', scale: 1.4, duration: 1.7 },
  { x: '15%', y: '50%', scale: 1.0, duration: 1.2 },
  { x: '85%', y: '30%', scale: 1.2, duration: 1.5 },
];

export default function DailySpinApp() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reward, setReward] = useState<typeof REWARDS[0] | null>(null);
  const { lastSpinDate, recordSpin, addXP, addCoins, restoreHearts } = useGamificationStore();
  
  const canSpin = lastSpinDate !== new Date().toDateString();
  const wheelRef = useRef<HTMLDivElement>(null);

  const spin = () => {
    if (!canSpin || isSpinning) return;

    setIsSpinning(true);
    setReward(null);

    const segmentSize = 360 / REWARDS.length;
    const randomSegment = Math.floor(Math.random() * REWARDS.length);
    const extraRotation = 360 * 5 + (360 - randomSegment * segmentSize);
    const newRotation = rotation + extraRotation;

    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const selectedReward = REWARDS[randomSegment];
      setReward(selectedReward);
      
      if (selectedReward.type === 'xp') addXP(selectedReward.value);
      if (selectedReward.type === 'coins') addCoins(selectedReward.value);
      if (selectedReward.type === 'heart') restoreHearts(selectedReward.value);
      
      recordSpin();
    }, 4000);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-12 bg-black overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="z-10 text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter italic">DAILY REWARD</h2>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-white/20">Spin the wheel of focus</p>
        </motion.div>
      </div>

      <div className="relative w-[400px] h-[400px] z-10">
        <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-50">
          <div className="w-8 h-10 bg-white rounded-b-full shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center justify-center">
             <div className="w-2 h-4 bg-black/20 rounded-full" />
          </div>
        </div>

        <motion.div
          ref={wheelRef}
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.15, 0, 0.15, 1] }}
          className="w-full h-full rounded-full border-[12px] border-white/5 relative overflow-hidden bg-[#050505] shadow-[0_0_100px_rgba(0,0,0,1)]"
        >
          {REWARDS.map((r, i) => (
            <div
              key={r.id}
              className="absolute top-0 left-1/2 w-1/2 h-full origin-left"
              style={{ transform: `rotate(${i * (360 / REWARDS.length)}deg)` }}
            >
              <div 
                className={cn(
                  "h-full w-full border-l border-white/5 flex items-center justify-center pr-12",
                  i % 2 === 0 ? "bg-white/[0.01]" : "bg-transparent"
                )}
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
              >
                <div className="rotate-90 flex flex-col items-center gap-2">
                  {r.type === 'xp' && <Zap className={cn("w-5 h-5", r.color)} />}
                  {r.type === 'coins' && <Coins className={cn("w-5 h-5", r.color)} />}
                  {r.type === 'heart' && <Heart className={cn("w-5 h-5", r.color)} />}
                  <span className={cn("text-[8px] font-black uppercase tracking-widest", r.color)}>{r.label}</span>
                </div>
              </div>
            </div>
          ))}
          
          <div className="absolute inset-0 m-auto w-20 h-20 bg-black border-4 border-white/10 rounded-full z-20 flex items-center justify-center shadow-inner">
             <Star className="w-6 h-6 text-white/20 animate-pulse" />
          </div>
        </motion.div>

        <div className="absolute inset-[-40px] border-[40px] border-transparent rounded-full opacity-20 pointer-events-none"
             style={{ backgroundImage: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)', maskImage: 'radial-gradient(circle, transparent 65%, black 66%)' }} 
        />
      </div>

      <div className="mt-16 z-10 flex flex-col items-center gap-6">
        <button
          onClick={spin}
          disabled={!canSpin || isSpinning}
          className={cn(
            "group relative px-16 py-6 rounded-full overflow-hidden transition-all duration-500",
            canSpin && !isSpinning 
              ? "bg-white text-black hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]" 
              : "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
          )}
        >
          {canSpin && !isSpinning && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
          <span className="relative flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em]">
            {isSpinning ? "Spinning..." : canSpin ? "LUCKY SPIN" : "TOMORROW"}
            {!isSpinning && canSpin && <RotateCcw className="w-4 h-4" />}
          </span>
        </button>

        {!canSpin && (
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
             <Trophy className="w-3 h-3" /> Next spin in 24 hours
          </div>
        )}
      </div>

      <AnimatePresence>
        {reward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-3xl"
          >
            <motion.div
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center space-y-8 p-12"
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-60px] opacity-20"
                >
                  <Sparkles className="w-full h-full text-white" />
                </motion.div>
                <div className={cn("w-32 h-32 rounded-[3rem] flex items-center justify-center mx-auto border-2 shadow-2xl relative z-10", reward.bg, reward.color.replace('text', 'border'))}>
                   {reward.type === 'xp' && <Zap className="w-16 h-16" />}
                   {reward.type === 'coins' && <Coins className="w-16 h-16" />}
                   {reward.type === 'heart' && <Heart className="w-16 h-16" />}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-5xl font-black text-white tracking-tighter italic">CONGRATS!</h3>
                <p className="text-xs font-black uppercase tracking-[0.4em] text-white/40">You unlocked</p>
                <div className={cn("text-3xl font-black", reward.color)}>{reward.label}</div>
              </div>

              <button
                onClick={() => setReward(null)}
                className="px-12 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-2 mx-auto"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
            
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
               {PARTICLE_CONFIGS.map((p, i) => (
                 <motion.div
                   key={i}
                   initial={{ x: "50%", y: "50%", opacity: 1 }}
                   animate={{ 
                     x: p.x, 
                     y: p.y,
                     opacity: 0,
                     scale: p.scale
                   }}
                   transition={{ duration: p.duration, ease: "easeOut" }}
                   className={cn("absolute w-1 h-1 rounded-full", reward.color.replace('text', 'bg'))}
                 />
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

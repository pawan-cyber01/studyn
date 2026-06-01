"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Zap, Shield, Coins, Gift, Trophy, X } from "lucide-react";
import { useGamificationStore } from "@/store/useGamificationStore";
import { cn } from "@/lib/utils";

const REWARDS = [
  { id: 1, label: '500 XP', icon: Star, color: 'text-yellow-400', value: 500, type: 'xp' },
  { id: 2, label: 'Double XP', icon: Zap, color: 'text-cyan-400', value: 2, type: 'multiplier' },
  { id: 3, label: 'Streak Prot', icon: Shield, color: 'text-emerald-400', value: 1, type: 'protection' },
  { id: 4, label: '100 Coins', icon: Coins, color: 'text-amber-400', value: 100, type: 'coins' },
  { id: 5, label: 'Premium Theme', icon: Gift, color: 'text-purple-400', value: 1, type: 'theme' },
  { id: 6, label: 'Mystery Box', icon: Trophy, color: 'text-rose-400', value: 1, type: 'mystery' },
];

export default function DailySpinWheel({ onClose }: { onClose: () => void }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [reward, setReward] = useState<typeof REWARDS[0] | null>(null);
  const { addXP } = useGamificationStore();

  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setReward(null);
    
    const extraRounds = 5 + Math.floor(Math.random() * 5);
    const stopAt = Math.floor(Math.random() * REWARDS.length);
    const sectorAngle = 360 / REWARDS.length;
    const finalRotation = rotation + (extraRounds * 360) + (stopAt * sectorAngle);
    
    setRotation(finalRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      const wonReward = REWARDS[(REWARDS.length - (stopAt % REWARDS.length)) % REWARDS.length];
      setReward(wonReward);
      
      // Apply reward
      if (wonReward.type === 'xp') addXP(wonReward.value);
    }, 5000);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-2xl p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white/[0.03] border border-white/10 rounded-[3rem] p-12 shadow-2xl max-w-lg w-full flex flex-col items-center gap-8"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/10 text-white/40 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
           <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Daily Spin</h2>
           <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Fortune favors the consistent</p>
        </div>

        {/* The Wheel */}
        <div className="relative w-80 h-80">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-8 border-white/5 shadow-[0_0_50px_rgba(255,255,255,0.05)]" />
          
          {/* The Spinning Core */}
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 5, ease: [0.15, 0, 0.15, 1] }}
            className="w-full h-full rounded-full relative overflow-hidden border-2 border-white/10"
          >
            {REWARDS.map((r, i) => (
              <div
                key={r.id}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full origin-bottom"
                style={{ transform: `translateX(-50%) rotate(${i * (360 / REWARDS.length)}deg)` }}
              >
                <div className={cn(
                  "h-1/2 w-full flex flex-col items-center pt-8 border-r border-white/5",
                  i % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
                )}>
                  <r.icon className={cn("w-6 h-6 mb-2", r.color)} />
                  <span className="text-[8px] font-black uppercase text-white/40">{r.label}</span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Indicator Arrow */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center text-white drop-shadow-lg z-10">
             <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-white" />
          </div>

          {/* Center Hub */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center shadow-2xl z-20">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
             </div>
          </div>
        </div>

        <button 
          onClick={spin}
          disabled={isSpinning}
          className={cn(
            "group relative px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all",
            isSpinning 
              ? "bg-white/5 text-white/20 cursor-not-allowed" 
              : "bg-white text-black hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
          )}
        >
          {isSpinning ? 'Good Luck...' : 'Spin the wheel'}
        </button>

        <AnimatePresence>
          {reward && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-2"
            >
               <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Result</div>
               <div className="flex items-center justify-center gap-3">
                  <reward.icon className={cn("w-6 h-6", reward.color)} />
                  <span className="text-2xl font-black text-white">{reward.label}</span>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

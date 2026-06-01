import { useGamificationStore } from "@/store/useGamificationStore";
import { motion } from "framer-motion";
import { Trophy, Star, Flame, Heart, TrendingUp, X } from "lucide-react";
import { useWidgetStore } from "@/store/useWidgetStore";
import { cn } from "@/lib/utils";

export default function GamificationWidget({ id }: { id?: string }) {
  const { level, xp, coins, hearts, streak, achievements } = useGamificationStore();
  const { removeWidget, updateWidget, activeWidgets } = useWidgetStore();
  const widget = activeWidgets.find(w => w.id === id);
  const xpForNext = level * 1000;
  const progress = (xp / xpForNext) * 100;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={{
        left: 0,
        right: typeof window !== "undefined" ? window.innerWidth - 300 : 0,
        top: 0,
        bottom: typeof window !== "undefined" ? window.innerHeight - 500 : 0,
      }}
      onDragEnd={(_, info) => {
        if (id) {
          updateWidget(id, { 
            x: (widget?.x || 0) + info.offset.x, 
            y: (widget?.y || 0) + info.offset.y 
          });
        }
      }}
      whileDrag={{ scale: 1.05, cursor: "grabbing" }}
      initial={{ x: widget?.x || 100, y: widget?.y || 400, opacity: 0 }}
      animate={{ x: widget?.x, y: widget?.y, opacity: 1 }}
      className="absolute cursor-grab select-none w-[300px] group"
    >
      <div className="glass-panel rounded-[2.5rem] p-8 shadow-2xl bg-white/[0.01] backdrop-blur-[40px] flex flex-col h-full hover:border-white/10 transition-colors relative">
        {/* Close Button */}
        {id && (
          <button 
            onClick={(e) => { e.stopPropagation(); removeWidget(id); }}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 text-white/0 group-hover:text-white/20 transition-all z-10"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.02] rounded-[1.8rem] p-4 border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-3.5 h-3.5 text-white/30" />
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Streak</span>
              </div>
              <div className="text-2xl font-light">{streak} <span className="text-xs text-white/30 tracking-widest uppercase ml-1">Days</span></div>
            </div>
            <div className="bg-white/[0.02] rounded-[1.8rem] p-4 border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-3.5 h-3.5 text-white/30" />
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Lives</span>
              </div>
              <div className="flex gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={cn("w-2.5 h-2.5 rounded-full", i < hearts ? "bg-white/60" : "bg-white/5")} />
                ))}
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-end px-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/10 shadow-xl">
                  <Star className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-white">Level {level}</div>
                  <div className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-black">Pathfinder</div>
                </div>
              </div>
              <div className="text-[11px] font-black text-white/20 tracking-widest">
                {xp} <span className="text-[9px] mx-0.5">/</span> {xpForNext} <span className="text-[9px] ml-0.5">XP</span>
              </div>
            </div>
            <div className="h-2.5 w-full bg-white/[0.03] rounded-full overflow-hidden p-[1px] border border-white/[0.05]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-white/40 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
              />
            </div>
          </div>

          {/* Achievements Preview */}
          <div className="space-y-4 pt-2">
            <div className="text-[10px] font-black text-white/15 uppercase tracking-[0.2em] px-2 flex items-center justify-between">
              <span>Achievements</span>
              <Trophy className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-2.5">
              {achievements.slice(0, 2).map((ach) => (
                <div key={ach.id} className={cn(
                  "flex items-center gap-4 p-4 rounded-[1.5rem] border transition-all duration-500",
                  ach.unlockedAt ? "bg-white/[0.04] border-white/10" : "bg-white/[0.01] border-white/5 opacity-30 grayscale"
                )}>
                  <span className="text-xl">{ach.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-bold tracking-tight text-white">{ach.title}</div>
                    <div className="text-[10px] text-white/20 truncate font-medium">{ach.description}</div>
                  </div>
                  {ach.unlockedAt && <div className="w-2 h-2 rounded-full bg-white/40 shadow-[0_0_10px_white]" />}
                </div>
              ))}
            </div>
          </div>

          {/* Wallet */}
          <div className="flex items-center justify-between px-5 py-4 bg-white/[0.02] rounded-[1.5rem] border border-white/[0.05]">
            <div className="flex items-center gap-3">
               <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black text-white/60 border border-white/10">S</div>
               <span className="text-xs font-bold text-white/60 tracking-wider">{coins} <span className="text-[10px] ml-0.5 opacity-50 uppercase tracking-widest font-black">Studyn</span></span>
            </div>
            <TrendingUp className="w-4 h-4 text-white/20" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

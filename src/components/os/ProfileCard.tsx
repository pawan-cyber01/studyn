"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Share2, Edit3, Flame, Star, Trophy } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useGamificationStore } from "@/store/useGamificationStore";
import { useSocialStore } from "@/store/useSocialStore";

export default function ProfileCard() {
  const { profile, isProfileCardOpen, setProfileCardOpen } = useUserStore();
  const { level, xp, streak, achievements } = useGamificationStore();
  const { myStudynId } = useSocialStore();

  const xpProgress = (xp / (level * 1000)) * 100;

  return (
    <AnimatePresence>
      {isProfileCardOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setProfileCardOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[250]"
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden z-[251] shadow-2xl"
          >
            {/* Header / Banner */}
            <div className="h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 relative">
               <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
               <button 
                 onClick={() => setProfileCardOpen(false)}
                 className="absolute top-6 right-6 p-2 rounded-full bg-black/40 text-white/40 hover:text-white transition-all"
               >
                 <X className="w-4 h-4" />
               </button>
            </div>

            {/* Content */}
            <div className="px-8 pb-8 -mt-12 relative">
               <div className="flex items-end justify-between mb-6">
                  <div className="relative group">
                     <img src={profile.pfp} alt={profile.name} className="w-24 h-24 rounded-[2rem] border-4 border-[#0a0a0a] bg-[#0a0a0a] shadow-2xl" />
                     <div className="absolute inset-0 bg-black/40 rounded-[2rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                        <Edit3 className="w-6 h-6 text-white" />
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
                        <Share2 className="w-5 h-5" />
                     </button>
                     <button className="px-6 py-3 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:scale-[0.98] transition-transform">
                        Settings
                     </button>
                  </div>
               </div>

               <div className="mb-8">
                  <h2 className="text-3xl font-black text-white tracking-tighter mb-1">{profile.name}</h2>
                  <div className="flex items-center gap-2">
                     <span className="text-xs font-bold text-white/40">@{profile.username}</span>
                     <div className="w-1 h-1 rounded-full bg-white/10" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">ID: {myStudynId || 'S77281'}</span>
                  </div>
                  <p className="text-sm text-white/60 mt-4 leading-relaxed font-medium">
                     {profile.bio}
                  </p>
               </div>

               {/* Stats Grid */}
               <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col gap-2">
                     <div className="flex items-center gap-2 text-orange-400">
                        <Flame className="w-4 h-4 fill-current" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Streak</span>
                     </div>
                     <span className="text-2xl font-black text-white">{streak} Days</span>
                  </div>
                  <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col gap-2">
                     <div className="flex items-center gap-2 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Level</span>
                     </div>
                     <span className="text-2xl font-black text-white">{level}</span>
                  </div>
               </div>

               {/* Progress */}
               <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 mb-8">
                  <div className="flex items-center justify-between mb-3">
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Next Rank: Master</span>
                     <span className="text-xs font-bold text-white">{Math.round(xpProgress)}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${xpProgress}%` }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" 
                     />
                  </div>
               </div>

               {/* Achievements Preview */}
               <div>
                  <div className="flex items-center justify-between mb-4 px-2">
                     <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20">Recent Badges</h3>
                     <ChevronRight className="w-4 h-4 text-white/20" />
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                     {achievements.filter(a => a.unlockedAt).map(a => (
                        <div key={a.id} className="min-w-[50px] w-[50px] h-[50px] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl grayscale hover:grayscale-0 transition-all cursor-pointer">
                           {a.icon}
                        </div>
                     ))}
                     <div className="min-w-[50px] w-[50px] h-[50px] rounded-2xl border-2 border-dashed border-white/5 flex items-center justify-center text-white/10">
                        <Trophy className="w-5 h-5" />
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Star, Flame, Zap, TrendingUp, Users, ArrowUpRight } from "lucide-react";
import { useLeaderboardStore, LeaderboardUser } from "@/store/useLeaderboardStore";
import { useUserStore } from "@/store/useUserStore";
import { cn } from "@/lib/utils";

export default function LeaderboardApp() {
  const { users } = useLeaderboardStore();
  const { profile } = useUserStore();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-300" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="text-[10px] font-black text-white/20">{rank}</span>;
    }
  };

  return (
    <div className="h-full flex bg-black text-white overflow-hidden">
      {/* Sidebar - Insights */}
      <div className="w-80 border-r border-white/5 bg-white/[0.01] flex flex-col p-8">
        <div className="flex items-center gap-3 mb-12">
           <TrendingUp className="w-5 h-5 text-white/40" />
           <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Market Insights</h2>
        </div>

        <div className="space-y-8">
           <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                 <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Global Velocity</div>
                 <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-light">+12.4%</div>
              <p className="text-[10px] text-white/40 leading-relaxed italic">Study efficiency is peaking in the Eastern hemisphere.</p>
           </div>

           <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20 px-2">Top Performers Today</h3>
              {users.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-2xl transition-all group">
                   <img src={user.avatar} className="w-10 h-10 rounded-xl grayscale group-hover:grayscale-0 transition-all" alt="" />
                   <div className="flex-1">
                      <div className="text-[11px] font-bold">{user.name}</div>
                      <div className="text-[9px] text-white/20 font-black uppercase tracking-widest">LVL {user.level}</div>
                   </div>
                   <Zap className="w-3.5 h-3.5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
           </div>
        </div>

        <div className="mt-auto p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col items-center gap-4">
           <Users className="w-6 h-6 text-white/10" />
           <p className="text-[10px] text-center text-white/20 uppercase tracking-[0.2em] font-black leading-relaxed">
             Join a Study Room to multiply XP
           </p>
           <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95">
              Launch Multiverse
           </button>
        </div>
      </div>

      {/* Main Board */}
      <div className="flex-1 flex flex-col p-12">
        <div className="flex items-center justify-between mb-12">
           <div>
              <h1 className="text-4xl font-light tracking-tight text-white mb-2">Global <span className="font-bold text-white/40">Rankings</span></h1>
              <p className="text-sm font-medium text-white/20 uppercase tracking-widest">Showing Top 100 Students worldwide</p>
           </div>
           <div className="flex gap-4">
              <div className="flex flex-col items-end">
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Your Rank</span>
                 <span className="text-2xl font-light">#5 <span className="text-xs text-white/20 italic">Top 12%</span></span>
              </div>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-4 scroll-smooth">
          <AnimatePresence mode="popLayout">
            {users.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "flex items-center gap-8 p-6 rounded-[2rem] border transition-all group relative overflow-hidden",
                  user.id === '5' ? "bg-white/10 border-white/20 shadow-2xl" : "bg-white/[0.02] border-white/5 hover:border-white/10"
                )}
              >
                {user.id === '5' && (
                  <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full -z-10" />
                )}

                {/* Rank */}
                <div className="w-12 flex items-center justify-center">
                   {getRankIcon(user.rank)}
                </div>

                {/* Profile */}
                <div className="flex items-center gap-6 flex-1">
                   <div className="relative">
                      <img src={user.avatar} className={cn("w-14 h-14 rounded-2xl object-cover grayscale transition-all duration-700", user.status === 'studying' && "grayscale-0 ring-2 ring-emerald-400 ring-offset-4 ring-offset-black")} alt="" />
                      {user.status === 'studying' && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-black animate-pulse" />
                      )}
                   </div>
                   <div>
                      <div className="text-[16px] font-bold text-white/90">{user.name}</div>
                      <div className="flex items-center gap-3 mt-1">
                         <span className="text-[10px] font-black uppercase tracking-widest text-white/20">LVL {user.level}</span>
                         <div className="w-1 h-1 bg-white/10 rounded-full" />
                         <span className={cn(
                           "text-[10px] font-black uppercase tracking-widest",
                           user.status === 'studying' ? "text-emerald-400" : "text-white/20"
                         )}>{user.status}</span>
                      </div>
                   </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-12 text-right">
                   <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Streak</div>
                      <div className="flex items-center gap-2 justify-end text-orange-400">
                         <Flame className="w-4 h-4 fill-current" />
                         <span className="text-sm font-bold tabular-nums">{user.streak}d</span>
                      </div>
                   </div>
                   <div className="space-y-1 w-24">
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/20">XP</div>
                      <div className="text-sm font-bold tabular-nums text-white/90">{(user.xp / 1000).toFixed(1)}k</div>
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

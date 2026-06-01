"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageSquare, Share2, Zap, Trophy, Timer, MoreHorizontal, ShieldCheck } from "lucide-react";
import { useFeedStore } from "@/store/useFeedStore";
import { cn } from "@/lib/utils";

export default function SocialFeed() {
  const { posts, likePost } = useFeedStore();

  return (
    <div className="h-full bg-black/20 flex flex-col items-center overflow-y-auto scroll-smooth py-12 px-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Feed Header */}
        <div className="flex items-center justify-between px-4 mb-8">
           <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-white">Global <span className="font-light">Feed</span></h2>
              <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-black">Live Study Activity</p>
           </div>
           <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
              <Zap className="w-5 h-5" />
           </button>
        </div>

        {/* Posts List */}
        <AnimatePresence mode="popLayout">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-700 relative overflow-hidden"
            >
              {/* Post Background Glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/[0.02] blur-[100px] rounded-full group-hover:bg-white/[0.04] transition-all duration-700" />
              
              <div className="relative flex gap-6">
                {/* Avatar */}
                <div className="relative">
                  <img src={post.userAvatar} alt="" className="w-14 h-14 rounded-[1.5rem] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 border border-white/5" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black border-2 border-white/5 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-3 h-3 text-white/40" />
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[15px] font-bold text-white/90">{post.userName}</h3>
                      <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">{new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <button className="text-white/10 hover:text-white/40 transition-colors">
                       <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-[14px] leading-relaxed text-white/60 font-light">
                    {post.content}
                  </p>

                  {/* Activity Badge */}
                  {post.activity && (
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-2xl border border-white/5 shadow-xl">
                       {post.type === 'study' ? <Timer className="w-4 h-4 text-white/40" /> : <Trophy className="w-4 h-4 text-white/40" />}
                       <span className="text-[11px] font-black uppercase tracking-widest text-white/60">
                          {post.activity.type}: {post.activity.duration || post.activity.score}
                       </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-8 pt-4">
                    <button 
                      onClick={() => likePost(post.id)}
                      className={cn(
                        "flex items-center gap-2.5 transition-all active:scale-90",
                        post.hasLiked ? "text-white" : "text-white/20 hover:text-white/40"
                      )}
                    >
                      <Heart className={cn("w-5 h-5", post.hasLiked && "fill-white")} />
                      <span className="text-xs font-bold tabular-nums">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2.5 text-white/20 hover:text-white/40 transition-all">
                      <MessageSquare className="w-5 h-5" />
                      <span className="text-xs font-bold">12</span>
                    </button>
                    <button className="flex items-center gap-2.5 text-white/20 hover:text-white/40 transition-all ml-auto">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* End of Feed Indicator */}
        <div className="py-12 flex flex-col items-center opacity-10 space-y-4">
           <Zap className="w-8 h-8" />
           <p className="text-[10px] font-black uppercase tracking-[0.4em]">All caught up</p>
        </div>
      </div>
    </div>
  );
}

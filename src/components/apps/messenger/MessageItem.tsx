"use client";

import { motion } from "framer-motion";
import { Play, Pause, Smile } from "lucide-react";
import { useState, useRef } from "react";
import { Message } from "@/hooks/useRealtimeChat";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: Message;
  isMe: boolean;
  onReaction: (emoji: string) => void;
}

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

export default function MessageItem({ message, isMe, onReaction }: MessageItemProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleVoice = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(message.mediaUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn("flex group", isMe ? "justify-end" : "justify-start")}
    >
      <div className={cn("max-w-[75%] relative", isMe ? "items-end" : "items-start")}>
        {/* Sender Name (only for groups/others) */}
        {!isMe && (
          <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1 ml-4 block">
            {message.senderName}
          </span>
        )}

        <div className="relative">
          {/* Reactions Menu Overlay */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: showReactions ? 1 : 0, scale: showReactions ? 1 : 0.8, y: showReactions ? -40 : 10 }}
            className="absolute z-10 bg-[#1a1a1a] border border-white/10 rounded-full px-2 py-1 flex gap-1 shadow-2xl pointer-events-none group-hover:pointer-events-auto"
            style={{ [isMe ? 'right' : 'left']: 0 }}
          >
            {EMOJIS.map(emoji => (
              <button 
                key={emoji}
                onClick={() => { onReaction(emoji); setShowReactions(false); }}
                className="hover:scale-125 transition-transform p-1"
              >
                {emoji}
              </button>
            ))}
          </motion.div>

          <div className={cn(
            "p-4 rounded-3xl text-sm leading-relaxed shadow-xl border relative",
            isMe 
              ? "bg-white text-black rounded-tr-none border-transparent" 
              : "bg-[#111] text-white border-white/10 rounded-tl-none"
          )}>
            {/* Text Message */}
            {message.type === 'text' && (
              <p>{message.text}</p>
            )}

            {/* Image Message */}
            {message.type === 'image' && (
              <div className="rounded-2xl overflow-hidden -m-2">
                <img 
                  src={message.mediaUrl} 
                  alt="Shared image" 
                  className="max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(message.mediaUrl, '_blank')}
                />
              </div>
            )}

            {/* Voice Message */}
            {message.type === 'voice' && (
              <div className="flex items-center gap-3 min-w-[200px]">
                <button 
                  onClick={toggleVoice}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    isMe ? "bg-black text-white" : "bg-white/10 text-white"
                  )}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <div className="flex-1 space-y-1">
                  <div className="flex gap-0.5 h-6 items-center">
                    {[...Array(12)].map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "w-1 rounded-full",
                          isMe ? "bg-black/20" : "bg-white/20",
                          i % 2 === 0 ? "h-3" : "h-5"
                        )} 
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-widest opacity-40">
                    <span>Voice Note</span>
                    <span>0:12</span>
                  </div>
                </div>
              </div>
            )}

            {/* Reaction Button (Hidden by default, shows on hover) */}
            <button 
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}
              className={cn(
                "absolute -bottom-2 w-6 h-6 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all",
                isMe ? "-left-2" : "-right-2"
              )}
            >
              <Smile className="w-3 h-3 text-white/40" />
            </button>
          </div>

          {/* Render Reactions */}
          {message.reactions && (
            <div className={cn(
              "flex flex-wrap gap-1 mt-1",
              isMe ? "justify-end" : "justify-start"
            )}>
              {Object.entries(message.reactions).map(([emoji, uids]) => (
                <div 
                  key={emoji} 
                  className="px-1.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] flex items-center gap-1"
                >
                  <span>{emoji}</span>
                  <span className="text-white/40">{uids.length}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

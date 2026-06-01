"use client";

import { useState } from "react";
import { Users, MessageSquare, Trophy, Globe, UserPlus, Zap, Crown } from "lucide-react";
import { useSocialStore } from "@/store/useSocialStore";
import { cn } from "@/lib/utils";

type Tab = "rooms" | "friends" | "leaderboard";

export default function SocialApp() {
  const [activeTab, setActiveTab] = useState<Tab>("rooms");
  const { friends, rooms, activeRoomId, joinRoom, leaveRoom } = useSocialStore();

  return (
    <div className="flex h-full text-white/90">
      {/* Sidebar Navigation */}
      <div className="w-20 border-r border-white/5 bg-white/[0.01] flex flex-col items-center py-6 gap-6">
        <button 
          onClick={() => setActiveTab("rooms")}
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
            activeTab === "rooms" ? "bg-white/10 text-white shadow-xl border border-white/10" : "text-white/20 hover:text-white/40"
          )}
        >
          <Globe className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setActiveTab("friends")}
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
            activeTab === "friends" ? "bg-white/10 text-white shadow-xl border border-white/10" : "text-white/20 hover:text-white/40"
          )}
        >
          <Users className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setActiveTab("leaderboard")}
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
            activeTab === "leaderboard" ? "bg-white/10 text-white shadow-xl border border-white/10" : "text-white/20 hover:text-white/40"
          )}
        >
          <Trophy className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-white/[0.01]">
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">
            {activeTab}
          </h2>
          <div className="flex gap-4">
             <button className="btn-premium px-6 py-2 h-9">
                Global Feed
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          {activeTab === "rooms" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map(room => (
                <div 
                  key={room.id}
                  className={cn(
                    "group p-6 rounded-[2rem] border transition-all duration-500",
                    activeRoomId === room.id 
                      ? "bg-white/5 border-white/20 ring-1 ring-white/10" 
                      : "bg-white/[0.02] border-white/5 hover:border-white/10"
                  )}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center border",
                      room.type === 'focus' ? "bg-white/5 border-white/10" : "bg-white/[0.02] border-white/5"
                    )}>
                      {room.type === 'focus' ? <Zap className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                    </div>
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                      {room.members} Online
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{room.name}</h3>
                  <p className="text-xs text-white/30 mb-6 font-medium">Shared deep work and collaborative focus.</p>
                  
                  <button 
                    onClick={() => activeRoomId === room.id ? leaveRoom() : joinRoom(room.id)}
                    className={cn(
                      "w-full aspect-5-3 btn-premium",
                      activeRoomId === room.id && "bg-white/10 text-white"
                    )}
                  >
                    {activeRoomId === room.id ? "Leave Room" : "Join Session"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "friends" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2 mb-6">
                 <h3 className="text-sm font-bold">Recent Contacts</h3>
                 <button className="flex items-center gap-2 text-[10px] font-bold text-white/30 hover:text-white transition-colors">
                    <UserPlus className="w-3.5 h-3.5" />
                    Invite
                 </button>
              </div>
              {friends.map(friend => (
                <div key={friend.id} className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                  <div className="relative">
                    <img src={friend.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className={cn(
                      "absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-black",
                      friend.status === 'studying' ? "bg-orange-500" : friend.status === 'online' ? "bg-green-500" : "bg-gray-500"
                    )} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[14px] font-bold">{friend.name}</h4>
                      <span className="text-[10px] font-black text-white/20 bg-white/5 px-2 py-0.5 rounded-md">LVL {friend.level}</span>
                    </div>
                    <p className="text-[11px] text-white/30 font-medium capitalize">{friend.status}</p>
                  </div>
                  <button className="w-12 h-12 btn-premium opacity-50">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "leaderboard" && (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-[2rem] p-8 border border-white/10 mb-8 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Crown className="w-32 h-32" />
                 </div>
                 <h3 className="text-2xl font-light mb-2">Weekly <span className="font-bold">Champions</span></h3>
                 <p className="text-sm text-white/30 max-w-xs">The top performing students in the global Studyn network.</p>
              </div>
              <div className="space-y-2">
                {friends.sort((a, b) => b.level - a.level).map((f, i) => (
                  <div key={f.id} className="flex items-center gap-6 p-4 px-6 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5">
                    <span className="text-lg font-black text-white/10 w-6">0{i+1}</span>
                    <img src={f.avatar} alt="" className="w-10 h-10 rounded-xl grayscale" />
                    <span className="flex-1 text-sm font-bold">{f.name}</span>
                    <span className="text-[11px] font-black text-white/40 tracking-widest">{f.level * 1420} XP</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

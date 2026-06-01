"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { 
  Search, Send, Plus, MoreVertical, MessageSquare, 
  Phone, Video, Users, Mic, Image as ImageIcon 
} from "lucide-react";
import { useSocialStore } from "@/store/useSocialStore";
import { useUserStore } from "@/store/useUserStore";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { auth, storage, rtdb } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as dbRef, onValue, set, onDisconnect, serverTimestamp } from "firebase/database";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import MessageItem from "./messenger/MessageItem";
import VoiceRecorder from "./messenger/VoiceRecorder";

export default function MessengerApp() {
  const { friends } = useSocialStore();
  const { profile } = useUserStore();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { messages, isTyping, sendMessage, setTyping, addReaction } = useRealtimeChat(activeChat);

  const activeFriend = useMemo(() => friends.find(f => f.id === activeChat), [friends, activeChat]);

  // Handle Presence
  useEffect(() => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    const userStatusRef = dbRef(rtdb, `status/${uid}`);

    const isOfflineData = {
      state: 'offline',
      last_changed: serverTimestamp(),
    };

    const isOnlineData = {
      state: 'online',
      last_changed: serverTimestamp(),
      studynId: profile.studynId,
      name: profile.name,
      pfp: profile.pfp
    };

    const connectedRef = dbRef(rtdb, '.info/connected');
    onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === false) return;

      onDisconnect(userStatusRef).set(isOfflineData).then(() => {
        set(userStatusRef, isOnlineData);
      });
    });
  }, [profile]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText("");
    setTyping(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeChat || !auth.currentUser) return;

    const storageRef = ref(storage, `chats/${activeChat}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    sendMessage(file.name, 'image', url);
  };

  return (
    <div className="flex h-full bg-[#050505] overflow-hidden select-none">
      {/* Sidebar */}
      <div className="w-80 border-r border-white/5 flex flex-col bg-black/20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight">Messages</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowAddFriend(true)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
                title="Add Friend"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowCreateGroup(true)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
                title="New Group"
              >
                <Users className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white/60 transition-colors" />
            <input 
              type="text" 
              placeholder="Search conversations..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
          {friends.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center px-6">
               <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                 <Users className="w-6 h-6 text-white/10" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-white/20 leading-loose">
                 Your network is empty.<br/>
                 ID: <span className="text-white/40">{profile.studynId || 'Generating...'}</span>
               </p>
            </div>
          ) : friends.map(friend => (
            <button
              key={friend.id}
              onClick={() => setActiveChat(friend.id)}
              className={cn(
                "w-full p-4 rounded-2xl flex items-center gap-4 transition-all group",
                activeChat === friend.id ? "bg-white/10 border border-white/10 shadow-lg" : "hover:bg-white/5 border border-transparent"
              )}
            >
              <div className="relative">
                <img src={friend.pfp} alt={friend.name} className="w-12 h-12 rounded-2xl bg-white/5 object-cover" />
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-[#0a0a0a]",
                  friend.status === 'online' ? "bg-green-500" : "bg-gray-500"
                )} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-bold text-white truncate">{friend.name}</span>
                  <span className="text-[10px] text-white/20 font-medium">Just now</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/40 truncate">
                    {isTyping[friend.id] ? "is typing..." : "Click to chat"}
                  </p>
                  {isTyping[friend.id] && (
                    <div className="flex gap-0.5">
                      <div className="w-1 h-1 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1 h-1 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1 h-1 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#080808]">
        {activeFriend ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={activeFriend.pfp} alt={activeFriend.name} className="w-10 h-10 rounded-xl" />
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0a0a0a]",
                    activeFriend.status === 'online' ? "bg-green-500" : "bg-gray-500"
                  )} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{activeFriend.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
                      {isTyping[activeFriend.id] ? "Typing..." : activeFriend.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-3 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
              {messages.length === 0 && (
                <div className="flex flex-col items-center mb-12 py-12">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full" />
                    <img src={activeFriend.pfp} alt={activeFriend.name} className="relative w-24 h-24 rounded-[2.5rem] shadow-2xl border border-white/10" />
                  </div>
                  <h4 className="text-2xl font-black text-white mb-1">{activeFriend.name}</h4>
                  <p className="text-xs text-white/20 uppercase font-black tracking-widest mb-6">ID: {activeFriend.studynId}</p>
                  <div className="h-px w-32 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <p className="text-xs text-white/40 mt-6 max-w-xs text-center leading-relaxed font-medium">
                    Your messages are encrypted. Start a conversation with {activeFriend.name.split(' ')[0]}.
                  </p>
                </div>
              )}

              {messages.map((msg) => (
                <MessageItem 
                  key={msg.id} 
                  message={msg} 
                  isMe={msg.senderId === auth.currentUser?.uid} 
                  onReaction={(emoji) => addReaction(msg.id, emoji)}
                />
              ))}
            </div>

            {/* Input Container */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border-t border-white/5">
              <div className="flex items-center gap-3">
                <AnimatePresence mode="wait">
                  {isVoiceMode ? (
                    <VoiceRecorder 
                      onSend={(url) => { sendMessage("", 'voice', url); setIsVoiceMode(false); }}
                      onCancel={() => setIsVoiceMode(false)}
                    />
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-white/20 transition-all shadow-inner"
                    >
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 rounded-xl text-white/20 hover:text-white/60 transition-all hover:bg-white/5"
                      >
                        <ImageIcon className="w-5 h-5" />
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </button>
                      <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => {
                          setInputText(e.target.value);
                          setTyping(e.target.value.length > 0);
                        }}
                        onBlur={() => setTyping(false)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={`Message ${activeFriend.name.split(' ')[0]}...`}
                        className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm py-2 px-2"
                      />
                      <button 
                        onClick={() => setIsVoiceMode(true)}
                        className="p-3 rounded-xl text-white/20 hover:text-white/60 transition-all hover:bg-white/5"
                      >
                        <Mic className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={handleSendMessage}
                        disabled={!inputText.trim()}
                        className="p-3 rounded-xl bg-white text-black disabled:bg-white/20 disabled:text-black/40 transition-all shadow-lg active:scale-95"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full animate-pulse" />
              <div className="relative w-24 h-24 rounded-[2.5rem] bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-2xl">
                <MessageSquare className="w-10 h-10 text-white/10" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Encrypted Messenger</h3>
            <p className="text-sm text-white/30 max-w-xs leading-relaxed font-medium">
              Select a study partner from the sidebar to start a secure, realtime conversation.
            </p>
            <div className="mt-12 flex flex-col items-center gap-2">
               <span className="text-[10px] font-black uppercase tracking-widest text-white/10">Your Studyn ID</span>
               <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                 <span className="text-sm font-mono text-white/60">{profile.studynId}</span>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Friend Modal */}
      <AnimatePresence>
        {showAddFriend && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white">Add Study Partner</h3>
                <button onClick={() => setShowAddFriend(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                  <Plus className="w-5 h-5 text-white/20 rotate-45" />
                </button>
              </div>
              <p className="text-xs text-white/40 mb-6 leading-relaxed">
                Enter your partner&apos;s unique Studyn ID (e.g., P42876) to start collaborating.
              </p>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text" 
                    placeholder="Enter Studyn ID..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-white/20 transition-all"
                  />
                </div>
                <button className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-white/90 transition-all">
                  Search & Add
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateGroup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white">Create Study Group</h3>
                <button onClick={() => setShowCreateGroup(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                  <Plus className="w-5 h-5 text-white/20 rotate-45" />
                </button>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center group/pfp cursor-pointer">
                    <Plus className="w-6 h-6 text-white/20 group-hover/pfp:text-white/60 transition-all" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Upload Group Icon</span>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-1">Group Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Physics Masters"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-white/20 transition-all"
                  />
                </div>
                <button className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-white/90 transition-all shadow-xl">
                  Create Group
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

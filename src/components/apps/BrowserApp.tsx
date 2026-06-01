"use client";
import { useState, useEffect } from "react";
import { 
  RotateCcw, Globe, Lock, ChevronLeft, ChevronRight, Plus, X, Split,
  MoreHorizontal, Command, Bookmark
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBrowserStore } from "@/store/useBrowserStore";

import { motion } from "framer-motion";

export default function BrowserApp() {
  const { 
    tabs, activeTabId, isSplitScreen, 
    addTab, closeTab, setActiveTab, updateTab, setSplitScreen 
  } = useBrowserStore();
  
  const [inputUrl, setInputUrl] = useState("");
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  useEffect(() => {
    setInputUrl(activeTab.url);
  }, [activeTab.url, activeTabId]);

  const navigateTo = (newUrl: string) => {
    let finalUrl = newUrl;
    if (!newUrl.startsWith("http")) {
      finalUrl = `https://www.google.com/search?q=${encodeURIComponent(newUrl)}&igu=1`;
    }
    updateTab(activeTabId, { url: finalUrl, title: finalUrl.split('/')[2] || 'Loading...' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(inputUrl);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full flex flex-col bg-black text-white overflow-hidden select-none"
    >
      {/* Premium Sidebar-style Tab Bar (Arc Inspired) */}
      <div className="h-12 bg-black/40 flex items-center px-4 gap-2 border-b border-white/5 backdrop-blur-2xl">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-2 flex-1">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "group px-3 h-8 min-w-[120px] flex items-center gap-2 rounded-lg transition-all cursor-pointer border",
                activeTabId === tab.id 
                  ? "bg-white/[0.08] border-white/10 text-white shadow-lg" 
                  : "bg-transparent border-transparent text-white/40 hover:bg-white/[0.04]"
              )}
            >
              <Globe className={cn("w-3 h-3 flex-shrink-0", activeTabId === tab.id ? "text-blue-400" : "text-white/20")} />
              <span className="text-[10px] font-medium truncate flex-1">{tab.title}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                className="w-4 h-4 rounded flex items-center justify-center hover:bg-white/10 opacity-0 group-hover:opacity-100"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
          <button 
            onClick={() => addTab()}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-white/20 transition-all border border-transparent hover:border-white/5"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-2 pl-4 border-l border-white/5">
           <button 
             onClick={() => setSplitScreen(!isSplitScreen)}
             className={cn(
               "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
               isSplitScreen ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-white/20 hover:bg-white/5"
             )}
           >
              <Split className="w-3.5 h-3.5" />
           </button>
           <button className="w-8 h-8 rounded-lg flex items-center justify-center text-white/20 hover:bg-white/5">
              <MoreHorizontal className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Modern URL Bar Container */}
      <div className="p-3 flex items-center gap-3 bg-white/[0.01]">
        <div className="flex items-center gap-0.5 p-1 bg-white/[0.03] rounded-xl border border-white/5">
           <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 text-white/40"><ChevronLeft className="w-4 h-4" /></button>
           <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 text-white/40"><ChevronRight className="w-4 h-4" /></button>
           <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 text-white/40"><RotateCcw className="w-3.5 h-3.5" /></button>
        </div>

        <form onSubmit={handleSearch} className="flex-1 relative group">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Lock className="w-2.5 h-2.5 text-emerald-400/60" />
            <div className="w-px h-3 bg-white/10" />
          </div>
          <input 
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/5 rounded-xl pl-12 pr-12 py-2.5 text-[11px] font-medium focus:outline-none focus:bg-white/[0.07] focus:border-white/10 transition-all placeholder:text-white/10"
            placeholder="Search or enter URL"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-20">
             <Command className="w-3 h-3" />
             <span className="text-[10px] font-black">L</span>
          </div>
        </form>

        <div className="flex items-center gap-2">
           <button className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-all">
              <Bookmark className="w-4 h-4" />
           </button>
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 cursor-pointer hover:scale-105 transition-all">
              <Globe className="w-4 h-4 text-white" />
           </div>
        </div>
      </div>

      {/* Viewport Area */}
      <div className={cn("flex-1 flex gap-2 p-2 pt-0", isSplitScreen ? "flex-row" : "flex-col")}>
        <div className="flex-1 bg-white rounded-2xl overflow-hidden relative shadow-2xl border border-white/5">
           <iframe
             src={activeTab.url}
             className="w-full h-full bg-white"
             title="Main View"
           />
           {activeTab.loading && (
             <div className="absolute inset-0 bg-[#080808]/80 backdrop-blur-md flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
             </div>
           )}
        </div>
        
        {isSplitScreen && (
          <div className="flex-1 bg-white rounded-2xl overflow-hidden relative shadow-2xl border border-white/5">
             <iframe
               src="https://www.google.com/search?igu=1"
               className="w-full h-full bg-white"
               title="Split View"
             />
             <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-[8px] font-black uppercase tracking-widest text-white/40">
                Split Screen
             </div>
          </div>
        )}
      </div>

      {/* Subtle Bottom Bar */}
      <div className="h-6 px-4 flex items-center justify-between opacity-20">
         <span className="text-[8px] font-black uppercase tracking-[0.2em]">Secure Session</span>
         <div className="flex gap-4">
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">AES-256</span>
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Quantum Tunnel</span>
         </div>
      </div>
    </motion.div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { 
  Wifi, 
  Search, 
  Flame, 
  Star, 
  LayoutGrid, 
  BatteryMedium, 
  Maximize, 
  Minimize,
  Moon,
  Gift
} from "lucide-react";
import { useGamificationStore } from "@/store/useGamificationStore";
import { useUIStore } from "@/store/useUIStore";
import { useOSStore } from "@/store/useOSStore";
import { useUserStore } from "@/store/useUserStore";

export default function StatusBar() {
  const [time, setTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { level, xp, streak } = useGamificationStore();
  const { setControlPanelOpen, isWifiEnabled, isDoNotDisturbEnabled } = useUIStore();
  const { setSpotlightOpen, openWindow } = useOSStore();
  const { setProfileCardOpen, profile } = useUserStore();
  
  const xpProgress = (xp / (level * 1000)) * 100;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    
    return () => {
      clearInterval(timer);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
    }
  };

  return (
    <div className="h-8 w-full flex items-center justify-between px-4 bg-black/10 backdrop-blur-md border-b border-white/5 text-[12px] font-medium text-white/90 z-[200]">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 font-bold tracking-tight">
          <div className="relative">
             <div className="absolute inset-0 bg-white/20 blur-lg rounded-full" />
             <img src="/logo.png" alt="" className="w-5 h-5 relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
          </div>
          <span>Studyn</span>
        </div>
        <div className="flex items-center gap-4 text-white/60">
          <span className="hover:text-white cursor-pointer transition-colors">File</span>
          <span className="hover:text-white cursor-pointer transition-colors">Edit</span>
          <span className="hover:text-white cursor-pointer transition-colors">View</span>
          <span className="hover:text-white cursor-pointer transition-colors">Go</span>
          <span className="hover:text-white cursor-pointer transition-colors">Help</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Gamification Stats */}
        <div className="flex items-center gap-4 border-r border-white/10 pr-4">
          <div className="flex items-center gap-1.5 text-orange-400">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span className="font-bold">{streak}</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex flex-col items-end gap-0.5">
                <div className="flex items-center gap-1.5 text-yellow-400">
                   <Star className="w-3 h-3 fill-current" />
                   <span className="text-[10px] font-bold">LVL {level}</span>
                </div>
                <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-yellow-400 transition-all duration-1000" style={{ width: `${xpProgress}%` }} />
                </div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-white/70">
          <Search 
            onClick={() => setSpotlightOpen(true)}
            className="w-3.5 h-3.5 cursor-pointer hover:text-white" 
          />

          <Gift 
            onClick={() => openWindow('dailyspin', 'Daily Spin', 'dailyspin')}
            className="w-3.5 h-3.5 cursor-pointer text-pink-400 hover:text-pink-300 transition-colors"
          />
          
          <button 
            onClick={toggleFullscreen}
            className="hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>

          {isDoNotDisturbEnabled && (
            <Moon className="w-3 h-3 text-indigo-400 fill-current" />
          )}
          
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setControlPanelOpen(true)}>
            <div className="flex items-center gap-1">
               <Wifi className={isWifiEnabled ? "w-3.5 h-3.5 text-white" : "w-3.5 h-3.5 text-white/20"} />
            </div>
            <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
               <span className="text-[10px] font-bold text-white/40 group-hover:text-white transition-colors">85%</span>
               <BatteryMedium className="w-3.5 h-3.5 text-white/60" />
            </div>
            <LayoutGrid className="w-3.5 h-3.5 cursor-pointer hover:text-white ml-1" />
          </div>
        </div>
        
        <div 
          className="flex items-center gap-2 border-l border-white/10 pl-4 cursor-pointer hover:text-white transition-colors"
          onClick={() => setControlPanelOpen(true)}
        >
          <span className="text-white/90">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-white/60">
            {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>

        <div 
          className="w-7 h-7 rounded-full bg-white/5 border border-white/10 overflow-hidden cursor-pointer hover:border-white/30 transition-all active:scale-95"
          onClick={() => setProfileCardOpen(true)}
        >
          <img src={profile.pfp} alt={profile.name} className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}

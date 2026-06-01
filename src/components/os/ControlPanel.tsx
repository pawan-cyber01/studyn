"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Wifi, 
  Bluetooth, 
  Moon, 
  Sun, 
  Volume2, 
  Airplay, 
  Battery, 
  LayoutGrid
} from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { cn } from "@/lib/utils";

export default function ControlPanel() {
  const { 
    isControlPanelOpen, 
    setControlPanelOpen,
    brightness, setBrightness,
    volume, setVolume,
    isWifiEnabled, toggleWifi,
    isBluetoothEnabled, toggleBluetooth,
    isDoNotDisturbEnabled, toggleDoNotDisturb
  } = useUIStore();

  return (
    <AnimatePresence>
      {isControlPanelOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setControlPanelOpen(false)}
            className="fixed inset-0 z-[150] bg-transparent"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-12 right-4 w-80 bg-black/80 backdrop-blur-[50px] border border-white/5 rounded-[2.5rem] p-6 z-[151] shadow-2xl"
          >
            <div className="flex flex-wrap gap-3 mb-6">
              {/* Main Toggles */}
              <button 
                onClick={toggleWifi}
                className={cn(
                  "flex-1 min-w-[130px] p-4 rounded-3xl border transition-all flex flex-col gap-3",
                  isWifiEnabled ? "bg-white/10 border-white/20 text-white" : "bg-white/[0.02] border-white/5 text-white/20 hover:bg-white/5"
                )}
              >
                <Wifi className="w-5 h-5" />
                <div className="text-[10px] font-black uppercase tracking-widest">Wi-Fi</div>
              </button>
              <button 
                onClick={toggleBluetooth}
                className={cn(
                  "flex-1 min-w-[130px] p-4 rounded-3xl border transition-all flex flex-col gap-3",
                  isBluetoothEnabled ? "bg-white/10 border-white/20 text-white" : "bg-white/[0.02] border-white/5 text-white/20 hover:bg-white/5"
                )}
              >
                <Bluetooth className="w-5 h-5" />
                <div className="text-[10px] font-black uppercase tracking-widest">Bluetooth</div>
              </button>
              <button 
                onClick={toggleDoNotDisturb}
                className={cn(
                  "flex-1 min-w-[130px] p-4 rounded-3xl border transition-all flex flex-col gap-3",
                  isDoNotDisturbEnabled ? "bg-white/10 border-white/20 text-white" : "bg-white/[0.02] border-white/5 text-white/20 hover:bg-white/5"
                )}
              >
                <Moon className="w-5 h-5" />
                <div className="text-[10px] font-black uppercase tracking-widest">DND</div>
              </button>
              <div className="flex-1 min-w-[130px] p-4 rounded-3xl bg-white/[0.02] border border-white/5 text-white/20 flex flex-col gap-3">
                <Airplay className="w-5 h-5" />
                <div className="text-[10px] font-black uppercase tracking-widest">AirDrop</div>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/20">
                   <span>Brightness</span>
                   <span>{brightness}%</span>
                </div>
                <div className="relative h-10 bg-white/5 rounded-2xl flex items-center px-4 gap-4 overflow-hidden border border-white/5">
                   <Sun className="w-4 h-4 text-white/40" />
                   <input 
                     type="range"
                     min="0" max="100"
                     value={brightness}
                     onChange={(e) => setBrightness(parseInt(e.target.value))}
                     className="flex-1 accent-white h-full bg-transparent appearance-none"
                   />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/20">
                   <span>Volume</span>
                   <span>{volume}%</span>
                </div>
                <div className="relative h-10 bg-white/5 rounded-2xl flex items-center px-4 gap-4 overflow-hidden border border-white/5">
                   <Volume2 className="w-4 h-4 text-white/40" />
                   <input 
                     type="range"
                     min="0" max="100"
                     value={volume}
                     onChange={(e) => setVolume(parseInt(e.target.value))}
                     className="flex-1 accent-white h-full bg-transparent appearance-none"
                   />
                </div>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                     <Battery className="w-4 h-4 text-white/40" />
                  </div>
                  <div>
                     <div className="text-[9px] font-black uppercase tracking-widest text-white/20">Battery</div>
                     <div className="text-xs font-bold text-white/60">85%</div>
                  </div>
               </div>
               <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                  <LayoutGrid className="w-4 h-4 text-white/40" />
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

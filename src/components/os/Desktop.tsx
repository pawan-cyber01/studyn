"use client";

import { useOSStore, Space } from "@/store/useOSStore";
import { useUIStore } from "@/store/useUIStore";
import WallpaperLayer from "@/components/os/WallpaperLayer";
import WindowManager from "@/components/os/WindowManager";
import StatusBar from "@/components/os/StatusBar";
import Spotlight from "@/components/os/Spotlight";
import MissionControl from "@/components/os/MissionControl";
import WidgetLayer from "@/components/os/WidgetLayer";
import FocusOverlay from "@/components/os/FocusOverlay";
import WidgetPicker from "@/components/os/WidgetPicker";
import ControlPanel from "@/components/os/ControlPanel";
import VoiceInterface from "@/components/os/VoiceInterface";
import AddWidgetButton from "@/components/os/AddWidgetButton";
import Dock from "@/components/os/Dock";
import ProfileCard from "@/components/os/ProfileCard";
import CompanionLayer from "@/components/os/CompanionLayer";
import Launchpad from "@/components/os/Launchpad";
import MusicVisualizer from "@/components/os/MusicVisualizer";
import AmbientEngine from "@/components/os/AmbientEngine";
import { motion, AnimatePresence } from "framer-motion";

export default function Desktop() {
  const { isBooted, activeSpaceId, spaces, isMissionControlOpen } = useOSStore();
  const { brightness, isDoNotDisturbEnabled } = useUIStore();

  const activeSpace = spaces.find((s: Space) => s.id === activeSpaceId) || spaces[0];

  if (!isBooted) return null;

  // Calculate brightness overlay opacity
  const brightnessOpacity = (100 - brightness) / 125;

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black select-none">
      {/* Dynamic Background Layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSpaceId}
          initial={{ opacity: 0, x: 20, filter: "blur(20px)" }}
          animate={{ 
            opacity: 1, 
            x: 0, 
            filter: isDoNotDisturbEnabled ? "blur(40px) saturate(0.5)" : "blur(0px)",
            transition: { duration: 1 }
          }}
          exit={{ opacity: 0, x: -20, filter: "blur(20px)" }}
          className="absolute inset-0"
        >
          <WallpaperLayer url={activeSpace.wallpaper} />
        </motion.div>
      </AnimatePresence>

      {/* Brightness Simulation Layer */}
      <motion.div 
        animate={{ opacity: brightnessOpacity }}
        className="absolute inset-0 bg-black pointer-events-none z-[999]" 
      />

      {/* Glass Overlay for Depth */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* UI Layers */}
      <AmbientEngine />
      <MusicVisualizer />
      <StatusBar />
      <ProfileCard />
      <CompanionLayer />
      
      {/* Dim widgets when in DND mode to focus on windows */}
      <motion.div 
        animate={{ 
          filter: isDoNotDisturbEnabled ? "blur(10px) brightness(0.5)" : "none",
          opacity: isDoNotDisturbEnabled ? 0.4 : 1
        }}
        className="contents"
      >
        <WidgetLayer />
      </motion.div>
      
      <WindowManager />

      <AnimatePresence>
        {isMissionControlOpen && <MissionControl />}
      </AnimatePresence>

      <Spotlight />
      <WidgetPicker />
      <FocusOverlay />
      <ControlPanel />
      <VoiceInterface />
      <AddWidgetButton />
      <Launchpad />
      <Dock />
    </main>
  );
}

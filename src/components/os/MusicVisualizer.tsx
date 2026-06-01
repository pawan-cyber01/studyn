"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useAudioStore } from "@/store/useAudioStore";

export default function MusicVisualizer() {
  const { isPlaying, frequencies, updateFrequencies, intensity } = useAudioStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(updateFrequencies, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, updateFrequencies]);

  return (
    <>
      {/* Edge Visualizers */}
      <div className="fixed inset-y-0 left-0 w-8 pointer-events-none z-50 flex flex-col justify-center gap-1.5 px-2">
        <AnimatePresence>
          {isPlaying && frequencies.map((freq, i) => (
            <motion.div
              key={`left-${i}`}
              initial={{ width: 0 }}
              animate={{ width: freq * 40 + 4 }}
              exit={{ width: 0 }}
              className="h-1 bg-gradient-to-r from-blue-500/40 to-transparent rounded-full"
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="fixed inset-y-0 right-0 w-8 pointer-events-none z-50 flex flex-col justify-center gap-1.5 px-2 items-end">
        <AnimatePresence>
          {isPlaying && frequencies.map((freq, i) => (
            <motion.div
              key={`right-${i}`}
              initial={{ width: 0 }}
              animate={{ width: freq * 40 + 4 }}
              exit={{ width: 0 }}
              className="h-1 bg-gradient-to-l from-indigo-500/40 to-transparent rounded-full"
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Global Ambient Glow */}
      <motion.div
        animate={{ 
          opacity: isPlaying ? intensity * 0.15 : 0,
          scale: isPlaying ? 1 + intensity * 0.1 : 1
        }}
        className="fixed inset-0 pointer-events-none z-[1] bg-gradient-to-b from-blue-500/20 via-transparent to-indigo-500/20 mix-blend-screen blur-[100px]"
      />
    </>
  );
}

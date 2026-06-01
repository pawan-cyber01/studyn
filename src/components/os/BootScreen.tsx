"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOSStore } from "@/store/useOSStore";
import Image from "next/image";

export default function BootScreen() {
  const { setBooted, setBootProgress, bootProgress, isBooted } = useOSStore();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (isBooted) return;

    if (bootProgress < 100) {
      const timer = setInterval(() => {
        setBootProgress(Math.min(100, bootProgress + 1));
      }, 20);
      return () => clearInterval(timer);
    } else {
      // Logic for transition once 100% is reached
      const stageTimer = setTimeout(() => setStage(1), 500);
      const bootTimer = setTimeout(() => setBooted(true), 2500);
      
      return () => {
        clearTimeout(stageTimer);
        clearTimeout(bootTimer);
      };
    }
  }, [bootProgress, isBooted, setBooted, setBootProgress]);

  // Hide BootScreen completely when OS is booted
  if (isBooted) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {stage === 0 ? (
          <motion.div
            key="logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            className="flex flex-col items-center gap-2"
          >
            {/* Premium Logo with White Shadow */}
            <div className="relative mb-12">
               <div className="absolute inset-0 bg-white/20 blur-[60px] rounded-full animate-pulse" />
               <div className="relative z-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                 <Image 
                  src="/logo.png" 
                  alt="Studyn Logo" 
                  width={128}
                  height={128}
                  className="w-32 h-32"
                  priority
                 />
               </div>
            </div>
            
            <div className="w-48 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
              <motion.div
                className="absolute inset-y-0 left-0 bg-white shadow-[0_0:10px_rgba(255,255,255,0.8)]"
                initial={{ width: "0%" }}
                animate={{ width: `${bootProgress}%` }}
              />
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
              Initializing Neural Core
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(40px)" }}
            className="text-center"
          >
            <h1 className="text-4xl font-light tracking-tighter text-white">
              Welcome to <span className="font-bold">Studyn</span>
            </h1>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.3em] text-white/20">
              Your Autonomous Study Environment
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] z-[1001]" />
    </div>
  );
}

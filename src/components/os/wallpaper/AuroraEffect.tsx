"use client";

import { motion } from "framer-motion";
import { useWallpaperStore } from "@/store/useWallpaperStore";

export default function AuroraEffect() {
  const { settings } = useWallpaperStore();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 mix-blend-screen">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          x: ["-10%", "10%", "-10%"],
          y: ["-10%", "10%", "-10%"],
        }}
        transition={{
          duration: 20 / settings.motionIntensity,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.1)_0%,transparent_50%)] blur-[100px]"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [0, -120, 0],
          x: ["10%", "-10%", "10%"],
          y: ["10%", "-10%", "10%"],
        }}
        transition={{
          duration: 25 / settings.motionIntensity,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,0,255,0.05)_0%,transparent_50%)] blur-[100px]"
      />
    </div>
  );
}

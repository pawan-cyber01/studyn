"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useWallpaperStore } from "@/store/useWallpaperStore";
import RainEffect from "./wallpaper/RainEffect";
import StarfieldEffect from "./wallpaper/StarfieldEffect";
import ParticleEffect from "./wallpaper/ParticleEffect";
import AuroraEffect from "./wallpaper/AuroraEffect";

interface WallpaperLayerProps {
  url: string;
}

export default function WallpaperLayer({ url }: WallpaperLayerProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { settings } = useWallpaperStore();

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Parallax intensity control
  const pRange = useMemo(() => 20 * settings.parallaxIntensity, [settings.parallaxIntensity]);
  const moveX = useTransform(springX, [-1000, 1000], [-pRange, pRange]);
  const moveY = useTransform(springY, [-1000, 1000], [-pRange, pRange]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const renderEffect = () => {
    switch (settings.effect) {
      case 'rain': return <RainEffect />;
      case 'stars': return <StarfieldEffect />;
      case 'particles': return <ParticleEffect />;
      case 'aurora': return <AuroraEffect />;
      default: return null;
    }
  };

  return (
    <div className="absolute inset-[-50px] z-0 overflow-hidden bg-[#020202]">
      {/* Base Wallpaper Layer */}
      <motion.div
        key={url}
        style={{ 
          x: moveX, 
          y: moveY, 
          backgroundImage: `url(${url})`,
          filter: `blur(${settings.blur}px) grayscale(${settings.grayscale ? 1 : 0}) brightness(${1 - settings.dim})`
        }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1.05 }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className="absolute inset-0 bg-cover bg-center transition-[filter] duration-700"
      />

      {/* Dynamic Effects Layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={settings.effect}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {renderEffect()}
        </motion.div>
      </AnimatePresence>

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
      
      {/* Noise / Grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Interactive Light Glow */}
      <motion.div 
        style={{ x: springX, y: springY }}
        className="absolute w-[800px] h-[800px] top-[-400px] left-[-400px] bg-white/[0.03] blur-[150px] rounded-full pointer-events-none mix-blend-soft-light"
      />
    </div>
  );
}

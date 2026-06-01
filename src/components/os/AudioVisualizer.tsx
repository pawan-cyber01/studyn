"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AudioVisualizer() {
  const [bars, setBars] = useState<number[]>(new Array(12).fill(1));

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.random() * 20 + 5));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end gap-[2px] h-4">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          animate={{ height }}
          className="w-[2px] bg-white/40 rounded-full"
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      ))}
    </div>
  );
}

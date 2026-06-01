"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useWidgetStore } from "@/store/useWidgetStore";

export default function AddWidgetButton() {
  const { setPickerOpen, isPickerOpen } = useWidgetStore();

  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setPickerOpen(!isPickerOpen)}
      className="fixed bottom-8 right-[calc(50%+340px)] z-[401] w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-2xl group"
    >
      <Plus className="w-6 h-6" />
      
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-white/5 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
}

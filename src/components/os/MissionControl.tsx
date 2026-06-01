"use client";

import { useOSStore } from "@/store/useOSStore";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MissionControl() {
  const { spaces, activeSpaceId, setActiveSpace, isMissionControlOpen, setMissionControl, addSpace, removeSpace } = useOSStore();

  return (
    <AnimatePresence>
      {isMissionControlOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xl flex flex-col items-center justify-center p-12"
        >
          {/* Header */}
          <div className="flex items-center justify-between w-full max-w-6xl mb-12">
            <h2 className="text-3xl font-light text-white tracking-tight">Spaces</h2>
            <button 
              onClick={() => setMissionControl(false)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition-colors border border-white/10"
            >
              Exit Mission Control
            </button>
          </div>

          {/* Spaces Grid */}
          <div className="flex flex-wrap justify-center gap-8 w-full max-w-6xl">
            {spaces.map((space) => (
              <motion.div
                key={space.id}
                layoutId={`space-${space.id}`}
                className={cn(
                  "group relative w-64 aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300",
                  activeSpaceId === space.id ? "border-blue-500 ring-4 ring-blue-500/20" : "border-white/10 hover:border-white/30"
                )}
                onClick={() => setActiveSpace(space.id)}
              >
                {/* Wallpaper Preview */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${space.wallpaper}')` }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                
                {/* Space Info */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-white font-medium text-sm">{space.name}</span>
                </div>

                {/* Remove Button */}
                {spaces.length > 1 && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeSpace(space.id); }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </motion.div>
            ))}

            {/* Add Space Button */}
            <button 
              onClick={() => addSpace(`Space ${spaces.length + 1}`, 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2564&auto=format&fit=crop')}
              className="w-64 aspect-video rounded-xl border-2 border-dashed border-white/10 hover:border-white/30 hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-3 text-white/40 hover:text-white/60"
            >
              <Plus className="w-8 h-8" />
              <span className="text-sm font-medium">Add Space</span>
            </button>
          </div>

          {/* Desktop Widgets Preview (Visual decoration) */}
          <div className="mt-20 w-full max-w-6xl h-48 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/10">
            <Layout className="w-12 h-12 mr-4" />
            <span className="text-xl font-light">Desktop Layouts & Widgets Overview</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

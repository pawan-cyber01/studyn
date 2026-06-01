"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useWidgetStore } from "@/store/useWidgetStore";
import { X, Image as ImageIcon, Upload } from "lucide-react";

export default function ImageWidget({ id }: { id: string }) {
  const { updateWidget, activeWidgets, removeWidget } = useWidgetStore();
  const widget = activeWidgets.find(w => w.id === id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [imageSrc, setImageSrc] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(`studyn-image-${id}`);
    }
    return null;
  });

  useEffect(() => {
    if (imageSrc) {
      localStorage.setItem(`studyn-image-${id}`, imageSrc);
    }
  }, [id, imageSrc]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImageSrc(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={{
        left: 0,
        right: typeof window !== "undefined" ? window.innerWidth - 200 : 0,
        top: 0,
        bottom: typeof window !== "undefined" ? window.innerHeight - 200 : 0,
      }}
      onDragEnd={(_, info) => {
        if (id) {
          updateWidget(id, { 
            x: (widget?.x || 0) + info.offset.x, 
            y: (widget?.y || 0) + info.offset.y 
          });
        }
      }}
      whileDrag={{ scale: 1.05, cursor: "grabbing" }}
      initial={{ x: widget?.x || 300, y: widget?.y || 300, opacity: 0 }}
      animate={{ x: widget?.x, y: widget?.y, opacity: 1 }}
      className="absolute cursor-grab select-none w-[200px] h-[200px] group"
    >
      {id && (
        <button 
          onClick={(e) => { e.stopPropagation(); removeWidget(id); }}
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-black/80 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:border-red-500 z-50 shadow-xl"
        >
          <X className="w-3.5 h-3.5 text-white" />
        </button>
      )}

      <div className="w-full h-full rounded-3xl overflow-hidden bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl relative flex items-center justify-center group/img">
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />
        
        {imageSrc ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageSrc} alt="Widget" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-white/20 rounded-full hover:bg-white/30 backdrop-blur-md transition-colors"
              >
                <Upload className="w-5 h-5 text-white" />
              </button>
            </div>
          </>
        ) : (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-2 hover:scale-110 transition-transform"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <ImageIcon className="w-5 h-5 text-white/40" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Add Image</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

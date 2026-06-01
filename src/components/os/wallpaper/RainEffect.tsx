"use client";

import { useEffect, useRef } from "react";
import { useWallpaperStore } from "@/store/useWallpaperStore";

export default function RainEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { settings } = useWallpaperStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let w: number, h: number;
    let drops: { x: number; y: number; l: number; v: number; w: number }[] = [];

    const init = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      drops = [];
      const count = Math.floor(w * 0.15 * settings.motionIntensity);
      for (let i = 0; i < count; i++) {
        drops.push({
          x: Math.random() * w,
          y: Math.random() * h,
          l: Math.random() * 20 + 10,
          v: Math.random() * 15 + 10 * settings.motionIntensity,
          w: Math.random() * 1.5 + 0.5
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(174, 194, 224, 0.3)";
      ctx.lineCap = "round";

      drops.forEach(d => {
        ctx.lineWidth = d.w;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.l);
        ctx.stroke();

        d.y += d.v;
        if (d.y > h) {
          d.y = -d.l;
          d.x = Math.random() * w;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", init);
    init();
    draw();

    return () => {
      window.removeEventListener("resize", init);
      cancelAnimationFrame(animationFrameId);
    };
  }, [settings.motionIntensity]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

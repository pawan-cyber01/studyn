"use client";

import { useEffect, useRef } from "react";
import { useWallpaperStore } from "@/store/useWallpaperStore";

export default function StarfieldEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { settings } = useWallpaperStore();
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let w: number, h: number;
    let stars: { x: number; y: number; z: number; o: number }[] = [];

    const init = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      stars = [];
      const count = Math.floor((w * h) / 4000 * settings.motionIntensity);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random() * w,
          o: Math.random() * 0.5 + 0.2
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const centerX = w / 2;
      const centerY = h / 2;
      
      // Gentle shift based on mouse
      const targetX = (mousePos.current.x - centerX) * 0.05 * settings.parallaxIntensity;
      const targetY = (mousePos.current.y - centerY) * 0.05 * settings.parallaxIntensity;

      stars.forEach(s => {
        s.z -= 2 * settings.motionIntensity;
        if (s.z <= 0) s.z = w;

        const k = 128 / s.z;
        const px = (s.x - centerX) * k + centerX + targetX;
        const py = (s.y - centerY) * k + centerY + targetY;

        if (px >= 0 && px <= w && py >= 0 && py <= h) {
          const size = (1 - s.z / w) * 3;
          ctx.fillStyle = `rgba(255, 255, 255, ${s.o * (1 - s.z / w)})`;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", init);
    window.addEventListener("mousemove", handleMouseMove);
    init();
    draw();

    return () => {
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [settings.motionIntensity, settings.parallaxIntensity]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

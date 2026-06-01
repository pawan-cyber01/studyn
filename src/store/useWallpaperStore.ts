import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WallpaperEffect = 'none' | 'rain' | 'stars' | 'particles' | 'aurora';

interface WallpaperSettings {
  dim: number; // 0 to 1
  blur: number; // 0 to 20
  grayscale: boolean;
  activeWallpaper: string;
  effect: WallpaperEffect;
  motionIntensity: number; // 0 to 1
  parallaxIntensity: number; // 0 to 1
}

interface WallpaperState {
  settings: WallpaperSettings;
  setDim: (val: number) => void;
  setBlur: (val: number) => void;
  setGrayscale: (val: boolean) => void;
  setWallpaper: (url: string) => void;
  setEffect: (effect: WallpaperEffect) => void;
  setMotionIntensity: (val: number) => void;
  setParallaxIntensity: (val: number) => void;
}

export const useWallpaperStore = create<WallpaperState>()(
  persist(
    (set) => ({
      settings: {
        dim: 0.4,
        blur: 0,
        grayscale: false,
        activeWallpaper: 'https://images.unsplash.com/photo-1464802686167-b939a67e06a1?auto=format&fit=crop&q=80&w=2000',
        effect: 'particles',
        motionIntensity: 0.5,
        parallaxIntensity: 0.5,
      },
      setDim: (dim) => set((state) => ({ settings: { ...state.settings, dim } })),
      setBlur: (blur) => set((state) => ({ settings: { ...state.settings, blur } })),
      setGrayscale: (grayscale) => set((state) => ({ settings: { ...state.settings, grayscale } })),
      setWallpaper: (activeWallpaper) => set((state) => ({ settings: { ...state.settings, activeWallpaper } })),
      setEffect: (effect) => set((state) => ({ settings: { ...state.settings, effect } })),
      setMotionIntensity: (motionIntensity) => set((state) => ({ settings: { ...state.settings, motionIntensity } })),
      setParallaxIntensity: (parallaxIntensity) => set((state) => ({ settings: { ...state.settings, parallaxIntensity } })),
    }),
    {
      name: 'studyn-wallpaper-v2',
    }
  )
);

"use client";

import { useEffect, useState } from "react";

export default function ThemeEngine() {
  const [timeState, setTimeState] = useState<'morning' | 'evening' | 'night' | 'late-night'>('morning');

  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      
      if (hour >= 5 && hour < 12) setTimeState('morning');
      else if (hour >= 12 && hour < 18) setTimeState('evening'); // Or 'afternoon', but user asked for 'evening' tones
      else if (hour >= 18 && hour < 22) setTimeState('night');
      else setTimeState('late-night');
    };

    updateTheme();
    const interval = setInterval(updateTheme, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    // Reset classes
    root.classList.remove('theme-morning', 'theme-evening', 'theme-night', 'theme-late-night');
    root.classList.add(`theme-${timeState}`);

    // Update CSS variables based on time
    if (timeState === 'morning') {
      root.style.setProperty('--accent-glow', 'rgba(255, 200, 100, 0.1)');
      root.style.setProperty('--wallpaper-dim', '0.2');
    } else if (timeState === 'evening') {
      root.style.setProperty('--accent-glow', 'rgba(255, 100, 50, 0.15)');
      root.style.setProperty('--wallpaper-dim', '0.4');
    } else if (timeState === 'night') {
      root.style.setProperty('--accent-glow', 'rgba(100, 150, 255, 0.1)');
      root.style.setProperty('--wallpaper-dim', '0.6');
    } else {
      root.style.setProperty('--accent-glow', 'rgba(255, 255, 255, 0.05)');
      root.style.setProperty('--wallpaper-dim', '0.8');
    }
  }, [timeState]);

  return null; // This component just manages global state
}

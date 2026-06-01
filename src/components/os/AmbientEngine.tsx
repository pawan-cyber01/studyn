"use client";

import { useEffect, useRef } from "react";
import { useFocusStore, AmbientSoundType } from "@/store/useFocusStore";

const SOUND_URLS: Record<AmbientSoundType, string | null> = {
  none: null,
  rain: "https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3", // Rain
  cafe: "https://assets.mixkit.co/active_storage/sfx/1070/1070-preview.mp3", // Cafe / Ambience
  thunder: "https://assets.mixkit.co/active_storage/sfx/2353/2353-preview.mp3", // Thunder
  "white-noise": "https://assets.mixkit.co/active_storage/sfx/2387/2387-preview.mp3", // Static/Noise
  keyboard: "https://assets.mixkit.co/active_storage/sfx/1066/1066-preview.mp3", // Typing
  lofi: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Placeholder for lofi
};

export default function AmbientEngine() {
  const { ambientSound, ambientVolume, isActive } = useFocusStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Cleanup existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const url = SOUND_URLS[ambientSound];
    if (!url) return;

    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = ambientVolume;
    audioRef.current = audio;

    if (isActive) {
      audio.play().catch(e => console.warn("Audio play blocked:", e));
    }

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [ambientSound, ambientVolume, isActive]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = ambientVolume;
    }
  }, [ambientVolume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isActive) {
        audioRef.current.play().catch(e => console.warn("Audio play blocked:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isActive, ambientSound]);

  return null;
}

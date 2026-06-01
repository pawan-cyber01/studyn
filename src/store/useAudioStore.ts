import { create } from 'zustand';

interface AudioState {
  isPlaying: boolean;
  intensity: number; // 0 to 1
  frequencies: number[]; // mock frequency data for bars
  currentTrack: {
    title: string;
    artist: string;
    albumArt?: string;
  } | null;

  setPlaying: (playing: boolean) => void;
  setIntensity: (intensity: number) => void;
  setTrack: (track: AudioState['currentTrack']) => void;
  updateFrequencies: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  isPlaying: false,
  intensity: 0,
  frequencies: Array(10).fill(0),
  currentTrack: null,

  setPlaying: (playing) => set({ isPlaying: playing }),
  setIntensity: (intensity) => set({ intensity }),
  setTrack: (track) => set({ currentTrack: track }),
  
  updateFrequencies: () => {
    if (!get().isPlaying) {
      set({ frequencies: Array(10).fill(0), intensity: 0 });
      return;
    }
    
    // Simulate frequency data
    const newFreqs = Array(10).fill(0).map(() => Math.random());
    const newIntensity = newFreqs.reduce((a, b) => a + b, 0) / 10;
    set({ frequencies: newFreqs, intensity: newIntensity });
  }
}));

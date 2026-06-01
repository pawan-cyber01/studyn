import { create } from 'zustand';

interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  response: string;
  amplitude: number[];
  
  // Actions
  setListening: (val: boolean) => void;
  setSpeaking: (val: boolean) => void;
  setTranscript: (val: string) => void;
  setResponse: (val: string) => void;
  updateAmplitude: () => void;
}

export const useVoiceStore = create<VoiceState>((set) => ({
  isListening: false,
  isSpeaking: false,
  transcript: "",
  response: "",
  amplitude: Array.from({ length: 20 }).map(() => 5),

  setListening: (val) => set({ isListening: val }),
  setSpeaking: (val) => set({ isSpeaking: val }),
  setTranscript: (val) => set({ transcript: val }),
  setResponse: (val) => set({ response: val }),
  updateAmplitude: () => set((state) => ({
    amplitude: state.amplitude.map(() => Math.random() * 50 + 5)
  }))
}));

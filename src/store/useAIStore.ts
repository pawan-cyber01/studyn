import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AIProvider = 'groq' | 'gemini' | 'openrouter';

interface AIState {
  provider: AIProvider;
  model: string;
  apiKeys: Record<AIProvider, string>;
  
  setProvider: (provider: AIProvider) => void;
  setModel: (model: string) => void;
  setApiKey: (provider: AIProvider, key: string) => void;
}

export const useAIStore = create<AIState>()(
  persist(
    (set) => ({
      provider: 'groq',
      model: 'llama-3.1-70b-versatile',
      apiKeys: {
        groq: '',
        gemini: '',
        openrouter: '',
      },

      setProvider: (provider) => set({ provider }),
      setModel: (model) => set({ model }),
      setApiKey: (provider, key) => set((state) => ({
        apiKeys: { ...state.apiKeys, [provider]: key }
      })),
    }),
    {
      name: 'studyn-ai-settings',
    }
  )
);

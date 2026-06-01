import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useLeaderboardStore } from './useLeaderboardStore';

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: Date | null;
  icon: string;
}

interface GamificationState {
  xp: number;
  level: number;
  coins: number;
  hearts: number;
  streak: number;
  lastActiveDate: string | null;
  lastSpinDate: string | null;
  achievements: Achievement[];
  
  // Actions
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  useHeart: () => void;
  restoreHearts: (amount: number) => void;
  updateStreak: () => void;
  unlockAchievement: (id: string) => void;
  recordSpin: () => void;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      coins: 100,
      hearts: 5,
      streak: 0,
      lastActiveDate: null,
      lastSpinDate: null,
      achievements: [
        { id: 'first_step', title: 'First Step', description: 'Complete your first study session', unlockedAt: null, icon: '🎓' },
        { id: 'focus_master', title: 'Focus Master', description: 'Complete 10 focus sessions', unlockedAt: null, icon: '🔥' },
        { id: 'ai_wizard', title: 'AI Wizard', description: 'Ask Studyn AI 50 questions', unlockedAt: null, icon: '🧙‍♂️' },
      ],

      addXP: (amount: number) => {
        const { xp, level } = get();
        const newXP = xp + amount;
        const xpForNextLevel = level * 1000;
        
        let finalXP = newXP;
        let finalLevel = level;

        if (newXP >= xpForNextLevel) {
          finalXP = newXP - xpForNextLevel;
          finalLevel = level + 1;
        }

        set({ xp: finalXP, level: finalLevel });
        useLeaderboardStore.getState().updateUserStats(finalXP, finalLevel);
      },

      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      
      useHeart: () => set((state) => ({ hearts: Math.max(0, state.hearts - 1) })),
      
      restoreHearts: (amount) => set((state) => ({ hearts: Math.min(5, state.hearts + amount) })),

      updateStreak: () => {
        const today = new Date().toDateString();
        const { lastActiveDate, streak } = get();
        
        if (lastActiveDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActiveDate === yesterday.toDateString()) {
          set({ streak: streak + 1, lastActiveDate: today });
        } else {
          set({ streak: 1, lastActiveDate: today });
        }
      },

      unlockAchievement: (id) => set((state) => ({
        achievements: state.achievements.map(a => 
          a.id === id ? { ...a, unlockedAt: new Date() } : a
        )
      })),

      recordSpin: () => set({ lastSpinDate: new Date().toDateString() }),
    }),
    {
      name: 'studyn-gamification-v2',
    }
  )
);

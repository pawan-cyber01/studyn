import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LeaderboardEntry {
  id: string;
  userId: string;
  userName: string;
  userPfp: string;
  score: number;
  level?: number; // Added for global stats
  type: 'typing' | 'quiz' | 'math' | 'global';
  timestamp: number;
}

interface LeaderboardState {
  entries: LeaderboardEntry[];
  
  // Actions
  addEntry: (entry: Omit<LeaderboardEntry, 'id'>) => void;
  updateUserStats: (xp: number, level: number) => void;
  getTopEntries: (type: LeaderboardEntry['type'], limit?: number) => LeaderboardEntry[];
}

export const useLeaderboardStore = create<LeaderboardState>()(
  persist(
    (set, get) => ({
      entries: [
        { id: '1', userId: 'u1', userName: 'Cipher', userPfp: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cipher', score: 92, type: 'typing', timestamp: Date.now() },
        { id: '2', userId: 'u2', userName: 'Nova', userPfp: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nova', score: 88, type: 'typing', timestamp: Date.now() },
        { id: '3', userId: 'u3', userName: 'Flux', userPfp: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Flux', score: 76, type: 'typing', timestamp: Date.now() },
        { id: '4', userId: 'u1', userName: 'Cipher', userPfp: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cipher', score: 2500, level: 3, type: 'global', timestamp: Date.now() },
      ],

      addEntry: (entry) => {
        const newEntry: LeaderboardEntry = {
          ...entry,
          id: Math.random().toString(36).substring(7),
        };
        set((state) => ({
          entries: [newEntry, ...state.entries].sort((a, b) => b.score - a.score)
        }));
      },

      updateUserStats: (xp, level) => {
        // Find existing global entry for this user and update it, or add new
        // In a real app, we'd use the current user's ID
        const currentEntries = get().entries;
        const globalIndex = currentEntries.findIndex(e => e.type === 'global' && (e.userName === 'You' || e.userId === 'anonymous'));
        
        if (globalIndex !== -1) {
          const updatedEntries = [...currentEntries];
          updatedEntries[globalIndex] = {
            ...updatedEntries[globalIndex],
            score: xp,
            level: level,
            timestamp: Date.now()
          };
          set({ entries: updatedEntries });
        } else {
          get().addEntry({
            userId: 'anonymous',
            userName: 'You',
            userPfp: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
            score: xp,
            level: level,
            type: 'global',
            timestamp: Date.now()
          });
        }
      },

      getTopEntries: (type, limit = 5) => {
        return get().entries
          .filter(e => e.type === type)
          .sort((a, b) => b.score - a.score)
          .slice(0, limit);
      }
    }),
    {
      name: 'studyn-leaderboard-v3',
    }
  )
);

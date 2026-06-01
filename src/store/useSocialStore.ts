import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Friend {
  id: string;
  studynId: string;
  name: string;
  status: 'online' | 'offline' | 'away';
  pfp: string;
}

interface SocialState {
  friends: Friend[];
  pendingRequests: Friend[];
  
  // Actions
  setFriends: (friends: Friend[]) => void;
  addFriend: (friend: Friend) => void;
  removeFriend: (id: string) => void;
  acceptRequest: (id: string) => void;
}

export const useSocialStore = create<SocialState>()(
  persist(
    (set) => ({
      friends: [],
      pendingRequests: [],

      setFriends: (friends) => set({ friends }),
      
      addFriend: (friend) => set((state) => ({
        friends: [...state.friends.filter(f => f.id !== friend.id), friend]
      })),

      removeFriend: (id) => set((state) => ({
        friends: state.friends.filter(f => f.id !== id)
      })),

      acceptRequest: (id) => set((state) => ({
        friends: [...state.friends, ...state.pendingRequests.filter(r => r.id === id).map(r => ({ ...r, status: 'online' as const }))],
        pendingRequests: state.pendingRequests.filter(r => r.id !== id)
      })),
    }),
    {
      name: 'studyn-social-v2',
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  name: string;
  username: string;
  pfp: string;
  bio: string;
  studyGoals: string[];
  interests: string[];
  studynId?: string;
}

interface UserState {
  profile: UserProfile;
  isProfileCardOpen: boolean;
  
  // Actions
  updateProfile: (profile: Partial<UserProfile>) => void;
  setProfileCardOpen: (open: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: {
        name: 'Alex Studyn',
        username: 'alex_s',
        pfp: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        bio: 'Future Space Engineer | Deep Work Enthusiast',
        studyGoals: ['Master Mathematics', 'Build an OS'],
        interests: ['Aerospace', 'AI', 'Piano'],
        studynId: `P${Math.floor(10000 + Math.random() * 90000)}`,
      },
      isProfileCardOpen: false,

      updateProfile: (updates) => set((state) => ({
        profile: { ...state.profile, ...updates }
      })),

      setProfileCardOpen: (open) => set({ isProfileCardOpen: open }),
    }),
    {
      name: 'studyn-user-profile',
    }
  )
);

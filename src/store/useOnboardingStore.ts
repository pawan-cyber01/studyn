import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OnboardingProfile {
  name: string;
  institution: 'school' | 'college' | '';
  class: string;
  stream: string;
  subjects: string[];
  weakSubjects: string[];
  language: string;
  goals: string[];
  dailyHours: number;
  dreamCareer: string;
}

interface OnboardingState {
  isCompleted: boolean;
  currentStep: number;
  profile: OnboardingProfile;

  // Actions
  completeOnboarding: () => void;
  setStep: (step: number) => void;
  updateProfile: (data: Partial<OnboardingProfile>) => void;
  resetOnboarding: () => void;
}

const defaultProfile: OnboardingProfile = {
  name: '',
  institution: '',
  class: '',
  stream: '',
  subjects: [],
  weakSubjects: [],
  language: 'English',
  goals: [],
  dailyHours: 4,
  dreamCareer: '',
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      isCompleted: false,
      currentStep: 0,
      profile: defaultProfile,

      completeOnboarding: () => set({ isCompleted: true }),
      setStep: (step) => set({ currentStep: step }),
      updateProfile: (data) =>
        set((state) => ({ profile: { ...state.profile, ...data } })),
      resetOnboarding: () =>
        set({ isCompleted: false, currentStep: 0, profile: defaultProfile }),
    }),
    { name: 'studyn-onboarding' }
  )
);

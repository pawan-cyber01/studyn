import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StudySession {
  id: string;
  timestamp: string;
  duration: number; // minutes
  ambience: string;
  type: 'work' | 'break';
  hourOfDay: number;
}

export interface QuizResult {
  id: string;
  subject: string;
  score: number;
  total: number;
  timestamp: string;
}

interface DNAState {
  sessions: StudySession[];
  quizzes: QuizResult[];
  insights: string[];
  personalityTags: string[]; // e.g., "Night Owl", "Rain Lover", "Sprint Master"
  lastAnalysisDate: string | null;
  
  // Actions
  logSession: (session: Omit<StudySession, 'id'>) => void;
  logQuiz: (quiz: Omit<QuizResult, 'id'>) => void;
  setInsights: (insights: string[], tags: string[]) => void;
  clearHistory: () => void;
}

export const useDNAStore = create<DNAState>()(
  persist(
    (set) => ({
      sessions: [],
      quizzes: [],
      insights: [
        "Your DNA profile is currently being synthesized. Start a few study sessions to begin.",
      ],
      personalityTags: [],
      lastAnalysisDate: null,

      logSession: (session) => set((state) => ({
        sessions: [...state.sessions, { ...session, id: Math.random().toString(36).substr(2, 9) }].slice(-100) // Keep last 100
      })),

      logQuiz: (quiz) => set((state) => ({
        quizzes: [...state.quizzes, { ...quiz, id: Math.random().toString(36).substr(2, 9) }].slice(-50)
      })),

      setInsights: (insights, tags) => set({ 
        insights, 
        personalityTags: tags,
        lastAnalysisDate: new Date().toISOString() 
      }),

      clearHistory: () => set({ sessions: [], quizzes: [], insights: [], personalityTags: [] }),
    }),
    {
      name: 'studyn-dna-engine',
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FeedPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'study' | 'quiz' | 'milestone';
  content: string;
  timestamp: number;
  likes: number;
  hasLiked: boolean;
  activity?: {
    type: string;
    duration?: string;
    score?: number;
  };
}

interface FeedState {
  posts: FeedPost[];
  
  // Actions
  addPost: (post: Omit<FeedPost, 'id' | 'timestamp' | 'likes' | 'hasLiked'>) => void;
  likePost: (id: string) => void;
  refreshFeed: () => void;
}

export const useFeedStore = create<FeedState>()(
  persist(
    (set, get) => ({
      posts: [
        {
          id: '1',
          userId: 'u1',
          userName: 'Alex Rivera',
          userAvatar: 'https://i.pravatar.cc/150?u=1',
          type: 'study',
          content: "Just finished a 2-hour deep work session on Organic Chemistry. The AI study plan was a lifesaver!",
          timestamp: Date.now() - 3600000,
          likes: 24,
          hasLiked: false,
          activity: { type: 'Focus Session', duration: '2h 15m' }
        },
        {
          id: '2',
          userId: 'u2',
          userName: 'Sarah Chen',
          userAvatar: 'https://i.pravatar.cc/150?u=2',
          type: 'quiz',
          content: "Absolute victory in the AI Arena! Level 15 reached.",
          timestamp: Date.now() - 7200000,
          likes: 42,
          hasLiked: true,
          activity: { type: 'Quiz Battle', score: 2450 }
        }
      ],

      addPost: (post) => set((state) => ({
        posts: [
          { 
            ...post, 
            id: Math.random().toString(36).substr(2, 9), 
            timestamp: Date.now(),
            likes: 0,
            hasLiked: false
          },
          ...state.posts
        ]
      })),

      likePost: (id) => set((state) => ({
        posts: state.posts.map(p => p.id === id ? {
          ...p,
          likes: p.hasLiked ? p.likes - 1 : p.likes + 1,
          hasLiked: !p.hasLiked
        } : p)
      })),

      refreshFeed: () => {
        // Mock refresh
      }
    }),
    {
      name: 'studyn-feed',
    }
  )
);

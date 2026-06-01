import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BrowserTab {
  id: string;
  url: string;
  title: string;
  favIcon?: string;
  loading?: boolean;
}

interface BrowserState {
  tabs: BrowserTab[];
  activeTabId: string;
  isSplitScreen: boolean;
  history: string[];
  
  // Actions
  addTab: (url?: string) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<BrowserTab>) => void;
  setSplitScreen: (enabled: boolean) => void;
  addToHistory: (url: string) => void;
}

export const useBrowserStore = create<BrowserState>()(
  persist(
    (set) => ({
      tabs: [
        { id: 'default', url: 'https://www.google.com/search?igu=1', title: 'Google' }
      ],
      activeTabId: 'default',
      isSplitScreen: false,
      history: [],

      addTab: (url = 'https://www.google.com/search?igu=1') => set((state) => {
        const id = Math.random().toString(36).substring(7);
        const newTab = { id, url, title: 'New Tab' };
        return {
          tabs: [...state.tabs, newTab],
          activeTabId: id
        };
      }),

      closeTab: (id) => set((state) => {
        if (state.tabs.length <= 1) return state;
        const newTabs = state.tabs.filter(t => t.id !== id);
        return {
          tabs: newTabs,
          activeTabId: state.activeTabId === id ? newTabs[0].id : state.activeTabId
        };
      }),

      setActiveTab: (id) => set({ activeTabId: id }),

      updateTab: (id, updates) => set((state) => ({
        tabs: state.tabs.map(t => t.id === id ? { ...t, ...updates } : t)
      })),

      setSplitScreen: (enabled) => set({ isSplitScreen: enabled }),

      addToHistory: (url) => set((state) => ({
        history: [url, ...state.history.slice(0, 49)]
      })),
    }),
    {
      name: 'studyn-browser-storage',
    }
  )
);

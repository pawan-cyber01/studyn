import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WidgetType = 'clock' | 'focus' | 'notes' | 'stopwatch' | 'timer' | 'social' | 'ai' | 'analytics' | 'quote' | 'cgpa' | 'attendance' | 'dailyspin' | 'studydna' | 'todo' | 'reminder' | 'motivation' | 'image';

export interface WidgetInstance {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  w: number;
  h: number;
  isPinned: boolean;
  data?: unknown;
}

interface WidgetStore {
  activeWidgets: WidgetInstance[];
  isPickerOpen: boolean;
  
  // Actions
  addWidget: (type: WidgetType, x?: number, y?: number) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<WidgetInstance>) => void;
  setPickerOpen: (open: boolean) => void;
  clearWidgets: () => void;
}

export const useWidgetStore = create<WidgetStore>()(
  persist(
    (set) => ({
      activeWidgets: [
        { id: 'initial-clock', type: 'clock', x: 40, y: 40, w: 300, h: 200, isPinned: false },
        { id: 'initial-focus', type: 'focus', x: 40, y: 260, w: 300, h: 320, isPinned: false },
      ],
      isPickerOpen: false,

      addWidget: (type, x = 100, y = 100) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newWidget: WidgetInstance = {
          id,
          type,
          x,
          y,
          w: 300,
          h: type === 'notes' ? 400 : 300,
          isPinned: false,
        };
        set((state) => ({ activeWidgets: [...state.activeWidgets, newWidget] }));
      },

      removeWidget: (id) => set((state) => ({
        activeWidgets: state.activeWidgets.filter(w => w.id !== id)
      })),

      updateWidget: (id, updates) => set((state) => ({
        activeWidgets: state.activeWidgets.map(w => w.id === id ? { ...w, ...updates } : w)
      })),

      setPickerOpen: (open) => set({ isPickerOpen: open }),
      
      clearWidgets: () => set({ activeWidgets: [] }),
    }),
    {
      name: 'studyn-widgets',
    }
  )
);

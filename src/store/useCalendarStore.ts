import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  title: string;
  location: string;
  type: 'academic' | 'social' | 'focus' | 'other';
  completed: boolean;
}

interface CalendarStore {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id' | 'completed'>) => void;
  deleteEvent: (id: string) => void;
  toggleEvent: (id: string) => void;
}

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set) => ({
      events: [],
      addEvent: (event) => set((state) => ({
        events: [...state.events, { ...event, id: Date.now().toString(), completed: false }]
      })),
      deleteEvent: (id) => set((state) => ({
        events: state.events.filter(e => e.id !== id)
      })),
      toggleEvent: (id) => set((state) => ({
        events: state.events.map(e => e.id === id ? { ...e, completed: !e.completed } : e)
      }))
    }),
    {
      name: 'studyn-calendar-events',
    }
  )
);

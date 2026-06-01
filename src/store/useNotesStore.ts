import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  updatedAt: number;
}

interface NotesState {
  notes: Note[];
  activeNoteId: string | null;
  
  // Actions
  addNote: (title?: string, content?: string, category?: string) => string;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  setActiveNoteId: (id: string | null) => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      notes: [],
      activeNoteId: null,

      addNote: (title = "Untitled Note", content = "", category = "general") => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNote: Note = {
          id,
          title,
          content,
          category,
          updatedAt: Date.now(),
        };
        set((state) => ({ 
          notes: [newNote, ...state.notes],
          activeNoteId: id 
        }));
        return id;
      },

      updateNote: (id, content) => set((state) => ({
        notes: state.notes.map(n => {
          if (n.id === id) {
            const title = content.split('\n')[0].replace(/[#*]/g, '').trim() || "Untitled Note";
            return { ...n, content, title, updatedAt: Date.now() };
          }
          return n;
        })
      })),

      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter(n => n.id !== id),
        activeNoteId: state.activeNoteId === id ? (state.notes.length > 1 ? state.notes[0].id : null) : state.activeNoteId
      })),

      setActiveNoteId: (id) => set({ activeNoteId: id }),
    }),
    {
      name: 'studyn-notes',
    }
  )
);

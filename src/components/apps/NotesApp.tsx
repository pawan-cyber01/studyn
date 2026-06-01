"use client";

import { useState } from "react";
import { FileText, Plus, Trash2, Save, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotesStore } from "@/store/useNotesStore";

import { motion } from "framer-motion";

export default function NotesApp() {
  const { notes, activeNoteId, addNote, updateNote, deleteNote, setActiveNoteId } = useNotesStore();
  const [search, setSearch] = useState("");

  const activeNote = notes.find(n => n.id === activeNoteId);

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex h-full text-white/90 bg-black"
    >
      {/* Sidebar */}
      <div className="w-64 border-r border-white/5 bg-white/[0.01] flex flex-col">
        <div className="p-4 space-y-4">
          <button 
            onClick={() => addNote()}
            className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Note
          </button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-white/10 transition-colors placeholder:text-white/10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {filteredNotes.map(note => (
            <div 
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={cn(
                "group p-3 rounded-xl cursor-pointer transition-all duration-300",
                activeNoteId === note.id ? "bg-white/5 border border-white/5" : "hover:bg-white/[0.02]"
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className={cn(
                  "text-[13px] font-bold truncate flex-1",
                  activeNoteId === note.id ? "text-white" : "text-white/40"
                )}>
                  {note.title}
                </span>
                <Trash2 
                  onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                  className="w-3.5 h-3.5 text-white/0 group-hover:text-white/20 hover:text-red-400/60 transition-all" 
                />
              </div>
              <div className="text-[10px] text-white/20 truncate">
                {new Date(note.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col bg-white/[0.01]">
        {activeNote ? (
          <>
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-white/20" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white/40">{activeNote.title}</span>
              </div>
              <div className="flex items-center gap-4 text-white/20">
                <span className="text-[10px] uppercase tracking-widest">Auto-saved</span>
                <Save className="w-4 h-4" />
              </div>
            </div>
            <textarea
              value={activeNote.content}
              onChange={(e) => updateNote(activeNote.id, e.target.value)}
              placeholder="Start writing... (Supports Markdown style)"
              className="flex-1 w-full bg-transparent p-8 text-[15px] leading-relaxed focus:outline-none resize-none placeholder:text-white/5 scroll-smooth"
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/10 space-y-4">
            <FileText className="w-16 h-16 opacity-5" />
            <p className="text-xs font-black uppercase tracking-[0.2em]">Select or create a note</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

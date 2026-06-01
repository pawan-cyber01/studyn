"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, Circle, X, ListTodo } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWidgetStore } from "@/store/useWidgetStore";
import { cn } from "@/lib/utils";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoWidgetProps {
  id: string;
}

export default function TodoWidget({ id }: TodoWidgetProps) {
  const { updateWidget, activeWidgets, removeWidget } = useWidgetStore();
  const widget = activeWidgets.find(w => w.id === id);
  
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`studyn-todo-${id}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    localStorage.setItem(`studyn-todo-${id}`, JSON.stringify(todos));
  }, [id, todos]);

  const addTodo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTodo.trim()) return;
    
    setTodos([{ id: Date.now().toString(), text: newTodo.trim(), completed: false }, ...todos]);
    setNewTodo("");
  };

  const toggleTodo = (todoId: string) => {
    setTodos(todos.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (todoId: string) => {
    setTodos(todos.filter(t => t.id !== todoId));
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={{
        left: 20,
        right: typeof window !== "undefined" ? window.innerWidth - 320 : 0,
        top: 20,
        bottom: typeof window !== "undefined" ? window.innerHeight - 450 : 0,
      }}
      onDragEnd={(_, info) => {
        if (id) {
          updateWidget(id, { 
            x: (widget?.x || 0) + info.offset.x, 
            y: (widget?.y || 0) + info.offset.y 
          });
        }
      }}
      whileDrag={{ scale: 1.02, cursor: "grabbing" }}
      initial={{ x: widget?.x || 400, y: widget?.y || 100, opacity: 0 }}
      animate={{ x: widget?.x, y: widget?.y, opacity: 1 }}
      className="absolute cursor-grab select-none w-[300px] h-[400px] group"
    >
      {/* Close Button */}
      {id && (
        <button 
          onClick={(e) => { e.stopPropagation(); removeWidget(id); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:border-red-500 z-50"
        >
          <X className="w-3.5 h-3.5 text-white" />
        </button>
      )}

      <div className="glass-panel rounded-[2.5rem] p-6 shadow-2xl bg-white/[0.01] backdrop-blur-[40px] flex flex-col h-full hover:border-white/10 transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <ListTodo className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Tasks</span>
        </div>

        <form onSubmit={addTodo} className="relative mb-4">
          <input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add new task..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-white/20 transition-colors placeholder:text-white/20 text-white"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 text-white/60 hover:text-white" />
          </button>
        </form>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          <AnimatePresence initial={false}>
            {todos.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8 text-[10px] font-black uppercase tracking-widest text-white/10"
              >
                No tasks yet
              </motion.div>
            )}
            
            {todos.map(todo => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all group/item",
                  todo.completed ? "bg-white/[0.02] border-transparent" : "bg-white/[0.04] border-white/5 hover:border-white/10"
                )}
              >
                <button 
                  onClick={() => toggleTodo(todo.id)}
                  className="flex-shrink-0"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-white/20 group-hover/item:text-white/40" />
                  )}
                </button>
                
                <span className={cn(
                  "flex-1 text-sm transition-colors cursor-pointer",
                  todo.completed ? "text-white/20 line-through" : "text-white/80"
                )} onClick={() => toggleTodo(todo.id)}>
                  {todo.text}
                </span>

                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className="p-1.5 opacity-0 group-hover/item:opacity-100 hover:bg-red-500/20 rounded-lg transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

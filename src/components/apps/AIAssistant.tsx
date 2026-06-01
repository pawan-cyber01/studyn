"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2, Brain, Zap, History } from "lucide-react";
import { chat } from "@/lib/ai";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboardingStore } from "@/store/useOnboardingStore";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const { profile } = useOnboardingStore();
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: `Hello, ${profile.name || 'Scholar'}! I'm your Studyn AI Assistant. How can I help you excel today? We can generate roadmaps, summarize notes, or practice for exams.`, 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const systemPrompt = `You are Studyn AI, a premium student operating system assistant.
The user is ${profile.name || 'a student'}${profile.stream ? ` studying ${profile.stream}` : ''}.
Goals: ${profile.goals.join(', ') || 'None specified'}.
Weak Subjects: ${profile.weakSubjects.join(', ') || 'None specified'}.
Be concise, helpful, and academic yet futuristic in tone. Tailor your advice and examples to their profile.`;

      const response = await chat(input, systemPrompt);
      const aiMessage: Message = { role: 'assistant', content: response, timestamp: new Date() };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: unknown) {
      const errorMessage: Message = { 
        role: 'assistant', 
        content: `Error: ${error instanceof Error ? error.message : 'Something went wrong. Please check your API settings.'}`, 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex h-full bg-black text-white overflow-hidden"
    >
      {/* Sidebar */}
      <div className="w-64 border-r border-white/5 bg-white/[0.01] p-4 flex flex-col">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <span className="font-semibold tracking-tight">Studyn AI</span>
        </div>

        <div className="space-y-1 flex-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3 px-2">Quick Actions</div>
          <button onClick={() => setInput("Generate a roadmap for my studies")} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-white/60 transition-colors">
            <Brain className="w-4 h-4 text-purple-400" /> Generate Roadmap
          </button>
          {profile.weakSubjects.length > 0 && (
            <button onClick={() => setInput(`Help me improve in ${profile.weakSubjects[0]}`)} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-white/60 transition-colors">
              <Zap className="w-4 h-4 text-orange-400" /> Improve Weak Subjects
            </button>
          )}
          <button onClick={() => setInput("Summarize my current topic")} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-white/60 transition-colors">
            <Zap className="w-4 h-4 text-yellow-400" /> Quick Summary
          </button>
          <button onClick={() => setInput("Give me a quick quiz")} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-white/60 transition-colors">
            <History className="w-4 h-4 text-blue-400" /> Exam Revision
          </button>
        </div>

        <div className="p-2 mt-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-[10px] text-white/40 leading-relaxed text-center">
            Ask me to create a timetable or explain complex topics.
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                key={i}
                className={cn(
                  "flex gap-4 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                  msg.role === 'assistant' ? "bg-blue-500/10 border-blue-500/20" : "bg-white/10 border-white/20"
                )}>
                  {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-blue-400" /> : <User className="w-4 h-4" />}
                </div>
                <div className={cn(
                  "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'assistant' ? "bg-white/[0.03] text-white/90" : "bg-blue-600 text-white"
                )}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex gap-4 max-w-[85%] animate-pulse">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white/[0.03] text-white/40 text-sm">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-gradient-to-t from-black/40 to-transparent">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500/5 blur-xl group-focus-within:bg-blue-500/10 transition-colors" />
            <div className="relative flex items-center gap-2 p-1.5 bg-white/[0.03] border border-white/10 rounded-2xl focus-within:border-blue-500/50 transition-all">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message Studyn AI..."
                className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm placeholder:text-white/20"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 flex items-center justify-center transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

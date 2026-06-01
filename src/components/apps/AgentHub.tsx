"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, Terminal, Zap, Activity, Shield, Loader2 } from "lucide-react";
import { useAgentStore } from "@/store/useAgentStore";
import { agentTools } from "@/lib/agentTools";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function AgentHub() {
  const [input, setInput] = useState("");
  const { tasks, addTask, addLog, updateTaskStatus, isAgentRunning } = useAgentStore();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(tasks[0]?.id || null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeTask = tasks.find(t => t.id === activeTaskId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeTask?.logs]);

  const runAgentOrchestrator = async (taskId: string, prompt: string) => {
    updateTaskStatus(taskId, 'running', 10);
    addLog(taskId, { type: 'thought', content: `Objective received: "${prompt}"` });
    
    await new Promise(r => setTimeout(r, 1000));
    addLog(taskId, { type: 'thought', content: "Determining required toolset for autonomous execution..." });
    
    // Tool Call 1: Research
    addLog(taskId, { type: 'action', content: `Executing tool: web_search("${prompt}")` });
    const searchResult = await agentTools.web_search(prompt);
    addLog(taskId, { type: 'result', content: searchResult });
    updateTaskStatus(taskId, 'running', 40);

    // Tool Call 2: Notes
    await new Promise(r => setTimeout(r, 1500));
    addLog(taskId, { type: 'thought', content: "Research phase complete. Synthesizing data into workspace..." });
    addLog(taskId, { type: 'action', content: `Executing tool: create_note("AI Research: ${prompt}", "Research Summary: ${searchResult}")` });
    const noteResult = agentTools.create_note(`AI Research: ${prompt}`, searchResult);
    addLog(taskId, { type: 'result', content: noteResult });
    updateTaskStatus(taskId, 'running', 70);

    // Tool Call 3: Focus (Optional logic)
    if (prompt.toLowerCase().includes("study") || prompt.toLowerCase().includes("focus")) {
      await new Promise(r => setTimeout(r, 1000));
      addLog(taskId, { type: 'action', content: "Executing tool: start_focus_session(25)" });
      const focusResult = agentTools.start_focus_session(25);
      addLog(taskId, { type: 'result', content: focusResult });
    }

    await new Promise(r => setTimeout(r, 1000));
    addLog(taskId, { type: 'result', content: "Workflow complete. All artifacts synchronized to local OS." });
    updateTaskStatus(taskId, 'completed', 100);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const id = addTask(input);
    setActiveTaskId(id);
    runAgentOrchestrator(id, input);
    setInput("");
  };

  return (
    <div className="flex h-full bg-black/40 text-white/90">
      {/* Task Sidebar */}
      <div className="w-80 border-r border-white/5 bg-white/[0.01] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-white/20" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Tool Orchestrator</span>
           </div>
           {isAgentRunning && <Activity className="w-4 h-4 text-white/60 animate-pulse" />}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {tasks.map(task => (
            <button 
              key={task.id}
              onClick={() => setActiveTaskId(task.id)}
              className={cn(
                "w-full text-left p-4 rounded-2xl border transition-all duration-500",
                activeTaskId === task.id ? "bg-white/5 border-white/10 shadow-xl" : "bg-transparent border-transparent hover:bg-white/[0.02]"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                 <div className="text-[11px] font-bold truncate max-w-[150px]">{task.title}</div>
                 <div className={cn(
                   "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                   task.status === 'completed' ? "bg-white/10 text-white/60" : "bg-white/5 text-white/20"
                 )}>
                   {task.status}
                 </div>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                   animate={{ width: `${task.progress}%` }}
                   className="h-full bg-white/40" 
                 />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Execution Console */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-white/[0.01]">
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-white/40" />
             </div>
             <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Agent Terminal</h2>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-4 font-mono scroll-smooth"
        >
          {!activeTask ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4">
               <Bot className="w-16 h-16" />
               <p className="text-xs uppercase tracking-[0.4em] font-black">Assigning Directive...</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {activeTask.logs.map((log) => (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-4 items-start group"
                >
                  <span className="text-white/10 text-[10px] mt-1">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  <div className={cn(
                    "flex-1 text-[13px] leading-relaxed",
                    log.type === 'thought' ? "text-white/40 italic" :
                    log.type === 'action' ? "text-indigo-400 font-bold" :
                    log.type === 'result' ? "text-emerald-400/80" : "text-red-400"
                  )}>
                    <span className="mr-2 opacity-20">[{log.type.charAt(0).toUpperCase()}]</span>
                    {log.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          {activeTask?.status === 'running' && (
            <div className="flex gap-4 items-center animate-pulse">
               <span className="text-white/10 text-[10px]">...</span>
               <div className="text-[13px] text-white/40 font-bold flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Agent executing tools
               </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-white/[0.01] border-t border-white/5">
          <div className="relative group max-w-4xl mx-auto">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Assign a real-world tool execution task..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] pl-8 pr-32 py-5 text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-white/10"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
               <button 
                onClick={handleSend}
                className="w-24 aspect-5-3 btn-premium flex items-center justify-center"
               >
                 <Zap className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

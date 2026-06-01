import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AgentLog {
  id: string;
  type: 'thought' | 'action' | 'result' | 'error';
  content: string;
  timestamp: number;
}

export interface AgentTask {
  id: string;
  title: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  logs: AgentLog[];
  progress: number;
}

interface AgentState {
  tasks: AgentTask[];
  isAgentRunning: boolean;
  
  // Actions
  addTask: (title: string) => string;
  addLog: (taskId: string, log: Omit<AgentLog, 'id' | 'timestamp'>) => void;
  updateTaskStatus: (taskId: string, status: AgentTask['status'], progress?: number) => void;
  clearTasks: () => void;
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set, get) => ({
      tasks: [],
      isAgentRunning: false,

      addTask: (title) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newTask: AgentTask = {
          id,
          title,
          status: 'idle',
          logs: [],
          progress: 0,
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
        return id;
      },

      addLog: (taskId, log) => set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? {
          ...t,
          logs: [...t.logs, { ...log, id: Math.random().toString(36).substr(2, 9), timestamp: Date.now() }]
        } : t)
      })),

      updateTaskStatus: (taskId, status, progress) => set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? {
          ...t,
          status,
          progress: progress ?? t.progress
        } : t),
        isAgentRunning: status === 'running'
      })),

      clearTasks: () => set({ tasks: [] }),
    }),
    {
      name: 'studyn-agent',
    }
  )
);

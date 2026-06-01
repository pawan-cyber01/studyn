"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useGamificationStore } from "@/store/useGamificationStore";
import { useFocusStore } from "@/store/useFocusStore";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { 
  TrendingUp, Target, CheckSquare, Calendar,
  Flame, Star, Zap, Plus, Trash2, Check, Clock,
  GraduationCap, BarChart2, Award, Brain
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Todo {
  id: string;
  text: string;
  done: boolean;
  priority: 'low' | 'medium' | 'high';
  subject: string;
}

interface AttendanceRecord {
  subject: string;
  total: number;
  attended: number;
}

export default function DashboardApp() {
  const { xp, level, streak, coins, hearts, achievements } = useGamificationStore();
  const { sessionsCompleted, totalFocusTime } = useFocusStore();
  const { profile } = useOnboardingStore();

  const [activeTab, setActiveTab] = useState<'home' | 'tasks' | 'attendance' | 'cgpa' | 'analytics'>('home');
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Complete Data Structures assignment', done: false, priority: 'high', subject: 'DSA' },
    { id: '2', text: 'Revise Chapter 5 – Networking', done: false, priority: 'medium', subject: 'Networks' },
    { id: '3', text: 'Practice 10 coding problems', done: true, priority: 'high', subject: 'DSA' },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([
    { subject: 'DSA', total: 40, attended: 34 },
    { subject: 'DBMS', total: 38, attended: 28 },
    { subject: 'OS', total: 42, attended: 39 },
    { subject: 'Networks', total: 36, attended: 24 },
  ]);
  const [cgpaSubjects, setCgpaSubjects] = useState([
    { name: 'DSA', grade: 'A', credits: 4 },
    { name: 'DBMS', grade: 'B+', credits: 3 },
    { name: 'OS', grade: 'A+', credits: 4 },
    { name: 'Networks', grade: 'B', credits: 3 },
  ]);

  const GRADE_POINTS: Record<string, number> = {
    'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'F': 0
  };

  const cgpa = cgpaSubjects.reduce((acc, s) => {
    const gp = GRADE_POINTS[s.grade] ?? 0;
    return acc + gp * s.credits;
  }, 0) / cgpaSubjects.reduce((a, s) => a + s.credits, 0);

  const totalFocusMin = Math.floor(totalFocusTime / 60);
  const xpProgress = (xp / (level * 1000)) * 100;

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos(t => [...t, { id: Date.now().toString(), text: newTodo, done: false, priority: 'medium', subject: 'General' }]);
    setNewTodo('');
  };

  const tabs = [
    { id: 'home', label: 'Overview', icon: BarChart2 },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'cgpa', label: 'CGPA', icon: GraduationCap },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ] as const;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex h-full text-white overflow-hidden bg-black"
    >
      {/* Sidebar */}
      <div className="w-52 border-r border-white/5 bg-white/[0.01] flex flex-col p-4 gap-1">
        <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-4 px-2">Dashboard</div>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left",
              activeTab === tab.id ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5 hover:text-white/60"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}

        {/* Quick stats */}
        <div className="mt-auto space-y-2 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest flex items-center gap-1.5"><Flame className="w-3 h-3 text-orange-400 fill-current" />Streak</span>
            <span className="text-xs font-bold text-white/60">{streak}d</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest flex items-center gap-1.5"><Star className="w-3 h-3 text-yellow-400 fill-current" />Level</span>
            <span className="text-xs font-bold text-white/60">{level}</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest flex items-center gap-1.5"><Zap className="w-3 h-3 text-blue-400" />XP</span>
            <span className="text-xs font-bold text-white/60">{xp}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Greeting */}
            <div>
              <h1 className="text-3xl font-black tracking-tighter">
                Hey, {profile.name || 'Scholar'} 👋
              </h1>
              <p className="text-white/40 text-sm mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} • {profile.stream || 'Student'}
              </p>
            </div>

            {/* XP Progress */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl" />
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-yellow-400/10 flex items-center justify-center border border-yellow-400/20">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-white/30">Level {level}</div>
                    <div className="text-lg font-bold">{xp} XP</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Next Level</div>
                  <div className="text-xs font-bold text-white/60">{level * 1000 - xp} XP away</div>
                </div>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-500/60 to-yellow-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Focus Sessions', value: sessionsCompleted, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
                { label: 'Focus Time', value: `${totalFocusMin}m`, icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
                { label: 'Coins', value: coins, icon: Award, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' },
                { label: 'Hearts', value: `${hearts}/5`, icon: Brain, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border", bg)}>
                    <Icon className={cn("w-4 h-4", color)} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-0.5">{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Upcoming Tasks */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30">Pending Tasks</h3>
                <button onClick={() => setActiveTab('tasks')} className="text-[10px] text-white/20 hover:text-white/40 transition-colors font-bold uppercase tracking-widest">View All →</button>
              </div>
              <div className="space-y-2">
                {todos.filter(t => !t.done).slice(0, 3).map(todo => (
                  <div key={todo.id} className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl border",
                    todo.priority === 'high' ? 'bg-red-500/5 border-red-500/10' :
                    todo.priority === 'medium' ? 'bg-yellow-500/5 border-yellow-500/10' :
                    'bg-white/[0.02] border-white/5'
                  )}>
                    <div className={cn("w-1.5 h-1.5 rounded-full shrink-0",
                      todo.priority === 'high' ? 'bg-red-400' :
                      todo.priority === 'medium' ? 'bg-yellow-400' : 'bg-white/20'
                    )} />
                    <span className="text-xs text-white/70 flex-1">{todo.text}</span>
                    <span className="text-[10px] text-white/20 font-bold">{todo.subject}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Achievements</h3>
              <div className="flex gap-3 flex-wrap">
                {achievements.map(ach => (
                  <div
                    key={ach.id}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all",
                      ach.unlockedAt
                        ? "bg-white/10 border-white/20"
                        : "bg-white/[0.02] border-white/5 opacity-40"
                    )}
                  >
                    <span className="text-xl">{ach.icon}</span>
                    <div>
                      <div className="text-xs font-bold">{ach.title}</div>
                      <div className="text-[10px] text-white/30">{ach.description}</div>
                    </div>
                    {ach.unlockedAt && <Check className="w-3 h-3 text-emerald-400 ml-2" />}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TASKS TAB */}
        {activeTab === 'tasks' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h1 className="text-3xl font-black tracking-tighter">Task Manager</h1>
            <div className="flex gap-3">
              <input
                value={newTodo}
                onChange={e => setNewTodo(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTodo()}
                placeholder="Add new task..."
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3.5 text-sm font-medium text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-white/15"
              />
              <button
                onClick={addTodo}
                className="px-6 py-3.5 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/90 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {todos.map(todo => (
                <motion.div
                  key={todo.id}
                  layout
                  className={cn(
                    "flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all",
                    todo.done ? "bg-white/[0.01] border-white/5 opacity-50" : "bg-white/[0.03] border-white/10"
                  )}
                >
                  <button
                    onClick={() => setTodos(t => t.map(i => i.id === todo.id ? { ...i, done: !i.done } : i))}
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                      todo.done ? "bg-white border-white" : "border-white/20 hover:border-white/50"
                    )}
                  >
                    {todo.done && <Check className="w-2.5 h-2.5 text-black" />}
                  </button>
                  <div className="flex-1">
                    <p className={cn("text-sm font-medium", todo.done && "line-through text-white/30")}>{todo.text}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] text-white/20 font-bold">{todo.subject}</span>
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        todo.priority === 'high' ? 'text-red-400' :
                        todo.priority === 'medium' ? 'text-yellow-400' : 'text-white/20'
                      )}>{todo.priority}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setTodos(t => t.filter(i => i.id !== todo.id))}
                    className="text-white/10 hover:text-red-400/60 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === 'attendance' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h1 className="text-3xl font-black tracking-tighter">Attendance Tracker</h1>
            <div className="space-y-4">
              {attendance.map((rec, i) => {
                const pct = Math.round((rec.attended / rec.total) * 100);
                const isLow = pct < 75;
                return (
                  <div key={i} className={cn(
                    "p-6 rounded-2xl border transition-all",
                    isLow ? "bg-red-500/5 border-red-500/10" : "bg-white/[0.03] border-white/5"
                  )}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-bold text-sm">{rec.subject}</div>
                        <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-0.5">
                          {rec.attended}/{rec.total} classes
                        </div>
                      </div>
                      <div className={cn("text-3xl font-bold", isLow ? "text-red-400" : "text-white")}>
                        {pct}%
                        {isLow && <span className="text-[10px] text-red-400 block text-right font-black uppercase tracking-widest">Low!</span>}
                      </div>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className={cn("h-full rounded-full", isLow ? "bg-red-400/60" : "bg-white/50")}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    {isLow && (
                      <p className="text-[10px] text-red-400/60 mt-3 font-bold">
                        Need {Math.ceil((0.75 * rec.total - rec.attended) / 0.25)} more classes to reach 75%
                      </p>
                    )}
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => setAttendance(a => a.map((r, j) => j === i ? { ...r, attended: r.attended + 1, total: r.total + 1 } : r))}
                        className="flex-1 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all"
                      >✓ Present</button>
                      <button
                        onClick={() => setAttendance(a => a.map((r, j) => j === i ? { ...r, total: r.total + 1 } : r))}
                        className="flex-1 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
                      >✗ Absent</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* CGPA TAB */}
        {activeTab === 'cgpa' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-end justify-between">
              <h1 className="text-3xl font-black tracking-tighter">CGPA Calculator</h1>
              <div className="text-right">
                <div className="text-[10px] text-white/30 font-black uppercase tracking-widest">Current CGPA</div>
                <div className="text-5xl font-bold text-white">{cgpa.toFixed(2)}</div>
              </div>
            </div>
            <div className="space-y-3">
              {cgpaSubjects.map((sub, i) => (
                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="flex-1">
                    <input
                      value={sub.name}
                      onChange={e => setCgpaSubjects(s => s.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                      className="bg-transparent text-sm font-bold text-white focus:outline-none w-full"
                    />
                    <div className="text-[10px] text-white/20 font-bold mt-0.5">{sub.credits} Credits · {GRADE_POINTS[sub.grade] ?? 0} Grade Points</div>
                  </div>
                  <select
                    value={sub.grade}
                    onChange={e => setCgpaSubjects(s => s.map((x, j) => j === i ? { ...x, grade: e.target.value } : x))}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-black text-white focus:outline-none"
                  >
                    {['O','A+','A','B+','B','C','F'].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <select
                    value={sub.credits}
                    onChange={e => setCgpaSubjects(s => s.map((x, j) => j === i ? { ...x, credits: parseInt(e.target.value) } : x))}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-black text-white focus:outline-none"
                  >
                    {[1,2,3,4,5].map(c => <option key={c} value={c}>{c}cr</option>)}
                  </select>
                </div>
              ))}
            </div>
            <button
              onClick={() => setCgpaSubjects(s => [...s, { name: 'New Subject', grade: 'A', credits: 3 }])}
              className="w-full py-3.5 rounded-2xl border border-white/10 border-dashed text-white/30 hover:text-white/50 hover:bg-white/5 transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Subject
            </button>
          </motion.div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h1 className="text-3xl font-black tracking-tighter">Study Analytics</h1>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Sessions', value: sessionsCompleted, desc: 'pomodoro sessions completed' },
                { label: 'Focus Time', value: `${totalFocusMin}m`, desc: 'total deep work minutes' },
                { label: 'Study Streak', value: `${streak} days`, desc: 'consecutive active days' },
                { label: 'Level', value: `${level}`, desc: `${xp} / ${level * 1000} XP` },
              ].map(({ label, value, desc }) => (
                <div key={label} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-2">{label}</div>
                  <div className="text-4xl font-bold">{value}</div>
                  <div className="text-[10px] text-white/20 mt-1">{desc}</div>
                </div>
              ))}
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-6">Weekly Activity (simulated)</div>
              <div className="flex items-end gap-2 h-32">
                {[40,65,30,80,55,90,70].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-white/20 rounded-t-lg"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                  <span key={d} className="text-[10px] text-white/20 font-bold flex-1 text-center">{d}</span>
                ))}
              </div>
            </div>
            {profile.weakSubjects.length > 0 && (
              <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
                <div className="text-[10px] text-red-400/60 font-black uppercase tracking-widest mb-3">Weak Subjects — Focus Here</div>
                <div className="flex flex-wrap gap-2">
                  {profile.weakSubjects.map(s => (
                    <span key={s} className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

"use client";

import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, MapPin, Shield, CheckCircle2, Circle, Trash2, X } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCalendarStore, CalendarEvent } from "@/store/useCalendarStore";

export default function CalendarApp() {
  const { events, addEvent, deleteEvent, toggleEvent } = useCalendarStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<'academic' | 'social' | 'focus' | 'other'>('academic');

  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Previous month filler days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false, date: new Date(year, month - 1, prevMonthDays - i) });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
    }
    
    // Next month filler days (to complete the grid)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) });
    }
    
    return days;
  }, [currentDate]);

  const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedDate) return;

    addEvent({
      title,
      time: time || "All Day",
      location: location || "TBD",
      type,
      date: selectedDate
    });

    setIsAddingEvent(false);
    setTitle("");
    setTime("");
    setLocation("");
    setType('academic');
  };

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events
      .filter(e => new Date(e.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  const todayStr = formatDate(new Date());
  const todayEvents = events.filter(e => e.date === todayStr && !e.completed);

  return (
    <div className="h-full flex bg-black text-white overflow-hidden relative">
      {/* Sidebar */}
      <div className="w-80 border-r border-white/5 bg-white/[0.01] flex flex-col p-8 z-10">
        <div className="flex items-center justify-between mb-12">
           <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-white/40" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Calendar</h2>
           </div>
           <button 
             onClick={() => { setSelectedDate(todayStr); setIsAddingEvent(true); }}
             className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/5"
           >
              <Plus className="w-4 h-4 text-white/40" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
           <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-6">Upcoming Events</h3>
              <div className="space-y-4">
                 {upcomingEvents.length === 0 && (
                   <div className="text-[10px] font-black uppercase tracking-widest text-white/10 text-center py-4">No events scheduled</div>
                 )}
                 {upcomingEvents.map((event) => (
                   <div key={event.id} className="group relative p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl transition-all">
                      <button 
                        onClick={() => deleteEvent(event.id)}
                        className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-lg transition-all z-10"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                      
                      <div className="flex items-center gap-3 text-white/20 mb-2">
                         <button onClick={() => toggleEvent(event.id)} className="hover:text-white transition-colors">
                            {event.completed ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4" />}
                         </button>
                         <span className="text-[10px] font-bold tabular-nums flex-1">{event.time}</span>
                         <span className="text-[9px] font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md">
                           {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                         </span>
                      </div>
                      <div className={cn("text-xs font-bold mb-2 transition-colors", event.completed ? "text-white/20 line-through" : "text-white/80")}>
                        {event.title}
                      </div>
                      <div className="flex items-center justify-between text-white/10">
                         <div className="flex items-center gap-2">
                           <MapPin className="w-3 h-3" />
                           <span className="text-[9px] font-medium">{event.location}</span>
                         </div>
                         <div className={cn(
                           "w-1.5 h-1.5 rounded-full",
                           event.type === 'academic' ? "bg-blue-500" :
                           event.type === 'focus' ? "bg-purple-500" :
                           event.type === 'social' ? "bg-emerald-500" : "bg-zinc-500"
                         )} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/5">
           <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5 flex items-center gap-4">
              <Shield className="w-8 h-8 text-white/10" />
              <p className="text-[11px] text-white/30 italic leading-relaxed">
                "Organization is the foundation of genius."
              </p>
           </div>
        </div>
      </div>

      {/* Main View */}
      <div className="flex-1 p-12 overflow-y-auto z-0">
        <div className="flex items-center justify-between mb-12">
           <div>
              <h1 className="text-4xl font-light tracking-tight text-white mb-2">
                 {currentDate.toLocaleString('default', { month: 'long' })} <span className="font-bold">{currentDate.getFullYear()}</span>
              </h1>
              <p className="text-sm font-medium text-white/20 uppercase tracking-widest">
                You have {todayEvents.length} tasks today
              </p>
           </div>
           <div className="flex gap-2">
              <button onClick={handlePrevMonth} className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all"><ChevronLeft className="w-5 h-5 text-white/40" /></button>
              <button onClick={handleNextMonth} className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all"><ChevronRight className="w-5 h-5 text-white/40" /></button>
           </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
           {DAYS.map(day => (
             <div key={day} className="p-6 bg-white/[0.01] text-[10px] font-black uppercase tracking-widest text-white/20 text-center border-b border-white/5">
                {day}
             </div>
           ))}
           {calendarDays.map((item, i) => {
             const dateStr = formatDate(item.date);
             const isToday = dateStr === todayStr;
             const dayEvents = events.filter(e => e.date === dateStr);

             return (
               <div 
                 key={i} 
                 onClick={() => {
                   setSelectedDate(dateStr);
                   setIsAddingEvent(true);
                 }}
                 className={cn(
                   "min-h-[140px] p-4 bg-black relative group hover:bg-white/[0.05] transition-colors cursor-pointer border-[0.5px] border-white/5",
                   !item.isCurrentMonth && "opacity-20"
                 )}
               >
                 <span className={cn(
                   "text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full",
                   isToday ? "bg-white text-black font-bold" : "text-white/40"
                 )}>
                   {item.day}
                 </span>
                 
                 <div className="mt-2 space-y-1">
                    {dayEvents.slice(0, 3).map(ev => (
                      <div key={ev.id} className={cn(
                        "text-[9px] font-bold px-1.5 py-0.5 rounded truncate border transition-colors",
                        ev.completed ? "bg-transparent border-white/5 text-white/20 line-through" : "bg-white/5 border-transparent text-white/60"
                      )}>
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[8px] font-black text-white/20 pl-1">+{dayEvents.length - 3} more</div>
                    )}
                 </div>
               </div>
             );
           })}
        </div>
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {isAddingEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xl flex items-center justify-center"
          >
            <div className="absolute inset-0" onClick={() => setIsAddingEvent(false)} />
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2rem] p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white tracking-tight">Add Event</h3>
                <button onClick={() => setIsAddingEvent(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-white/40" />
                </button>
              </div>

              <form onSubmit={handleAddEventSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 block">Event Title</label>
                  <input 
                    autoFocus
                    value={title} onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/20 text-white placeholder:text-white/20"
                    placeholder="e.g. Physics Midterm"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 block">Date</label>
                    <input 
                      type="date"
                      value={selectedDate || ""} onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/20 text-white placeholder:text-white/20"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 block">Time</label>
                    <input 
                      type="time"
                      value={time} onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/20 text-white placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 block">Type</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['academic', 'focus', 'social', 'other'] as const).map(t => (
                      <button
                        key={t} type="button"
                        onClick={() => setType(t)}
                        className={cn(
                          "py-2 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all",
                          type === t ? "bg-white/10 border-white/20 text-white" : "bg-white/5 border-transparent text-white/40 hover:bg-white/10"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={!title || !selectedDate}
                  className="w-full py-4 rounded-xl bg-white text-black font-black uppercase tracking-widest text-xs hover:scale-[0.98] active:scale-[0.95] transition-all disabled:opacity-50"
                >
                  Create Event
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

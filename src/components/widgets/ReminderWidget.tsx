"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Bell, Calendar as CalendarIcon, CheckCircle2, ChevronRight, AlertCircle, X } from "lucide-react";
import { useCalendarStore } from "@/store/useCalendarStore";
import { useWidgetStore } from "@/store/useWidgetStore";
import { useOSStore } from "@/store/useOSStore";
import { cn } from "@/lib/utils";

export default function ReminderWidget({ id }: { id?: string }) {
  const { events } = useCalendarStore();
  const { removeWidget, updateWidget, activeWidgets } = useWidgetStore();
  const { openWindow } = useOSStore();

  const widget = activeWidgets.find(w => w.id === id);

  const tomorrowEvents = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const tomorrowStr = `${yyyy}-${mm}-${dd}`;

    return events.filter(e => e.date === tomorrowStr && !e.completed);
  }, [events]);

  const hasEvents = tomorrowEvents.length > 0;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={{
        left: 20,
        right: typeof window !== "undefined" ? window.innerWidth - 320 : 0,
        top: 20,
        bottom: typeof window !== "undefined" ? window.innerHeight - 300 : 0,
      }}
      onDragEnd={(_, info) => {
        if (id) {
          updateWidget(id, { 
            x: (widget?.x || 0) + info.offset.x, 
            y: (widget?.y || 0) + info.offset.y 
          });
        }
      }}
      whileDrag={{ scale: 1.05, cursor: "grabbing" }}
      initial={{ x: widget?.x || 100, y: widget?.y || 100, opacity: 0 }}
      animate={{ x: widget?.x, y: widget?.y, opacity: 1 }}
      className="absolute cursor-grab select-none w-[300px] group"
    >
      <div className="h-full p-5 flex flex-col relative overflow-hidden bg-black/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-colors">
        {/* Background Glow */}
        <div className={cn(
          "absolute top-0 right-0 w-32 h-32 blur-[50px] pointer-events-none transition-colors duration-1000",
          hasEvents ? "bg-amber-500/10" : "bg-emerald-500/10"
        )} />

        {id && (
          <button 
            onClick={(e) => { e.stopPropagation(); removeWidget(id); }}
            className="absolute top-2 right-2 p-1.5 w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 hover:bg-red-500 rounded-lg transition-all text-white/40 hover:text-white z-50 border border-white/10 hover:border-red-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="flex items-center gap-2 mb-4 relative z-10">
          <div className={cn(
            "w-8 h-8 rounded-xl flex items-center justify-center border",
            hasEvents ? "bg-amber-500/10 border-amber-500/20" : "bg-emerald-500/10 border-emerald-500/20"
          )}>
            <Bell className={cn("w-4 h-4", hasEvents ? "text-amber-400" : "text-emerald-400")} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Tomorrow</h3>
            <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Upcoming radar</p>
          </div>
        </div>

        <div className="flex-1 relative z-10 flex flex-col justify-center">
          {hasEvents ? (
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-full w-fit border border-amber-400/20">
                 <AlertCircle className="w-3 h-3" />
                 <span className="text-[10px] font-black uppercase tracking-widest">{tomorrowEvents.length} Tasks Scheduled</span>
               </div>
               
               <div className="space-y-2">
                  {tomorrowEvents.slice(0, 2).map(ev => (
                    <div key={ev.id} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                      <span className="text-sm font-medium text-white/80 truncate flex-1">{ev.title}</span>
                      <span className="text-[10px] font-bold text-white/40">{ev.time}</span>
                    </div>
                  ))}
                  {tomorrowEvents.length > 2 && (
                    <div className="text-[10px] font-bold text-white/40 pl-4 italic">
                      + {tomorrowEvents.length - 2} more items
                    </div>
                  )}
               </div>
            </div>
          ) : (
            <div className="text-center py-4 space-y-3">
               <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
               </div>
               <p className="text-sm font-bold text-white">Clear Schedule</p>
               <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">Nothing due tomorrow</p>
            </div>
          )}
        </div>

        <button
          onClick={() => openWindow('calendar', 'Calendar', 'calendar')}
          className="mt-4 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors flex items-center justify-between px-4 group/btn relative z-10"
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-3.5 h-3.5 text-white/40" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover/btn:text-white transition-colors">
              Open Calendar
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
        </button>
      </div>
    </motion.div>
  );
}

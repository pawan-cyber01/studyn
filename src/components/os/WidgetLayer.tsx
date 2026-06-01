"use client";

import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useFocusStore } from "@/store/useFocusStore";
import { useWidgetStore, WidgetInstance } from "@/store/useWidgetStore";
import GamificationWidget from "./GamificationWidget";

// Import new widgets
import ClockWidget from "../widgets/ClockWidget";
import StickyNoteWidget from "../widgets/StickyNoteWidget";
import StopwatchWidget from "../widgets/StopwatchWidget";
import QuoteWidget from "../widgets/QuoteWidget";
import FocusWidget from "../widgets/FocusWidget";
import CGPAWidget from "../widgets/CGPAWidget";
import AttendanceWidget from "../widgets/AttendanceWidget";
import AIThoughtWidget from "../widgets/AIThoughtWidget";
import DailySpinWidget from "../widgets/DailySpinWidget";
import StudyDNAWidget from "../widgets/StudyDNAWidget";
import TodoWidget from "../widgets/TodoWidget";
import ReminderWidget from "../widgets/ReminderWidget";

import MotivationWidget from "../widgets/MotivationWidget";
import ImageWidget from "../widgets/ImageWidget";

interface WidgetProps {
  widget: WidgetInstance;
}

function WidgetFrame({ widget }: WidgetProps) {
  
  const renderContent = () => {
    switch (widget.type) {
      case 'clock': return <ClockWidget id={widget.id} />;
      case 'notes': return <StickyNoteWidget id={widget.id} />;
      case 'todo': return <TodoWidget id={widget.id} />;
      case 'stopwatch': return <StopwatchWidget id={widget.id} />;
      case 'focus': return <FocusWidget id={widget.id} />;
      case 'analytics': return <GamificationWidget id={widget.id} />;
      case 'quote': return <QuoteWidget id={widget.id} />;
      case 'cgpa': return <CGPAWidget id={widget.id} />;
      case 'attendance': return <AttendanceWidget id={widget.id} />;
      case 'ai': return <AIThoughtWidget id={widget.id} />;
      case 'reminder': return <ReminderWidget id={widget.id} />;
      case 'dailyspin': return <DailySpinWidget id={widget.id} />;
      case 'studydna': return <StudyDNAWidget />;
      case 'motivation': return <MotivationWidget id={widget.id} />;
      case 'image': return <ImageWidget id={widget.id} />;
      default: return <div className="p-8 text-white/20 text-xs uppercase tracking-widest font-black">Widget {widget.type}</div>;
    }
  };

  return (
    <div className="pointer-events-auto">
      {renderContent()}
    </div>
  );
}

export default function WidgetLayer() {
  const { activeWidgets } = useWidgetStore();
  const { tick } = useFocusStore();

  useEffect(() => {
    const timer = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(timer);
  }, [tick]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="relative w-full h-full pointer-events-none">
        <AnimatePresence>
          {activeWidgets.map((widget) => (
            <WidgetFrame key={widget.id} widget={widget} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

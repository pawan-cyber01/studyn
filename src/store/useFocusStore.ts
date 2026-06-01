import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useDNAStore } from './useDNAStore';

export type SessionType = 'work' | 'short' | 'long';
export type AmbientSoundType = 'none' | 'rain' | 'cafe' | 'thunder' | 'white-noise' | 'keyboard' | 'lofi';
export type FocusGoal = '1h' | '2h' | '4h' | 'custom';

interface DayProgress {
  date: string;
  minutes: number;
}

interface FocusState {
  // Timer State
  timeLeft: number;
  isActive: boolean;
  sessionType: SessionType;
  sessionsCompleted: number;
  totalFocusTime: number; // total in seconds
  
  // Weekly Management
  weeklyGoalHours: number;
  dailyHistory: DayProgress[];
  
  // Session Management
  focusGoal: FocusGoal;
  autoStart: boolean;
  currentCycle: number;
  totalCyclesGoal: number; // how many cycles in the current goal
  
  // Ambient Sound
  ambientSound: AmbientSoundType;
  ambientVolume: number;
  
  // UI State
  isImmersive: boolean;
  showNotification: boolean;
  notificationType: 'work' | 'break' | 'complete' | null;
  currentQuote: string;

  // Actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  setSessionType: (type: SessionType) => void;
  setFocusGoal: (goal: FocusGoal) => void;
  setAutoStart: (auto: boolean) => void;
  setAmbientSound: (sound: AmbientSoundType) => void;
  setAmbientVolume: (volume: number) => void;
  toggleImmersive: (val?: boolean) => void;
  closeNotification: () => void;
  setWeeklyGoal: (hours: number) => void;
  addSessionToHistory: (minutes: number) => void;
}

const SESSION_TIMES = {
  work: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

const MOTIVATIONAL_QUOTES = [
  "Small progress is still progress.",
  "Focus creates mastery.",
  "One session at a time.",
  "Discipline beats motivation.",
  "Consistency builds success.",
  "Deep work is your superpower.",
  "Master your minutes, master your life.",
  "Stay in the flow.",
  "Your future self will thank you.",
  "The only way out is through."
];

export const useFocusStore = create<FocusState>()(
  persist(
    (set, get) => ({
      timeLeft: SESSION_TIMES.work,
      isActive: false,
      sessionType: 'work',
      sessionsCompleted: 0,
      totalFocusTime: 0,
      weeklyGoalHours: 20, // Default 20 hours/week
      dailyHistory: [],
      focusGoal: '2h',
      autoStart: true,
      currentCycle: 1,
      totalCyclesGoal: 4,
      ambientSound: 'none',
      ambientVolume: 0.5,
      isImmersive: false,
      showNotification: false,
      notificationType: null,
      currentQuote: MOTIVATIONAL_QUOTES[0],

      startTimer: () => set({ isActive: true, showNotification: false }),
      pauseTimer: () => set({ isActive: false }),
      resetTimer: () => {
        const { sessionType } = get();
        set({ timeLeft: SESSION_TIMES[sessionType], isActive: false });
      },

      tick: () => {
        const { timeLeft, isActive, sessionType, sessionsCompleted, totalFocusTime, autoStart, currentCycle, totalCyclesGoal } = get();
        if (!isActive) return;

        if (timeLeft <= 0) {
          if (sessionType === 'work') {
            const isLastCycle = currentCycle >= totalCyclesGoal;
            get().addSessionToHistory(25); // Log 25 mins
            const currentHour = new Date().getHours();
            useDNAStore.getState().logSession({
              timestamp: new Date().toISOString(),
              duration: 25,
              ambience: get().ambientSound,
              type: 'work',
              hourOfDay: currentHour
            });
            
            set({
              sessionsCompleted: sessionsCompleted + 1,
              sessionType: isLastCycle ? 'long' : 'short',
              timeLeft: SESSION_TIMES[isLastCycle ? 'long' : 'short'],
              isActive: autoStart,
              notificationType: 'break',
              showNotification: true,
              currentCycle: isLastCycle ? 1 : currentCycle + 1,
              currentQuote: MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
            });
          } else {
            set({
              sessionType: 'work',
              timeLeft: SESSION_TIMES.work,
              isActive: autoStart,
              notificationType: 'work',
              showNotification: true,
              currentQuote: MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
            });
          }
          return;
        }

        set({ 
          timeLeft: timeLeft - 1,
          totalFocusTime: sessionType === 'work' ? totalFocusTime + 1 : totalFocusTime
        });
      },

      setSessionType: (type) => set({ sessionType: type, timeLeft: SESSION_TIMES[type], isActive: false }),
      
      setFocusGoal: (goal) => {
        let cycles = 4;
        if (goal === '1h') cycles = 2;
        if (goal === '2h') cycles = 4;
        if (goal === '4h') cycles = 8;
        
        set({ 
          focusGoal: goal, 
          totalCyclesGoal: cycles,
          currentCycle: 1,
          sessionType: 'work',
          timeLeft: SESSION_TIMES.work,
          isActive: false 
        });
      },

      setAutoStart: (auto: boolean) => set({ autoStart: auto }),
      setAmbientSound: (sound) => set({ ambientSound: sound }),
      setAmbientVolume: (volume) => set({ ambientVolume: volume }),
      toggleImmersive: (val) => set((state) => ({ isImmersive: val !== undefined ? val : !state.isImmersive })),
      closeNotification: () => set({ showNotification: false }),
      setWeeklyGoal: (hours) => set({ weeklyGoalHours: hours }),
      addSessionToHistory: (minutes) => {
        const today = new Date().toDateString();
        const history = [...get().dailyHistory];
        const dayIndex = history.findIndex(d => d.date === today);
        
        if (dayIndex !== -1) {
          history[dayIndex].minutes += minutes;
        } else {
          history.push({ date: today, minutes });
        }
        set({ dailyHistory: history });
      }
    }),
    {
      name: 'studyn-focus-advanced-v3',
    }
  )
);

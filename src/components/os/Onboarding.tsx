"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { 
  ArrowRight, ArrowLeft, Check, GraduationCap, BookOpen, 
  Sparkles, Star, Flame, Zap, Key, ExternalLink
} from "lucide-react";
import { useAIStore } from "@/store/useAIStore";
import { useUserStore } from "@/store/useUserStore";
import { cn } from "@/lib/utils";

import { auth } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const SUBJECTS = [
  "Mathematics","Physics","Chemistry","Biology","Computer Science",
  "English","History","Geography","Economics","Accountancy",
  "Data Structures","Algorithms","DBMS","OS","Networks",
  "React","Node.js","Python","Java","Cybersecurity"
];

const GOALS = [
  "Crack Placements","Top the Semester","Learn Full-Stack",
  "Prepare for GATE","Crack JEE","Improve CGPA","Learn AI/ML",
  "Become a Researcher","Build Startups","Learn Cybersecurity",
  "Crack UPSC","Master Data Science"
];

const CAREERS = [
  "Software Engineer","Data Scientist","AI/ML Engineer",
  "Cybersecurity Expert","Product Manager","Researcher",
  "Doctor","CA/Finance Expert","Entrepreneur","DevOps Engineer"
];

const STEPS = [
  { title: "Welcome to Studyn", subtitle: "Your AI-powered academic OS" },
  { title: "Who are you?", subtitle: "Tell us about yourself" },
  { title: "Your subjects", subtitle: "What are you studying?" },
  { title: "Your goals", subtitle: "What do you want to achieve?" },
  { title: "Study habits", subtitle: "How do you like to work?" },
  { title: "AI Setup", subtitle: "Power your workspace with AI" },
  { title: "You're all set", subtitle: "Your workspace is ready" },
];

export default function Onboarding() {
  const { isCompleted, currentStep, profile, setStep, updateProfile, completeOnboarding } = useOnboardingStore();
  const { updateProfile: updateUserProfile } = useUserStore();
  const { apiKeys, setApiKey } = useAIStore();
  const [direction, setDirection] = useState(1);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (isCompleted) return null;

  const goNext = () => {
    if (currentStep < STEPS.length - 1) {
      setDirection(1);
      setStep(currentStep + 1);
    } else {
      updateUserProfile({ name: profile.name });
      completeOnboarding();
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setStep(currentStep - 1);
    }
  };

  const toggleItem = (arr: string[], item: string, key: 'subjects' | 'weakSubjects' | 'goals') => {
    const updated = arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
    updateProfile({ [key]: updated });
  };

  const progressPct = ((currentStep) / (STEPS.length - 1)) * 100;

  return (
    <div className="fixed inset-0 z-[2000] bg-[#050505] flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Top progress bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5">
        <motion.div
          className="h-full bg-white/40"
          animate={{ width: `${progressPct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>

      {/* Step counter */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {STEPS.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === currentStep ? 24 : 6,
              opacity: i <= currentStep ? 1 : 0.2,
            }}
            className={cn(
              "h-1.5 rounded-full transition-colors",
              i <= currentStep ? "bg-white" : "bg-white/20"
            )}
          />
        ))}
      </div>

      {/* Content */}
      <div className="w-full max-w-2xl px-6 relative z-10">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-8"
          >
            {/* Step Header */}
            <div className="text-center space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-bold tracking-tighter text-white"
              >
                {STEPS[currentStep].title}
              </motion.h1>
              <p className="text-white/40 text-lg font-light tracking-wide">
                {STEPS[currentStep].subtitle}
              </p>
            </div>

            {/* Step 0: Welcome */}
            {currentStep === 0 && (
              <div className="flex flex-col items-center gap-8 py-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 blur-[40px] rounded-full" />
                  <div className="relative w-28 h-28 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
                    <Sparkles className="w-14 h-14 text-white/80" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                  {[
                    { icon: Zap, label: "AI-Powered", color: "text-blue-400" },
                    { icon: Flame, label: "Gamified", color: "text-orange-400" },
                    { icon: Star, label: "Premium", color: "text-yellow-400" },
                  ].map(({ icon: Icon, label, color }) => (
                    <div key={label} className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                      <Icon className={cn("w-6 h-6", color)} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="w-full max-w-sm mt-4">
                  <button
                    onClick={async () => {
                      setIsLoggingIn(true);
                      try {
                        const provider = new GoogleAuthProvider();
                        const result = await signInWithPopup(auth, provider);
                        updateProfile({ name: result.user.displayName || "Scholar" });
                      } catch (err) {
                        console.error("Firebase Auth error (using fallback):", err);
                        updateProfile({ name: "Alex Studyn" });
                      }
                      setIsLoggingIn(false);
                      goNext();
                    }}
                    disabled={isLoggingIn}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white text-black font-bold text-sm hover:bg-white/90 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isLoggingIn ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Continue with Google
                      </>
                    )}
                  </button>
                  <p className="text-center text-white/30 text-xs mt-4">
                    Studyn is your personal AI-powered study operating system. Let&apos;s set it up in under 60 seconds.
                  </p>
                </div>
              </div>
            )}

            {/* Step 1: Who are you */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-1">Your Name</label>
                  <input
                    autoFocus
                    value={profile.name}
                    onChange={e => updateProfile({ name: e.target.value })}
                    placeholder="Enter your name..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-xl font-light text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-white/15"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-1">Institution Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    {(['school', 'college'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => updateProfile({ institution: type })}
                        className={cn(
                          "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all",
                          profile.institution === type
                            ? "border-white/40 bg-white/10 text-white"
                            : "border-white/5 bg-white/[0.02] text-white/40 hover:bg-white/5"
                        )}
                      >
                        <GraduationCap className="w-6 h-6" />
                        <span className="font-bold capitalize text-lg">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-1">
                      {profile.institution === 'college' ? 'Semester' : 'Class'}
                    </label>
                    <input
                      value={profile.class}
                      onChange={e => updateProfile({ class: e.target.value })}
                      placeholder={profile.institution === 'college' ? '3rd Semester' : 'Class 12'}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3.5 text-sm font-medium text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-white/15"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-1">Stream / Branch</label>
                    <input
                      value={profile.stream}
                      onChange={e => updateProfile({ stream: e.target.value })}
                      placeholder="Computer Science"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3.5 text-sm font-medium text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-white/15"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Subjects */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <p className="text-white/30 text-sm text-center">Select your subjects and mark the ones you struggle with</p>
                <div className="flex flex-wrap gap-2 max-h-[260px] overflow-y-auto no-scrollbar">
                  {SUBJECTS.map(sub => {
                    const isSelected = profile.subjects.includes(sub);
                    const isWeak = profile.weakSubjects.includes(sub);
                    return (
                      <div key={sub} className="flex items-center gap-1">
                        <button
                          onClick={() => toggleItem(profile.subjects, sub, 'subjects')}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                            isSelected
                              ? "bg-white/15 border-white/30 text-white"
                              : "bg-white/[0.03] border-white/5 text-white/30 hover:bg-white/5"
                          )}
                        >
                          {sub}
                        </button>
                        {isSelected && (
                          <button
                            onClick={() => toggleItem(profile.weakSubjects, sub, 'weakSubjects')}
                            className={cn(
                              "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] transition-all border",
                              isWeak
                                ? "bg-red-500/30 border-red-500/50 text-red-300"
                                : "bg-white/5 border-white/10 text-white/20 hover:bg-white/10"
                            )}
                            title="Mark as weak subject"
                          >
                            ⚠
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/20">
                  <span>{profile.subjects.length} selected</span>
                  {profile.weakSubjects.length > 0 && (
                    <span className="text-red-400/60">{profile.weakSubjects.length} weak subjects</span>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Goals */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Your Goals</p>
                  <div className="flex flex-wrap gap-2">
                    {GOALS.map(goal => (
                      <button
                        key={goal}
                        onClick={() => toggleItem(profile.goals, goal, 'goals')}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                          profile.goals.includes(goal)
                            ? "bg-white/15 border-white/30 text-white"
                            : "bg-white/[0.03] border-white/5 text-white/30 hover:bg-white/5"
                        )}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-1">Dream Career</label>
                  <div className="flex flex-wrap gap-2">
                    {CAREERS.map(career => (
                      <button
                        key={career}
                        onClick={() => updateProfile({ dreamCareer: career })}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2",
                          profile.dreamCareer === career
                            ? "bg-white/15 border-white/30 text-white"
                            : "bg-white/[0.03] border-white/5 text-white/30 hover:bg-white/5"
                        )}
                      >
                        {profile.dreamCareer === career && <Check className="w-3 h-3" />}
                        {career}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Study Habits */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Daily Study Hours</label>
                    <span className="text-3xl font-bold text-white">{profile.dailyHours}h</span>
                  </div>
                  <input
                    type="range" min={1} max={12} step={0.5}
                    value={profile.dailyHours}
                    onChange={e => updateProfile({ dailyHours: parseFloat(e.target.value) })}
                    className="w-full accent-white"
                  />
                  <div className="flex justify-between text-[10px] text-white/20 font-bold uppercase tracking-widest">
                    <span>Casual</span><span>Moderate</span><span>Intense</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Preferred Language</label>
                  <div className="flex flex-wrap gap-2">
                    {['English','Hindi','Tamil','Telugu','Marathi','Bengali','Gujarati'].map(lang => (
                      <button
                        key={lang}
                        onClick={() => updateProfile({ language: lang })}
                        className={cn(
                          "px-5 py-2.5 rounded-xl text-xs font-bold transition-all border",
                          profile.language === lang
                            ? "bg-white/15 border-white/30 text-white"
                            : "bg-white/[0.03] border-white/5 text-white/30 hover:bg-white/5"
                        )}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: AI Setup */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 items-center justify-center mb-4">
                    <Key className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed max-w-md mx-auto">
                    Studyn requires a free Groq API key to power its ultra-fast intelligence. Groq provides Llama 3 models at incredible speeds for free.
                  </p>
                </div>
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-1">Groq API Key</label>
                    <input
                      type="password"
                      value={apiKeys.groq}
                      onChange={e => setApiKey('groq', e.target.value)}
                      placeholder="gsk_..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm font-mono text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-white/15"
                    />
                  </div>
                  <a 
                    href="https://console.groq.com/keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors py-2"
                  >
                    Get Free API Key <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Step 6: Done */}
            {currentStep === 6 && (
              <div className="flex flex-col items-center gap-8 py-4 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-white/20 blur-[60px] rounded-full" />
                  <div className="relative w-28 h-28 rounded-[2.5rem] bg-white/10 border border-white/20 flex items-center justify-center shadow-2xl">
                    <BookOpen className="w-14 h-14 text-white" />
                  </div>
                </motion.div>
                <div className="space-y-3 max-w-md">
                  <h2 className="text-2xl font-bold text-white">Welcome, {profile.name || 'Scholar'}!</h2>
                  <p className="text-white/40 leading-relaxed">
                    Your AI workspace is personalized for{' '}
                    <span className="text-white/70 font-semibold">{profile.stream || 'your studies'}</span>.
                    {profile.goals.length > 0 && ` We'll help you ${profile.goals[0].toLowerCase()}.`}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                  {[
                    { val: profile.subjects.length, label: "Subjects" },
                    { val: profile.goals.length, label: "Goals" },
                    { val: `${profile.dailyHours}h`, label: "Daily Target" },
                  ].map(({ val, label }) => (
                    <div key={label} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                      <div className="text-2xl font-bold text-white">{val}</div>
                      <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-12">
          <button
            onClick={goBack}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border",
              currentStep > 0
                ? "border-white/10 text-white/40 hover:bg-white/5 hover:text-white/60"
                : "opacity-0 pointer-events-none border-transparent"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {currentStep > 0 && (
            <button
              onClick={goNext}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest bg-white text-black hover:bg-white/90 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] ml-auto"
            >
              {currentStep === STEPS.length - 1 ? (
                <>Launch Studyn <Zap className="w-4 h-4" /></>
              ) : (
                <>Continue <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          )}
        </div>

        {/* Skip */}
        {currentStep < STEPS.length - 1 && (
          <div className="text-center mt-4">
            <button
              onClick={completeOnboarding}
              className="text-[10px] text-white/20 hover:text-white/40 transition-colors font-bold uppercase tracking-widest"
            >
              Skip Setup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useAIStore, AIProvider } from "@/store/useAIStore";
import { useWallpaperStore } from "@/store/useWallpaperStore";
import { useUserStore } from "@/store/useUserStore";
import { 
  Bot, Shield, Cpu, Zap, Palette, User as UserIcon, Monitor, 
  Camera, LucideIcon
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SettingsTab = 'ai' | 'appearance' | 'profile' | 'privacy';

export default function SettingsApp() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('ai');
  const { provider, model, apiKeys, setProvider, setModel, setApiKey } = useAIStore();
  const { 
    settings: wpSettings, setDim, setBlur, setGrayscale, 
    setWallpaper, setEffect, setMotionIntensity, setParallaxIntensity 
  } = useWallpaperStore();
  const { profile, updateProfile } = useUserStore();
  
  const [testStatus, setTestStatus] = useState<null | 'testing' | 'success' | 'error'>(null);

  const tabs: { id: SettingsTab; name: string; icon: LucideIcon; color: string }[] = [
    { id: 'ai', name: 'AI Engine', icon: Zap, color: 'text-blue-400' },
    { id: 'appearance', name: 'Appearance', icon: Palette, color: 'text-pink-400' },
    { id: 'profile', name: 'Profile', icon: UserIcon, color: 'text-emerald-400' },
    { id: 'privacy', name: 'Privacy', icon: Shield, color: 'text-orange-400' },
  ];

  const providers: { id: AIProvider; name: string; icon: LucideIcon; color: string }[] = [
    { id: 'gemini', name: 'Google Gemini', icon: Zap, color: 'text-blue-400' },
    { id: 'groq', name: 'Groq Cloud', icon: Cpu, color: 'text-orange-400' },
    { id: 'openrouter', name: 'OpenRouter', icon: Bot, color: 'text-purple-400' },
  ];

  const handleTest = () => {
    setTestStatus('testing');
    setTimeout(() => setTestStatus('success'), 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex h-full text-white overflow-hidden bg-black"
    >
      {/* Sidebar */}
      <div className="w-56 border-r border-white/5 bg-white/[0.01] p-6 flex flex-col gap-1">
        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-6 px-2">System Settings</div>
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all",
              activeTab === tab.id ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5 hover:text-white/60"
            )}
          >
            <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? tab.color : "text-current")} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          
          {/* AI Tab */}
          {activeTab === 'ai' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-black tracking-tighter mb-2">AI Engine</h1>
              <p className="text-white/40 text-sm mb-10">Configure multi-provider intelligence for your workspace.</p>

              <div className="space-y-10">
                <section>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-6">Active Provider</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {providers.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setProvider(p.id)}
                        className={cn(
                          "flex flex-col items-center gap-4 p-6 rounded-3xl border-2 transition-all group",
                          provider === p.id 
                            ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/5" 
                            : "border-white/5 bg-white/[0.02] hover:bg-white/5"
                        )}
                      >
                        <p.icon className={cn("w-8 h-8 transition-transform group-hover:scale-110", p.color)} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-6">Model Architecture</h3>
                  <select 
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all text-white appearance-none"
                  >
                    {provider === 'gemini' && (
                      <>
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash (Performance)</option>
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Intelligence)</option>
                      </>
                    )}
                    {provider === 'groq' && (
                      <>
                        <option value="llama-3.1-70b-versatile">Llama 3.1 70B (Versatile)</option>
                        <option value="llama-3.1-8b-instant">Llama 3.1 8B (Instant)</option>
                      </>
                    )}
                  </select>
                </section>

                <section>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-6">Security & API Keys</h3>
                  <div className="space-y-4">
                    <input
                      type="password"
                      value={apiKeys[provider]}
                      onChange={(e) => setApiKey(provider, e.target.value)}
                      placeholder={`Enter ${provider} key`}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                    <button
                      onClick={handleTest}
                      className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-[0.99] active:scale-[0.97] transition-all"
                    >
                      {testStatus === 'testing' ? 'Connecting...' : 'Test Infrastructure'}
                    </button>
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-black tracking-tighter mb-2">Appearance</h1>
              <p className="text-white/40 text-sm mb-10">Customize your cinematic environment.</p>

              <div className="space-y-12">
                <section>
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-6">Visual Filters</h3>
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/60">
                            <span>Background Dim</span>
                            <span>{Math.round(wpSettings.dim * 100)}%</span>
                         </div>
                         <input 
                           type="range" min="0" max="1" step="0.05" 
                           value={wpSettings.dim} 
                           onChange={(e) => setDim(parseFloat(e.target.value))}
                           className="w-full accent-white"
                         />
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/60">
                            <span>Glass Blur</span>
                            <span>{wpSettings.blur}px</span>
                         </div>
                         <input 
                           type="range" min="0" max="20" step="1" 
                           value={wpSettings.blur} 
                           onChange={(e) => setBlur(parseInt(e.target.value))}
                           className="w-full accent-white"
                         />
                      </div>
                   </div>
                </section>

                <section>
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-6">Interactive Effects</h3>
                   <div className="grid grid-cols-5 gap-3">
                      {(['none', 'rain', 'stars', 'particles', 'aurora'] as const).map((eff) => (
                        <button 
                          key={eff}
                          onClick={() => setEffect(eff)}
                          className={cn(
                            "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all group",
                            wpSettings.effect === eff 
                              ? "border-blue-500 bg-blue-500/10" 
                              : "border-white/5 bg-white/[0.02] hover:bg-white/5"
                          )}
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">{eff}</span>
                        </button>
                      ))}
                   </div>
                </section>

                <section>
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-6">Engine Tuning</h3>
                   <div className="grid grid-cols-2 gap-8 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                      <div className="space-y-4">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/60">
                            <span>Motion Intensity</span>
                            <span>{Math.round(wpSettings.motionIntensity * 100)}%</span>
                         </div>
                         <input 
                           type="range" min="0" max="1" step="0.1" 
                           value={wpSettings.motionIntensity} 
                           onChange={(e) => setMotionIntensity(parseFloat(e.target.value))}
                           className="w-full accent-blue-500"
                         />
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/60">
                            <span>Parallax Force</span>
                            <span>{Math.round(wpSettings.parallaxIntensity * 100)}%</span>
                         </div>
                         <input 
                           type="range" min="0" max="1" step="0.1" 
                           value={wpSettings.parallaxIntensity} 
                           onChange={(e) => setParallaxIntensity(parseFloat(e.target.value))}
                           className="w-full accent-blue-500"
                         />
                      </div>
                   </div>
                </section>

                <section>
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-6">Premium Calm Presets</h3>
                   <div className="grid grid-cols-3 gap-4">
                      {[
                        'https://images.unsplash.com/photo-1510511459019-5dee995d3ff4?auto=format&fit=crop&q=80&w=2000',
                        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=2000',
                        'https://images.unsplash.com/photo-1464802686167-b939a67e06a1?auto=format&fit=crop&q=80&w=2000',
                        'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=2000',
                        'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=2000',
                        'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=2000'
                      ].map((url, i) => (
                        <button 
                          key={i}
                          onClick={() => setWallpaper(url)}
                          className={cn(
                            "aspect-video rounded-2xl overflow-hidden border-2 transition-all hover:scale-105 relative group",
                            wpSettings.activeWallpaper === url ? "border-white/40" : "border-white/5"
                          )}
                        >
                          <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Wallpaper" />
                          {wpSettings.activeWallpaper === url && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Zap className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                   </div>
                </section>

                <section className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-white/5">
                         <Monitor className="w-5 h-5 text-white/40" />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-white">Grayscale Mode</p>
                         <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Focus-enhancing visuals</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => setGrayscale(!wpSettings.grayscale)}
                     className={cn(
                       "w-12 h-6 rounded-full transition-all relative",
                       wpSettings.grayscale ? "bg-emerald-500" : "bg-white/10"
                     )}
                   >
                     <div className={cn(
                       "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                       wpSettings.grayscale ? "left-7" : "left-1"
                     )} />
                   </button>
                </section>
              </div>
            </motion.div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-black tracking-tighter mb-2">Profile</h1>
              <p className="text-white/40 text-sm mb-10">Manage your student identity and goals.</p>

              <div className="space-y-12">
                 <section className="flex items-center gap-8">
                    <div className="relative group">
                       <img src={profile.pfp} alt="PFP" className="w-32 h-32 rounded-[2.5rem] bg-white/5 border border-white/10 shadow-2xl" />
                       <div className="absolute inset-0 bg-black/60 rounded-[2.5rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                          <Camera className="w-8 h-8 text-white" />
                       </div>
                    </div>
                    <div className="flex-1 space-y-4">
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/20 px-1">Display Name</label>
                          <input 
                            value={profile.name}
                            onChange={(e) => updateProfile({ name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-sm font-bold focus:border-emerald-500/50 transition-all"
                          />
                       </div>
                    </div>
                 </section>

                 <section className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 px-1">Student Bio</label>
                    <textarea 
                      value={profile.bio}
                      onChange={(e) => updateProfile({ bio: e.target.value })}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-sm font-medium focus:border-emerald-500/50 transition-all resize-none"
                    />
                 </section>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}


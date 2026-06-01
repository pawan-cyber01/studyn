"use client";

import { Music, Play, Pause, SkipForward, SkipBack, Repeat, Shuffle, Volume2 } from "lucide-react";
import { useAudioStore } from "@/store/useAudioStore";

export default function MusicApp() {
  const { isPlaying, setPlaying } = useAudioStore();

  return (
    <div className="h-full flex flex-col bg-black text-white overflow-hidden">
      {/* Spotify Embed Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-4xl aspect-[16/9] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl bg-[#121212]">
          <iframe 
            src="https://open.spotify.com/embed/playlist/37i9dQZF1DX8Ueb9Cj9UMr?utm_source=generator&theme=0" 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            allowFullScreen 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
            className="opacity-90 grayscale hover:grayscale-0 transition-all duration-700"
          ></iframe>
        </div>
      </div>

      {/* OS Control Bar (Minimalist) */}
      <div className="h-24 bg-white/[0.01] border-t border-white/5 flex items-center justify-between px-12">
        <div className="flex items-center gap-6">
           <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Music className={cn("w-5 h-5 transition-colors", isPlaying ? "text-blue-400" : "text-white/40")} />
           </div>
           <div>
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Now Playing</div>
              <div className="text-xs font-bold text-white/80">Spotify Integration // Study Flow</div>
           </div>
        </div>

        <div className="flex items-center gap-8">
           <button className="text-white/20 hover:text-white transition-colors"><Shuffle className="w-4 h-4" /></button>
           <button className="text-white/20 hover:text-white transition-colors"><SkipBack className="w-5 h-5" /></button>
           <button 
             onClick={() => setPlaying(!isPlaying)}
             className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
           >
              {isPlaying ? <Pause className="w-6 h-6 text-white fill-white" /> : <Play className="w-6 h-6 text-white fill-white" />}
           </button>
           <button className="text-white/20 hover:text-white transition-colors"><SkipForward className="w-5 h-5" /></button>
           <button className="text-white/20 hover:text-white transition-colors"><Repeat className="w-4 h-4" /></button>
        </div>

        <div className="flex items-center gap-4">
           <Volume2 className="w-4 h-4 text-white/20" />
           <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="w-[70%] h-full bg-white/20" />
           </div>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

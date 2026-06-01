"use client";

import { useState, useEffect } from "react";
import { Search, Play, Shield, MonitorPlay, Clock, ThumbsUp, Eye, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoResult {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  viewCount?: string;
  publishedAt?: string;
}

import { motion } from "framer-motion";

export default function YouTubeApp() {
  const [search, setSearch] = useState("");
  const [videoId, setVideoId] = useState("jfKfPfyJRdk"); // Default study music
  const [results, setResults] = useState<VideoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'recommendations'>('recommendations');

  // Static high-quality defaults for "Recommendations"
  const recommendations: VideoResult[] = [
    { id: 'jfKfPfyJRdk', title: 'Lofi Girl - Study Beats to Relax/Study to', thumbnail: 'https://img.youtube.com/vi/jfKfPfyJRdk/mqdefault.jpg', channelTitle: 'Lofi Girl' },
    { id: '5qap5aO4i9A', title: 'Dark Academia Piano - Music for Studying and Thinking', thumbnail: 'https://img.youtube.com/vi/5qap5aO4i9A/mqdefault.jpg', channelTitle: 'The Soul of Wind' },
    { id: 'DWcJFNfaw9c', title: 'Deep Work Focus Music - 4 Hours of Productivity', thumbnail: 'https://img.youtube.com/vi/DWcJFNfaw9c/mqdefault.jpg', channelTitle: 'Jason Lewis' },
    { id: 'lTRiuFIWV54', title: 'Java Tutorial for Beginners 2024', thumbnail: 'https://img.youtube.com/vi/lTRiuFIWV54/mqdefault.jpg', channelTitle: 'Programming with Mosh' },
    { id: 'eIrMbLywj8M', title: 'JavaScript Full Course for Beginners', thumbnail: 'https://img.youtube.com/vi/eIrMbLywj8M/mqdefault.jpg', channelTitle: 'FreeCodeCamp' },
  ];

  useEffect(() => {
    setResults(recommendations);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) return;

    setLoading(true);
    setActiveTab('search');

    // Check if it's a direct URL
    if (search.includes("v=")) {
      const id = search.split("v=")[1].split("&")[0];
      setVideoId(id);
      setLoading(false);
      return;
    }

    try {
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      if (apiKey) {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(search)}&type=video&key=${apiKey}`
        );
        const data = await response.json();
        
        if (data.items) {
          const mapped: VideoResult[] = data.items.map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url,
            channelTitle: item.snippet.channelTitle,
          }));
          setResults(mapped);
        }
      } else {
        // Fallback: If no API key, we simulate search results for common terms like "Java" or "Python"
        console.warn("YouTube API Key missing. Showing simulated results.");
        const simulated = recommendations.filter(r => 
          r.title.toLowerCase().includes(search.toLowerCase()) || 
          r.channelTitle.toLowerCase().includes(search.toLowerCase())
        );
        setResults(simulated.length > 0 ? simulated : recommendations);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full flex flex-col bg-black text-white overflow-hidden"
    >
      {/* Search Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02] backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-6 flex-1 max-w-4xl">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <MonitorPlay className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">YouTube<span className="text-red-500">.</span></span>
          </div>

          <form onSubmit={handleSearch} className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white/60 transition-colors" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search videos, courses, or paste URL..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-red-500/20 focus:ring-1 focus:ring-red-500/20 transition-all placeholder:text-white/10"
            />
          </form>
        </div>

        <div className="flex items-center gap-4 ml-6">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-full border border-red-500/20">
              <Shield className="w-3.5 h-3.5 text-red-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Ad-Free Mode</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Player & Controls */}
        <div className="flex-1 p-8 overflow-y-auto scrollbar-hide">
           <div className="max-w-5xl mx-auto space-y-8">
              {/* Main Player */}
              <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 relative bg-white/[0.01] group">
                 <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Video Info */}
              <div className="flex items-start justify-between">
                 <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white/90">Studyn Stream Player</h1>
                    <div className="flex items-center gap-4 mt-3">
                       <div className="flex items-center gap-1.5 text-white/40">
                          <Eye className="w-4 h-4" />
                          <span className="text-[11px] font-bold">LIVE</span>
                       </div>
                       <div className="w-1 h-1 bg-white/10 rounded-full" />
                       <div className="flex items-center gap-1.5 text-white/40">
                          <Clock className="w-4 h-4" />
                          <span className="text-[11px] font-bold">24/7 Focus Stream</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all">
                       <ThumbsUp className="w-4 h-4 text-white/40" />
                       <span className="text-[11px] font-bold">Like</span>
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all">
                       <MoreVertical className="w-4 h-4 text-white/40" />
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Sidebar - Results / Recommendations */}
        <div className="w-[450px] border-l border-white/5 bg-white/[0.01] overflow-y-auto p-6 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                {activeTab === 'search' ? 'Search Results' : 'Recommended for You'}
              </h3>
              {loading && <div className="w-4 h-4 border-2 border-white/10 border-t-white rounded-full animate-spin" />}
           </div>

           <div className="space-y-4">
              {results.map((video) => (
                <button 
                  key={video.id}
                  onClick={() => {
                    setVideoId(video.id);
                  }}
                  className={cn(
                    "w-full group flex gap-4 p-3 rounded-2xl transition-all border text-left",
                    videoId === video.id 
                      ? "bg-white/5 border-white/10 ring-1 ring-white/10 shadow-lg" 
                      : "bg-transparent border-transparent hover:bg-white/[0.03] hover:border-white/5"
                  )}
                >
                  <div className="w-36 aspect-video rounded-xl bg-white/10 overflow-hidden relative flex-shrink-0">
                     <img src={video.thumbnail} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                        <Play className="w-6 h-6 text-white fill-white" />
                     </div>
                  </div>
                  <div className="flex-1 py-1">
                     <div className="text-[12px] font-bold text-white/80 line-clamp-2 leading-snug group-hover:text-white transition-colors">
                       {video.title.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")}
                     </div>
                     <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-2 flex items-center gap-2">
                       <span>{video.channelTitle}</span>
                       <div className="w-1 h-1 bg-white/10 rounded-full" />
                       <Shield className="w-3 h-3 text-red-500/40" />
                     </div>
                  </div>
                </button>
              ))}
           </div>
        </div>
      </div>
    </motion.div>
  );
}

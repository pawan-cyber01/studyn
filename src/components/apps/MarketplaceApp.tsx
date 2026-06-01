"use client";

import { useState } from "react";
import { ShoppingBag, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { useMarketplaceStore, MARKETPLACE_ITEMS } from "@/store/useMarketplaceStore";
import { useGamificationStore } from "@/store/useGamificationStore";
import { cn } from "@/lib/utils";

export default function MarketplaceApp() {
  const { purchasedIds, purchaseItem, activeThemeId, setTheme } = useMarketplaceStore();
  const { coins } = useGamificationStore();
  const [activeCategory, setActiveCategory] = useState<'all' | 'themes' | 'wallpapers'>('all');

  const handlePurchase = (item: typeof MARKETPLACE_ITEMS[0]) => {
    if (purchasedIds.includes(item.id)) {
      setTheme(item.id);
      return;
    }
    
    if (coins >= item.price) {
      purchaseItem(item.id, item.price);
    }
  };

  return (
    <div className="flex h-full text-white/90">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/5 bg-white/[0.01] flex flex-col p-6 space-y-8">
        <div className="space-y-1">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-4 px-2">Categories</div>
          <button 
            onClick={() => setActiveCategory('all')}
            className={cn(
              "w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all",
              activeCategory === 'all' ? "bg-white/5 text-white" : "text-white/30 hover:bg-white/[0.02]"
            )}
          >
            <ShoppingBag className="w-4 h-4" />
            All Items
          </button>
          <button 
            onClick={() => setActiveCategory('themes')}
            className={cn(
              "w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all",
              activeCategory === 'themes' ? "bg-white/5 text-white" : "text-white/30 hover:bg-white/[0.02]"
            )}
          >
            <Sparkles className="w-4 h-4" />
            Themes
          </button>
        </div>

        <div className="mt-auto p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
           <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Your Balance</div>
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-black">S</div>
              <div className="text-xl font-bold">{coins}</div>
           </div>
           <p className="text-[10px] text-white/20 leading-relaxed font-medium">Earn more coins by completing focus sessions and winning quiz battles.</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 flex flex-col bg-white/[0.01] overflow-hidden">
        <div className="h-16 border-b border-white/5 flex items-center px-8">
           <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Marketplace</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex flex-wrap gap-8 justify-center">
            {MARKETPLACE_ITEMS.map(item => (
              <div 
                key={item.id}
                className="group p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-500 overflow-hidden relative w-full max-w-[500px]"
              >
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                   <ShieldCheck className="w-24 h-24" />
                </div>
                
                <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 border border-white/5">
                   <img src={item.preview} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                   {purchasedIds.includes(item.id) && (
                     <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white/60" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Owned</span>
                     </div>
                   )}
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-lg font-bold mb-1">{item.name}</h3>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/20 px-2 py-0.5 bg-white/5 rounded-md">{item.type}</span>
                       <span className="text-[10px] font-bold text-white/40">High Fidelity Asset</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handlePurchase(item)}
                    disabled={coins < item.price && !purchasedIds.includes(item.id)}
                    className={cn(
                      "w-32 aspect-5-3 btn-premium",
                      activeThemeId === item.id ? "bg-white/10 border-white/20 text-white" : "disabled:opacity-20"
                    )}
                  >
                    {purchasedIds.includes(item.id) 
                      ? (activeThemeId === item.id ? "Active" : "Apply") 
                      : `${item.price} S`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

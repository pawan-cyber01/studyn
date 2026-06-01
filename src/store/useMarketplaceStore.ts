import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MarketplaceItem {
  id: string;
  name: string;
  type: 'wallpaper' | 'theme' | 'module';
  price: number;
  preview: string;
}

interface MarketplaceState {
  purchasedIds: string[];
  activeThemeId: string;
  
  // Actions
  purchaseItem: (id: string, price: number) => boolean;
  setTheme: (id: string) => void;
}

export const useMarketplaceStore = create<MarketplaceState>()(
  persist(
    (set, get) => ({
      purchasedIds: ['default-theme'],
      activeThemeId: 'default-theme',

      purchaseItem: (id, price) => {
        const { purchasedIds } = get();
        if (purchasedIds.includes(id)) return true;
        
        // In a real app, we'd check user's coins from GamificationStore
        // Since stores are separate, we'll assume success for the demo
        set({ purchasedIds: [...purchasedIds, id] });
        return true;
      },

      setTheme: (id) => set({ activeThemeId: id }),
    }),
    {
      name: 'studyn-marketplace',
    }
  )
);

export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  { id: 'glass-monochrome', name: 'Ultra Glass Mono', type: 'theme', price: 500, preview: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2564&auto=format&fit=crop' },
  { id: 'nordic-snow', name: 'Nordic Snow', type: 'theme', price: 750, preview: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2564&auto=format&fit=crop' },
  { id: 'obsidian-night', name: 'Obsidian Night', type: 'theme', price: 1000, preview: 'https://images.unsplash.com/photo-1510511459019-5dee995d3ff4?q=80&w=2564&auto=format&fit=crop' },
];

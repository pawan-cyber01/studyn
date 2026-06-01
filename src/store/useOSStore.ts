import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WindowInstance {
  id: string;
  title: string;
  icon: string;
  component: string; // The app identifier
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isAlwaysOnTop: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Space {
  id: string;
  name: string;
  wallpaper: string;
  icon: string;
}

interface OSState {
  isBooted: boolean;
  bootProgress: number;
  activeSpaceId: string;
  spaces: Space[];
  isMissionControlOpen: boolean;
  isSpotlightOpen: boolean;
  isLaunchpadOpen: boolean;
  windows: WindowInstance[];
  zCounter: number;
  
  // Actions
  setBooted: (val: boolean) => void;
  setBootProgress: (val: number) => void;
  setActiveSpace: (id: string) => void;
  setMissionControl: (isOpen: boolean) => void;
  setSpotlightOpen: (isOpen: boolean) => void;
  setLaunchpad: (isOpen: boolean) => void;
  addSpace: (name: string, wallpaper: string) => void;
  removeSpace: (id: string) => void;
  openWindow: (appId: string, title: string, icon: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  toggleAlwaysOnTop: (id: string) => void;
  updateWindowPos: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
}

export const useOSStore = create<OSState>()(
  persist(
    (set, get) => ({
      isBooted: false,
      bootProgress: 0,
      activeSpaceId: 'study',
      spaces: [
        { id: 'study', name: 'Study Space', wallpaper: 'https://images.unsplash.com/photo-1464802686167-b939a67e06a1?auto=format&fit=crop&q=80&w=2000', icon: 'Book' },
        { id: 'coding', name: 'Coding Space', wallpaper: 'https://images.unsplash.com/photo-1510511459019-5dee995d3ff4?auto=format&fit=crop&q=80&w=2000', icon: 'Code' },
        { id: 'chill', name: 'Chill Space', wallpaper: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=2000', icon: 'Coffee' },
      ],
      isMissionControlOpen: false,
      isSpotlightOpen: false,
      isLaunchpadOpen: false,
      windows: [],
      zCounter: 10,

      setBooted: (val) => set({ isBooted: val }),
      setBootProgress: (val) => set({ bootProgress: val }),
      setActiveSpace: (id) => set({ activeSpaceId: id, isMissionControlOpen: false }),
      setMissionControl: (isOpen) => set({ isMissionControlOpen: isOpen }),
      setSpotlightOpen: (isOpen) => set({ isSpotlightOpen: isOpen }),
      setLaunchpad: (isOpen) => set({ isLaunchpadOpen: isOpen }),
      
      addSpace: (name, wallpaper) => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({
          spaces: [...state.spaces, { id, name, wallpaper, icon: 'Layout' }]
        }));
      },

      removeSpace: (id) => set((state) => ({
        spaces: state.spaces.filter(s => s.id !== id),
        activeSpaceId: state.activeSpaceId === id ? state.spaces[0].id : state.activeSpaceId
      })),

      openWindow: (appId, title, icon) => {
        const { windows, zCounter } = get();
        const existing = windows.find(w => w.component === appId);
        
        if (existing) {
          get().focusWindow(existing.id);
          return;
        }

        const newWindow: WindowInstance = {
          id: Math.random().toString(36).substring(7),
          title,
          icon,
          component: appId,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          isAlwaysOnTop: false,
          zIndex: zCounter + 1,
          x: 100 + (windows.length * 20),
          y: 100 + (windows.length * 20),
          width: 800,
          height: 600,
        };

        set({ 
          windows: [...windows, newWindow],
          zCounter: zCounter + 1
        });
      },

      closeWindow: (id) => set((state) => ({
        windows: state.windows.filter(w => w.id !== id)
      })),

      focusWindow: (id) => {
        const { zCounter } = get();
        set((state) => ({
          windows: state.windows.map(w => 
            w.id === id ? { ...w, zIndex: zCounter + 1, isMinimized: false } : w
          ),
          zCounter: zCounter + 1
        }));
      },

      minimizeWindow: (id) => set((state) => ({
        windows: state.windows.map(w => 
          w.id === id ? { ...w, isMinimized: true } : w
        )
      })),

      toggleMaximize: (id) => set((state) => ({
        windows: state.windows.map(w => 
          w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
        )
      })),

      toggleAlwaysOnTop: (id) => set((state) => ({
        windows: state.windows.map(w => 
          w.id === id ? { ...w, isAlwaysOnTop: !w.isAlwaysOnTop, zIndex: !w.isAlwaysOnTop ? 9999 : state.zCounter } : w
        )
      })),

      updateWindowPos: (id, x, y) => set((state) => ({
        windows: state.windows.map(w => 
          w.id === id ? { ...w, x, y } : w
        )
      })),

      updateWindowSize: (id, width, height) => set((state) => ({
        windows: state.windows.map(w => 
          w.id === id ? { ...w, width, height } : w
        )
      })),
    }),
    {
      name: 'studyn-os-state',
      partialize: (state) => ({
        windows: state.windows,
        activeSpaceId: state.activeSpaceId,
        spaces: state.spaces,
        zCounter: state.zCounter
      }),
    }
  )
);

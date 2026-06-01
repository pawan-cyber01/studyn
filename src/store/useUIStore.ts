import { create } from 'zustand';

interface UIState {
  isControlPanelOpen: boolean;
  isWidgetPickerOpen: boolean;
  brightness: number;
  volume: number;
  isWifiEnabled: boolean;
  isBluetoothEnabled: boolean;
  isDoNotDisturbEnabled: boolean;
  isDailySpinOpen: boolean;
  
  // Actions
  setControlPanelOpen: (open: boolean) => void;
  setWidgetPickerOpen: (open: boolean) => void;
  setDailySpinOpen: (open: boolean) => void;
  setBrightness: (val: number) => void;
  setVolume: (val: number) => void;
  toggleWifi: () => void;
  toggleBluetooth: () => void;
  toggleDoNotDisturb: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isControlPanelOpen: false,
  isWidgetPickerOpen: false,
  brightness: 80,
  volume: 50,
  isWifiEnabled: true,
  isBluetoothEnabled: false,
  isDailySpinOpen: false,
  isDoNotDisturbEnabled: false,

  setControlPanelOpen: (open) => set({ isControlPanelOpen: open }),
  setWidgetPickerOpen: (open) => set({ isWidgetPickerOpen: open }),
  setDailySpinOpen: (open) => set({ isDailySpinOpen: open }),
  setBrightness: (val) => set({ brightness: val }),
  setVolume: (val) => set({ volume: val }),
  toggleWifi: () => set((state) => ({ isWifiEnabled: !state.isWifiEnabled })),
  toggleBluetooth: () => set((state) => ({ isBluetoothEnabled: !state.isBluetoothEnabled })),
  toggleDoNotDisturb: () => set((state) => ({ isDoNotDisturbEnabled: !state.isDoNotDisturbEnabled })),
}));

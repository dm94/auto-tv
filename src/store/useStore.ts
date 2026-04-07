import { create } from 'zustand';
import { Channel, Program } from '../types';
import { CHANNELS, ALL_PROGRAMS } from '../data/mockData';

interface AppState {
  // Canales y Programación estática
  channels: Channel[];
  programs: Program[];
  
  // Estado actual del usuario
  currentChannelId: string;
  isGuideOpen: boolean;
  osdVisible: boolean;
  volume: number;
  isMuted: boolean;
  
  // Acciones
  setCurrentChannel: (id: string) => void;
  channelUp: () => void;
  channelDown: () => void;
  toggleGuide: () => void;
  closeGuide: () => void;
  showOSD: () => void;
  hideOSD: () => void;
  setVolume: (volume: number) => void;
  volumeUp: () => void;
  volumeDown: () => void;
  toggleMute: () => void;
  
  // Helpers
  getCurrentProgram: (channelId: string, timestamp: number) => Program | undefined;
}

export const useStore = create<AppState>((set, get) => ({
  channels: CHANNELS,
  programs: ALL_PROGRAMS,
  
  currentChannelId: CHANNELS[0].id,
  isGuideOpen: false,
  osdVisible: true, // Mostrar inicialmente
  volume: 1, // 100%
  isMuted: false,
  
  setCurrentChannel: (id: string) => {
    set({ currentChannelId: id, isGuideOpen: false });
    get().showOSD();
  },
  
  channelUp: () => {
    const { channels, currentChannelId } = get();
    const currentIndex = channels.findIndex(c => c.id === currentChannelId);
    const nextIndex = (currentIndex + 1) % channels.length;
    set({ currentChannelId: channels[nextIndex].id });
    get().showOSD();
  },
  
  channelDown: () => {
    const { channels, currentChannelId } = get();
    const currentIndex = channels.findIndex(c => c.id === currentChannelId);
    const prevIndex = (currentIndex - 1 + channels.length) % channels.length;
    set({ currentChannelId: channels[prevIndex].id });
    get().showOSD();
  },
  
  toggleGuide: () => set((state) => ({ isGuideOpen: !state.isGuideOpen })),
  closeGuide: () => set({ isGuideOpen: false }),
  
  showOSD: () => {
    set({ osdVisible: true });
    // Se manejará el auto-ocultado en el componente usando un timeout
  },
  hideOSD: () => set({ osdVisible: false }),
  
  setVolume: (volume: number) => {
    set({ volume: Math.max(0, Math.min(1, volume)), isMuted: false });
    get().showOSD();
  },
  volumeUp: () => {
    const { volume } = get();
    set({ volume: Math.min(1, volume + 0.1), isMuted: false });
    get().showOSD();
  },
  volumeDown: () => {
    const { volume } = get();
    set({ volume: Math.max(0, volume - 0.1), isMuted: false });
    get().showOSD();
  },
  toggleMute: () => {
    set((state) => ({ isMuted: !state.isMuted }));
    get().showOSD();
  },

  getCurrentProgram: (channelId: string, timestamp: number) => {
    const { programs } = get();
    return programs.find(
      p => p.channelId === channelId && timestamp >= p.startTime && timestamp < p.endTime
    );
  }
}));

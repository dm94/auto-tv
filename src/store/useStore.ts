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
  
  // Acciones
  setCurrentChannel: (id: string) => void;
  channelUp: () => void;
  channelDown: () => void;
  toggleGuide: () => void;
  closeGuide: () => void;
  showOSD: () => void;
  hideOSD: () => void;
  
  // Helpers
  getCurrentProgram: (channelId: string, timestamp: number) => Program | undefined;
}

export const useStore = create<AppState>((set, get) => ({
  channels: CHANNELS,
  programs: ALL_PROGRAMS,
  
  currentChannelId: CHANNELS[0].id,
  isGuideOpen: false,
  osdVisible: true, // Mostrar inicialmente
  
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
  
  getCurrentProgram: (channelId: string, timestamp: number) => {
    const { programs } = get();
    return programs.find(
      p => p.channelId === channelId && timestamp >= p.startTime && timestamp < p.endTime
    );
  }
}));

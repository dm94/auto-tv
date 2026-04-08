import { create } from 'zustand';
import { Channel, Program, VideoAsset } from '../types';
import { generateProgramsForChannel } from '../utils/programs';
import { sendEvent, AnalyticsEvent } from '../lib/page-tracking';

interface AppState {
  // Canales y Programación estática
  channels: Channel[];
  programs: Program[];
  isLoading: boolean;
  
  // Estado actual del usuario
  currentChannelId: string;
  isGuideOpen: boolean;
  osdVisible: boolean;
  volume: number;
  isMuted: boolean;
  
  // Acciones
  loadData: () => Promise<void>;
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
  channels: [],
  programs: [],
  isLoading: true,
  
  currentChannelId: '',
  isGuideOpen: false,
  osdVisible: true, // Mostrar inicialmente
  volume: 1, // 100%
  isMuted: true, // Empezar muteado para permitir autoplay en móviles

  loadData: async () => {
    try {
      const response = await fetch('/json/channels.json');
      const channels: Channel[] = await response.json();
      
      let allPrograms: Program[] = [];
      
      // Cargar videos de cada canal en paralelo
      const channelPromises = channels.map(async (channel) => {
        try {
          const res = await fetch(`/json/${channel.id}.json`);
          if (res.ok) {
            const videos: VideoAsset[] = await res.json();
            return generateProgramsForChannel(channel, videos);
          }
        } catch (e) {
          console.error(`Error loading videos for channel ${channel.id}:`, e);
        }
        return [];
      });
      
      const programsArrays = await Promise.all(channelPromises);
      allPrograms = programsArrays.flat();
      
      set({ 
        channels, 
        programs: allPrograms, 
        currentChannelId: channels.length > 0 ? channels[0].id : '',
        isLoading: false 
      });
    } catch (error) {
      console.error('Error loading channels:', error);
      set({ isLoading: false });
    }
  },
  
  setCurrentChannel: (id: string) => {
    set({ currentChannelId: id, isGuideOpen: false });
    get().showOSD();
    const channel = get().channels.find(c => c.id === id);
    if (channel) {
      sendEvent(AnalyticsEvent.CHANNEL_CHANGE, { channelId: channel.id, channelName: channel.name });
    }
  },
  
  channelUp: () => {
    const { channels, currentChannelId } = get();
    const currentIndex = channels.findIndex(c => c.id === currentChannelId);
    const nextIndex = (currentIndex + 1) % channels.length;
    const nextChannel = channels[nextIndex];
    set({ currentChannelId: nextChannel.id });
    get().showOSD();
    sendEvent(AnalyticsEvent.CHANNEL_CHANGE, { channelId: nextChannel.id, channelName: nextChannel.name });
  },
  
  channelDown: () => {
    const { channels, currentChannelId } = get();
    const currentIndex = channels.findIndex(c => c.id === currentChannelId);
    const prevIndex = (currentIndex - 1 + channels.length) % channels.length;
    const prevChannel = channels[prevIndex];
    set({ currentChannelId: prevChannel.id });
    get().showOSD();
    sendEvent(AnalyticsEvent.CHANNEL_CHANGE, { channelId: prevChannel.id, channelName: prevChannel.name });
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

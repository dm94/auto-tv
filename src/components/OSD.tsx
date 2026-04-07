import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

export const OSD: React.FC = () => {
  const { t } = useTranslation();
  const { currentChannelId, channels, programs, osdVisible, hideOSD, volume, isMuted, toggleMute, setVolume } = useStore();
  const [time, setTime] = useState(new Date());

  const currentChannel = channels.find(c => c.id === currentChannelId);
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (osdVisible) {
      const timeout = setTimeout(() => {
        hideOSD();
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [osdVisible, hideOSD, currentChannelId, volume, isMuted]);

  if (!currentChannel) return null;

  const now = time.getTime();
  const currentProgram = programs.find(
    p => p.channelId === currentChannelId && now >= p.startTime && now < p.endTime
  );

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div
      className={`absolute inset-0 pointer-events-none transition-opacity duration-500 z-40 ${
        osdVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute top-8 left-8 flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 shadow-2xl">
        <div 
          className="w-12 h-12 flex items-center justify-center rounded-lg text-white font-bold text-2xl"
          style={{ backgroundColor: currentChannel.color }}
        >
          {currentChannel.number}
        </div>
        <div>
          <h2 className="text-white text-2xl font-bold tracking-wide uppercase">
            {currentChannel.name}
          </h2>
          <p className="text-zinc-400 text-sm font-medium tracking-widest">
            {currentChannel.category}
          </p>
        </div>
      </div>

      <div className="absolute top-8 right-8 flex flex-col items-end gap-3 pointer-events-auto">
        <div className="flex items-center gap-4 bg-black/60 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 text-white shadow-xl hover:bg-black/80 transition-all">
          <button 
            onClick={toggleMute}
            title={t('home.mute')}
            className="hover:text-red-500 transition-colors flex items-center gap-2"
          >
            <VolumeIcon size={20} className={isMuted || volume === 0 ? "text-red-500" : "text-zinc-400"} />
            <span className="font-mono text-lg">{isMuted ? t('osd.mute') : `${Math.round(volume * 100)}%`}</span>
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 md:w-32 accent-white cursor-pointer"
            title={t('home.volume')}
          />
        </div>
        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-white font-mono text-xl shadow-xl">
          {format(time, 'HH:mm:ss')}
        </div>
      </div>

      {currentProgram && (
        <div className="absolute bottom-12 left-8 right-8 max-w-4xl mx-auto">
          <div className="bg-black/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl">
            <h3 className="text-zinc-400 text-sm font-bold tracking-widest uppercase mb-2">
              {t('osd.broadcastingNow')}
            </h3>
            <h1 className="text-white text-4xl font-bold truncate">
              {currentProgram.title}
            </h1>
            <div className="mt-4 w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-1000 ease-linear"
                style={{ 
                  width: `${Math.min(100, Math.max(0, ((now - currentProgram.startTime) / (currentProgram.endTime - currentProgram.startTime)) * 100))}%`,
                  backgroundColor: currentChannel.color
                }}
              />
            </div>
            <div className="flex justify-between text-zinc-400 text-xs font-mono mt-2">
              <span>{format(new Date(currentProgram.startTime), 'HH:mm')}</span>
              <span>{format(new Date(currentProgram.endTime), 'HH:mm')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

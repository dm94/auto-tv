import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { format, addMinutes, startOfHour, differenceInMinutes, isBefore, isAfter } from 'date-fns';
import { X, Tv, Clock, MonitorPlay } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export const Guide: React.FC = () => {
  const { t } = useTranslation();
  const { channels, programs, currentChannelId, setCurrentChannel, isGuideOpen, closeGuide } = useStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const guideRef = useRef<HTMLDivElement>(null);
  
  // Rango de visualización de la guía: Desde hace 1 hora hasta +4 horas
  const startViewTime = startOfHour(new Date(currentTime.getTime() - 60 * 60 * 1000));
  const endViewTime = addMinutes(startViewTime, 300); // 5 horas de rango

  // Timeline slots (cada 30 min)
  const timeSlots: Date[] = [];
  let currentSlot = startViewTime;
  while (currentSlot < endViewTime) {
    timeSlots.push(currentSlot);
    currentSlot = addMinutes(currentSlot, 30);
  }

  const PIXELS_PER_MINUTE = 6; // Ancho visual por minuto

  // Centrar la guía en el tiempo actual al abrir
  useEffect(() => {
    if (isGuideOpen && guideRef.current) {
      const minutesFromStart = differenceInMinutes(currentTime, startViewTime);
      const scrollPosition = (minutesFromStart * PIXELS_PER_MINUTE) - (window.innerWidth / 3);
      guideRef.current.scrollTo({ left: Math.max(0, scrollPosition), behavior: 'smooth' });
    }
  }, [isGuideOpen]);

  // Actualizar la línea de tiempo cada minuto
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!isGuideOpen) return null;

  const nowMinutesFromStart = differenceInMinutes(currentTime, startViewTime);

  return (
    <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl z-50 flex flex-col text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <MonitorPlay size={32} className="text-zinc-300" />
          <div>
            <h1 className="text-2xl font-bold tracking-widest uppercase">{t('guide.title')}</h1>
            <p className="text-zinc-500 font-mono text-sm">{format(currentTime, 'EEEE, d MMM - HH:mm')}</p>
          </div>
        </div>
        <button 
          onClick={closeGuide}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Guía Principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Columna Izquierda: Canales */}
        <div className="w-64 shrink-0 bg-black/50 border-r border-white/10 flex flex-col z-20 shadow-2xl relative">
          <div className="h-16 shrink-0 border-b border-white/10 flex items-center justify-center text-zinc-500 text-xs font-bold tracking-widest uppercase">
            {t('guide.channels')}
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
            {channels.map((channel) => {
              const Icon = (LucideIcons as any)[channel.iconName] || Tv;
              const isCurrent = channel.id === currentChannelId;
              
              return (
                <button
                  key={channel.id}
                  onClick={() => {
                    setCurrentChannel(channel.id);
                  }}
                  className={`w-full h-24 border-b border-white/5 flex items-center px-4 gap-4 transition-colors text-left hover:bg-white/5
                    ${isCurrent ? 'bg-white/10 border-l-4' : 'border-l-4 border-l-transparent'}
                  `}
                  style={{ borderLeftColor: isCurrent ? channel.color : 'transparent' }}
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: channel.color + '20', color: channel.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-lg truncate">{channel.name}</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-widest">{channel.number} • {channel.category}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Área Derecha: Parrilla de Programación */}
        <div className="flex-1 overflow-x-auto relative bg-zinc-900/50" ref={guideRef}>
          {/* Header de Tiempo */}
          <div className="h-16 flex border-b border-white/10 sticky top-0 bg-zinc-950/90 z-10 w-max">
            {timeSlots.map((slot, i) => (
              <div 
                key={i}
                className="shrink-0 flex flex-col justify-end pb-2 border-l border-white/10 px-3 text-zinc-500 font-mono text-sm"
                style={{ width: `${30 * PIXELS_PER_MINUTE}px` }}
              >
                {format(slot, 'HH:mm')}
              </div>
            ))}
          </div>

          {/* Línea del Tiempo Actual */}
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-30 pointer-events-none shadow-[0_0_10px_rgba(239,68,68,0.8)]"
            style={{ left: `${nowMinutesFromStart * PIXELS_PER_MINUTE}px` }}
          >
            <div className="absolute -left-1.5 -top-1 w-3 h-3 bg-red-500 rounded-full" />
          </div>

          {/* Programas */}
          <div className="relative w-max pb-32">
            {channels.map((channel, idx) => {
              // Filtrar programas del canal que caen en el rango de visión
              const channelPrograms = programs.filter(p => 
                p.channelId === channel.id &&
                p.endTime > startViewTime.getTime() &&
                p.startTime < endViewTime.getTime()
              );

              return (
                <div key={channel.id} className="h-24 border-b border-white/5 relative w-full flex items-center">
                  {channelPrograms.map(prog => {
                    const startMin = Math.max(0, differenceInMinutes(new Date(prog.startTime), startViewTime));
                    const endMin = Math.min(
                      differenceInMinutes(endViewTime, startViewTime),
                      differenceInMinutes(new Date(prog.endTime), startViewTime)
                    );
                    const width = Math.max(10, (endMin - startMin) * PIXELS_PER_MINUTE);
                    const left = startMin * PIXELS_PER_MINUTE;
                    
                    const isNow = currentTime.getTime() >= prog.startTime && currentTime.getTime() < prog.endTime;
                    const isPast = currentTime.getTime() >= prog.endTime;

                    return (
                      <div
                        key={prog.id}
                        className={`absolute top-1 bottom-1 rounded-md p-3 overflow-hidden border transition-all cursor-pointer hover:brightness-125
                          ${isPast ? 'bg-zinc-800/40 border-zinc-700/50 text-zinc-500' : 
                            isNow ? 'bg-zinc-800 border-white/30 text-white shadow-lg' : 
                            'bg-zinc-900 border-zinc-800 text-zinc-300'
                          }
                        `}
                        style={{
                          left: `${left}px`,
                          width: `${width - 4}px`, // -4 para el gap visual
                        }}
                        onClick={() => {
                          if (!isPast) {
                            setCurrentChannel(channel.id);
                          }
                        }}
                      >
                        <h4 className="font-bold text-sm truncate">{prog.title}</h4>
                        <div className="flex items-center gap-2 mt-1 opacity-70">
                          <Clock size={12} />
                          <span className="text-xs font-mono">
                            {format(new Date(prog.startTime), 'HH:mm')} - {format(new Date(prog.endTime), 'HH:mm')}
                          </span>
                        </div>
                        {isNow && (
                          <div className="absolute top-0 right-0 bottom-0 w-1" style={{ backgroundColor: channel.color }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect } from 'react';
import { Player } from '../components/Player';
import { OSD } from '../components/OSD';
import { Guide } from '../components/Guide';
import { useStore } from '../store/useStore';
import { ListVideo, Volume2, VolumeX } from 'lucide-react';

export const Home: React.FC = () => {
  const { channelUp, channelDown, toggleGuide, isGuideOpen, volume, isMuted, volumeUp, volumeDown, toggleMute, setVolume } = useStore();

  // Manejo de teclado para hacer "zapping"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si la guía está abierta y queremos navegar en la guía
      // (Para simplificar, permitiremos subir y bajar canal con flechas siempre)
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        channelUp();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        channelDown();
      } else if (e.key === 'ArrowRight' || e.key === '+') {
        e.preventDefault();
        volumeUp();
      } else if (e.key === 'ArrowLeft' || e.key === '-') {
        e.preventDefault();
        volumeDown();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'g' || e.key === 'G' || e.key === 'Escape') {
        e.preventDefault();
        toggleGuide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [channelUp, channelDown, toggleGuide, isGuideOpen, volumeUp, volumeDown, toggleMute]);

  // Manejo de scroll para hacer "zapping" (opcional pero interesante)
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    
    const handleWheel = (e: WheelEvent) => {
      if (isGuideOpen) return;
      
      if (e.deltaY > 50) {
        channelDown();
      } else if (e.deltaY < -50) {
        channelUp();
      }
    };
    
    const throttledWheel = (e: WheelEvent) => {
      if (timeout === undefined) {
        handleWheel(e);
        timeout = setTimeout(() => {
          timeout = undefined;
        }, 1000); // 1s entre cambios de canal por scroll
      }
    };

    window.addEventListener('wheel', throttledWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', throttledWheel);
      clearTimeout(timeout);
    };
  }, [channelUp, channelDown, isGuideOpen]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      <Player />
      <OSD />
      <Guide />

      {/* Controles Táctiles/Mouse en pantalla (opcional, para móvil o sin teclado) */}
      {!isGuideOpen && (
        <>
          <button 
            className="absolute top-0 left-0 right-0 h-1/4 opacity-0 hover:opacity-10 transition-opacity bg-gradient-to-b from-white/20 to-transparent z-20 cursor-n-resize"
            onClick={channelUp}
            title="Canal Anterior (Flecha Arriba)"
          />
          <button 
            className="absolute bottom-0 left-0 right-0 h-1/4 opacity-0 hover:opacity-10 transition-opacity bg-gradient-to-t from-white/20 to-transparent z-20 cursor-s-resize"
            onClick={channelDown}
            title="Canal Siguiente (Flecha Abajo)"
          />
          
          <button 
            className="absolute bottom-8 right-8 bg-black/60 hover:bg-black/80 backdrop-blur-md p-4 rounded-full border border-white/10 text-white z-30 transition-all shadow-2xl hover:scale-110 active:scale-95 group"
            onClick={toggleGuide}
            title="Guía de TV (G)"
          >
            <ListVideo size={28} className="group-hover:text-red-500 transition-colors" />
          </button>

          {/* Controles de Volumen en pantalla */}
          <div className="absolute bottom-8 left-8 flex items-center gap-4 bg-black/60 backdrop-blur-md p-4 rounded-full border border-white/10 text-white z-30 shadow-2xl hover:bg-black/80 transition-all">
            <button 
              onClick={toggleMute}
              title="Silenciar (M)"
              className="hover:text-red-500 transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 md:w-32 accent-white cursor-pointer"
              title="Volumen (Flechas Izquierda/Derecha o +/-)"
            />
          </div>
        </>
      )}
    </div>
  );
};

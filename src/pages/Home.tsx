import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Player } from '../components/Player';
import { OSD } from '../components/OSD';
import { Guide } from '../components/Guide';
import { useStore } from '../store/useStore';
import { ListVideo, VolumeX } from 'lucide-react';

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const { channelUp, channelDown, toggleGuide, isGuideOpen, volumeUp, volumeDown, toggleMute, loadData, isLoading, hasInteracted, setHasInteracted, isMuted } = useStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Manejo de teclado para hacer "zapping"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLoading) return;
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
  }, [channelUp, channelDown, toggleGuide, isGuideOpen, volumeUp, volumeDown, toggleMute, isLoading]);

  // Manejo de scroll para hacer "zapping" (opcional pero interesante)
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    
    const handleWheel = (e: WheelEvent) => {
      if (isGuideOpen || isLoading) return;
      
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
  }, [channelDown, channelUp, isGuideOpen, isLoading]);

  const [touchStart, setTouchStart] = React.useState<{x: number, y: number} | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<{x: number, y: number} | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchEndEvent = () => {
    if (!touchStart || !touchEnd) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    
    // Si el movimiento fue más vertical que horizontal
    if (Math.abs(distanceY) > Math.abs(distanceX)) {
      if (distanceY > minSwipeDistance) {
        // Swipe Up -> Siguiente canal (como en TikTok)
        channelUp();
      } else if (distanceY < -minSwipeDistance) {
        // Swipe Down -> Canal anterior
        channelDown();
      }
    } else {
      // Swipe Horizontal opcional (ej: volumen o menú)
      if (distanceX > minSwipeDistance) {
        // Swipe Left
        toggleGuide();
      } else if (distanceX < -minSwipeDistance) {
        // Swipe Right
        // toggleGuide(); // o algo más
      }
    }
  };

  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted();
      if (useStore.getState().isMuted) {
        toggleMute();
      }
    } else {
      useStore.getState().showOSD();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-black text-white">
        <div className="animate-pulse flex flex-col items-center p-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-t-red-600 border-white/20 rounded-full animate-spin mb-4"></div>
          <p className="text-sm sm:text-base">{t('home.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden select-none"
      onClick={handleInteraction}
    >
      <Player />
      <OSD />
      <Guide />

      {/* Capa de interacción inicial para unmute en móvil */}
      {!hasInteracted && isMuted && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
          <div className="bg-black/80 p-6 rounded-3xl border border-white/10 flex flex-col items-center shadow-2xl animate-pulse">
            <VolumeX className="w-16 h-16 text-white mb-4" />
            <h2 className="text-white text-xl sm:text-2xl font-bold">{t('home.tapToUnmute', 'Toca para activar el sonido')}</h2>
          </div>
        </div>
      )}

      {/* Controles Táctiles/Mouse en pantalla para hacer Zapping */}
      {!isGuideOpen && (
        <>
          <div 
            className="absolute inset-0 z-20"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEndEvent}
          />
          
          <button 
            className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 bg-black/60 hover:bg-black/80 backdrop-blur-md p-3 sm:p-4 rounded-full border border-white/10 text-white z-30 transition-all shadow-2xl hover:scale-110 active:scale-95 group pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              toggleGuide();
            }}
            title={t('home.tvGuide')}
          >
            <ListVideo className="w-6 h-6 sm:w-7 sm:h-7 group-hover:text-red-500 transition-colors" />
          </button>
        </>
      )}
    </div>
  );
};

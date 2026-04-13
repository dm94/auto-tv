import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Player } from '../components/Player';
import { OSD } from '../components/OSD';
import { Guide } from '../components/Guide';
import { useStore } from '../store/useStore';
import { ListVideo, Volume2, ChevronUp, ChevronDown, Maximize2, Minimize2 } from 'lucide-react';
import { usePageTracking } from "../lib/page-tracking";


export const Home: React.FC = () => {
  const { t } = useTranslation();
  const { channelUp, channelDown, toggleGuide, isGuideOpen, volumeUp, volumeDown, toggleMute, loadData, isLoading, showOSD, isMuted, osdVisible } = useStore();
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(document.fullscreenElement !== null);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const targetElement = containerRef.current;

    if (!targetElement) {
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await targetElement.requestFullscreen();
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  usePageTracking();

  useEffect(() => {
    window.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      window.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

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
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        void toggleFullscreen();
      } else if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          return;
        }
        e.preventDefault();
        toggleGuide();
      } else if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        toggleGuide();
      } else {
        showOSD();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [channelUp, channelDown, toggleGuide, isGuideOpen, volumeUp, volumeDown, toggleMute, isLoading, showOSD, toggleFullscreen]);

  // Manejo de scroll para hacer "zapping" (opcional pero interesante)
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    
    const handleWheel = (e: WheelEvent) => {
      if (isGuideOpen || isLoading) return;
      
      if (e.deltaY > 50) {
        channelDown();
      } else if (e.deltaY < -50) {
        channelUp();
      } else {
        showOSD();
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
  }, [channelDown, channelUp, isGuideOpen, isLoading, showOSD]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isGuideOpen) return;
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isGuideOpen || !touchStart) return;
    const touchEnd = e.changedTouches[0].clientY;
    const distance = touchStart - touchEnd;
    const isSwipe = Math.abs(distance) > 50;

    if (isSwipe) {
      if (distance > 0) {
        // Swipe up
        channelDown();
      } else {
        // Swipe down
        channelUp();
      }
    } else {
      // Tap
      showOSD();
    }
    setTouchStart(null);
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
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={() => !isGuideOpen && showOSD()}
    >
      <Player />
      <OSD />
      <Guide />

      {/* Controles Táctiles/Mouse en pantalla (opcional, para móvil o sin teclado) */}
      {!isGuideOpen && (
        <>
          {/* Botones visibles para cambiar de canal en móvil cuando el OSD está abierto */}
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-30 transition-opacity duration-300 ${osdVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <button 
              className="bg-black/60 hover:bg-black/80 backdrop-blur-md p-3 sm:p-4 rounded-full border border-white/10 text-white transition-all shadow-2xl active:scale-95 group"
              onClick={(e) => { e.stopPropagation(); channelUp(); }}
              title={t('home.prevChannel')}
            >
              <ChevronUp className="w-6 h-6 sm:w-7 sm:h-7 group-hover:text-red-500" />
            </button>
            <button 
              className="bg-black/60 hover:bg-black/80 backdrop-blur-md p-3 sm:p-4 rounded-full border border-white/10 text-white transition-all shadow-2xl active:scale-95 group"
              onClick={(e) => { e.stopPropagation(); channelDown(); }}
              title={t('home.nextChannel')}
            >
              <ChevronDown className="w-6 h-6 sm:w-7 sm:h-7 group-hover:text-red-500" />
            </button>
          </div>

          {/* Botón de desmuteo cuando inicia la app */}
          {isMuted && (
            <button
              onClick={(e) => { e.stopPropagation(); toggleMute(); }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 hover:bg-black backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-white z-40 flex flex-col items-center gap-3 transition-all shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-pulse"
            >
              <Volume2 className="w-12 h-12 text-red-500" />
              <span className="font-bold text-lg tracking-wider uppercase">{t('home.tapToUnmute', 'TAP TO UNMUTE')}</span>
            </button>
          )}

          <button
            className="absolute bottom-20 right-6 sm:bottom-24 sm:right-8 bg-black/60 hover:bg-black/80 backdrop-blur-md p-3 sm:p-4 rounded-full border border-white/10 text-white z-30 transition-all shadow-2xl hover:scale-110 active:scale-95 group pointer-events-auto"
            onClick={(e) => { e.stopPropagation(); void toggleFullscreen(); }}
            title={isFullscreen ? t('home.exitFullscreen') : t('home.enterFullscreen')}
            aria-label={isFullscreen ? t('home.exitFullscreen') : t('home.enterFullscreen')}
          >
            {isFullscreen ? (
              <Minimize2 className="w-6 h-6 sm:w-7 sm:h-7 group-hover:text-red-500 transition-colors" />
            ) : (
              <Maximize2 className="w-6 h-6 sm:w-7 sm:h-7 group-hover:text-red-500 transition-colors" />
            )}
          </button>

          <button
            className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 bg-black/60 hover:bg-black/80 backdrop-blur-md p-3 sm:p-4 rounded-full border border-white/10 text-white z-30 transition-all shadow-2xl hover:scale-110 active:scale-95 group pointer-events-auto"
            onClick={(e) => { e.stopPropagation(); toggleGuide(); }}
            title={t('home.tvGuide')}
          >
            <ListVideo className="w-6 h-6 sm:w-7 sm:h-7 group-hover:text-red-500 transition-colors" />
          </button>
        </>
      )}
    </div>
  );
};

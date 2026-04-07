import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { useStore } from '../store/useStore';

export const Player: React.FC = () => {
  const currentChannelId = useStore((state) => state.currentChannelId);
  const programs = useStore((state) => state.programs);
  const volume = useStore((state) => state.volume);
  const isMuted = useStore((state) => state.isMuted);
  
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [currentProgramId, setCurrentProgramId] = useState<string | null>(null);
  const [startSeconds, setStartSeconds] = useState<number>(0);
  
  const playerRef = useRef<ReactPlayer>(null);

  // Calcula qué se está emitiendo AHORA y ajusta el video
  useEffect(() => {
    const checkProgram = () => {
      const now = Date.now();
      const currentProgram = programs.find(
        p => p.channelId === currentChannelId && now >= p.startTime && now < p.endTime
      );

      if (currentProgram) {
        // Si cambió el ID del programa (nuevo bloque en la guía), o es la primera vez
        if (currentProgram.id !== currentProgramId) {
          setCurrentProgramId(currentProgram.id);
          setCurrentVideoId(currentProgram.videoId);
          
          const elapsedSeconds = Math.floor((now - currentProgram.startTime) / 1000);
          setStartSeconds(elapsedSeconds);
          
          if (playerRef.current) {
            playerRef.current.seekTo(elapsedSeconds, 'seconds');
          }
        }
      } else {
        // Fallback si no hay programa (loop simple al primer video del canal)
        const firstProgram = programs.find(p => p.channelId === currentChannelId);
        if (firstProgram && firstProgram.id !== currentProgramId) {
          setCurrentProgramId(firstProgram.id);
          setCurrentVideoId(firstProgram.videoId);
          setStartSeconds(0);
        }
      }
    };

    // Revisar inmediatamente al montar/cambiar de canal
    checkProgram();

    // Revisar cada segundo para saltar al siguiente video automáticamente como una TV
    const intervalId = setInterval(checkProgram, 1000);
    return () => clearInterval(intervalId);
  }, [currentChannelId, programs, currentProgramId]);

  if (!currentVideoId) return <div className="bg-black w-full h-full" />;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <ReactPlayer
        key={currentProgramId}
        ref={playerRef}
        url={`https://www.youtube.com/watch?v=${currentVideoId}`}
        width="100%"
        height="100%"
        playing={true}
        volume={volume}
        muted={isMuted}
        controls={false}
        config={{
          youtube: {
            playerVars: {
              autoplay: 1,
              controls: 0,
              disablekb: 1,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              iv_load_policy: 3,
              fs: 0,
              start: startSeconds,
            }
          }
        }}
        // Style adjustments for full screen bleed to hide youtube controls
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1.3)', // Escala para esconder logo de YT
          pointerEvents: 'none',
        }}
        onEnded={() => {
          // Si el video termina "antes de tiempo" por cualquier razón (ej. stream en vivo real),
          // forzamos recarga. En un escenario real, recalcularíamos el tiempo.
        }}
      />
      {/* Capa de protección para evitar clics al video */}
      <div className="absolute inset-0 z-10 bg-transparent pointer-events-auto" />
    </div>
  );
};

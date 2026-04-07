import { Channel, VideoAsset, Program } from '../types';
import { startOfDay } from 'date-fns';

// Generamos una programación circular y continua anclada al Epoch (para que actúe como una TV real)
export function generateProgramsForChannel(channel: Channel, videos: VideoAsset[], baseDate = new Date()): Program[] {
  const programs: Program[] = [];
  
  if (!videos || videos.length === 0) return programs;

  // 1. Calcular duración total de la lista de reproducción en milisegundos
  const totalPlaylistDurationMs = videos.reduce((acc, v) => acc + (v.durationSeconds * 1000), 0);
  
  // 2. Ancla fija en el pasado (Unix Epoch: 1 Enero 1970) para que el ciclo sea continuo e independiente de cuándo se abre
  const FIXED_ANCHOR = 0;

  // 3. Empezamos a generar desde 24h antes de la fecha actual para cubrir la guía de programación (ayer)
  const targetStart = startOfDay(new Date(baseDate.getTime() - 24 * 60 * 60 * 1000)).getTime();

  // 4. Calcular cuántos ciclos completos han pasado desde el ancla hasta el targetStart
  const elapsedSinceAnchor = Math.max(0, targetStart - FIXED_ANCHOR);
  const cycles = Math.floor(elapsedSinceAnchor / totalPlaylistDurationMs);
  
  // 5. El punto de inicio exacto del ciclo actual que cae justo antes de targetStart
  const currentAnchor = FIXED_ANCHOR + cycles * totalPlaylistDurationMs;
  
  // 6. Generar programación desde currentAnchor hasta targetStart + 72 horas (para cubrir hoy y mañana)
  const targetEndTime = targetStart + 72 * 60 * 60 * 1000;
  
  let currentStartTime = currentAnchor;
  let videoIndex = 0;
  let absoluteVideoIndex = cycles * videos.length;
  
  while (currentStartTime < targetEndTime) {
    const video = videos[videoIndex % videos.length];
    const currentEndTime = currentStartTime + video.durationSeconds * 1000;
    
    // Solo añadimos los programas que terminan después de nuestro punto de interés (targetStart)
    if (currentEndTime > targetStart) {
      programs.push({
        id: `${channel.id}-${absoluteVideoIndex}`,
        channelId: channel.id,
        videoId: video.videoId,
        title: video.title,
        durationSeconds: video.durationSeconds,
        startTime: currentStartTime,
        endTime: currentEndTime,
      });
    }
    
    currentStartTime = currentEndTime;
    videoIndex++;
    absoluteVideoIndex++;
  }
  
  return programs;
}

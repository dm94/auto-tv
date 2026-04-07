import { Channel, VideoAsset, Program } from '../types';
import { startOfDay } from 'date-fns';

// Generamos una programación circular para las últimas 24h y próximas 48h para un canal específico
export function generateProgramsForChannel(channel: Channel, videos: VideoAsset[], baseDate = new Date()): Program[] {
  const programs: Program[] = [];
  
  if (!videos || videos.length === 0) return programs;

  // Empezamos desde ayer para cubrir el "ahora" de forma segura, hasta mañana.
  const startAnchor = startOfDay(new Date(baseDate.getTime() - 24 * 60 * 60 * 1000));
  
  let currentStartTime = startAnchor.getTime();
  
  // Generar programación iterando sobre los videos hasta cubrir 72 horas en total
  const targetEndTime = startAnchor.getTime() + 72 * 60 * 60 * 1000;
  
  let videoIndex = 0;
  let programIdCounter = 1;
  
  while (currentStartTime < targetEndTime) {
    const video = videos[videoIndex % videos.length];
    const currentEndTime = currentStartTime + video.durationSeconds * 1000;
    
    programs.push({
      id: `${channel.id}-p${programIdCounter}`,
      channelId: channel.id,
      videoId: video.videoId,
      title: video.title,
      durationSeconds: video.durationSeconds,
      startTime: currentStartTime,
      endTime: currentEndTime,
    });
    
    currentStartTime = currentEndTime;
    videoIndex++;
    programIdCounter++;
  }
  
  return programs;
}

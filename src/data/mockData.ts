import { Channel, VideoAsset, Program } from '../types';
import { startOfDay, addSeconds } from 'date-fns';

export const CHANNELS: Channel[] = [
  { id: 'c1', number: 1, name: 'Noticias 24/7', category: 'Noticias', iconName: 'Newspaper', color: '#dc2626' },
  { id: 'c2', number: 2, name: 'Tech Talk', category: 'Tecnología', iconName: 'Cpu', color: '#2563eb' },
  { id: 'c3', number: 3, name: 'Sports Hub', category: 'Deportes', iconName: 'Trophy', color: '#16a34a' },
  { id: 'c4', number: 4, name: 'Lofi Beats', category: 'Música', iconName: 'Music', color: '#9333ea' },
  { id: 'c5', number: 5, name: 'Code & Dev', category: 'Programación', iconName: 'Code', color: '#f59e0b' },
  { id: 'c6', number: 6, name: 'Gaming Arena', category: 'Gaming', iconName: 'Gamepad2', color: '#8b5cf6' },
  { id: 'c7', number: 7, name: 'AI & ML', category: 'Tecnología', iconName: 'Bot', color: '#0d9488' },
  { id: 'c8', number: 8, name: 'Lifestyle', category: 'Lifestyle', iconName: 'Coffee', color: '#f43f5e' },
];

// Unos videos de ejemplo por canal
const CHANNEL_VIDEOS: Record<string, VideoAsset[]> = {
  c1: [
    { videoId: 'dQw4w9WgXcQ', title: 'Noticias de la Mañana', durationSeconds: 212 },
    { videoId: 'jfKfPfyJRdk', title: 'Boletín Internacional', durationSeconds: 4320 }, // 1h+ (lofi live)
    { videoId: '1oeT2NQeKQw', title: 'Mesa de Debate', durationSeconds: 1500 },
  ],
  c2: [
    { videoId: 'p2wE17D_3uA', title: 'Tech Review Semanal', durationSeconds: 640 },
    { videoId: 'sBxsL_m_Y0M', title: 'Unboxing: Últimos Gadgets', durationSeconds: 980 },
    { videoId: 'YvT_gqs5ETk', title: 'El Futuro de la IA', durationSeconds: 1200 },
  ],
  c3: [
    { videoId: '9GJDqlb1bT0', title: 'Resumen Deportivo', durationSeconds: 840 },
    { videoId: '2bQG8v8ktz4', title: 'Mejores Jugadas del Mes', durationSeconds: 520 },
    { videoId: 'U_A4k-73uQk', title: 'Entrevista Exclusiva', durationSeconds: 1040 },
  ],
  c4: [
    { videoId: 'jfKfPfyJRdk', title: 'Lofi Girl - beats to relax/study to', durationSeconds: 36000 }, // Emisión muy larga
    { videoId: '4xDzrJKXOOY', title: 'Synthwave Radio', durationSeconds: 18000 },
  ],
  c5: [
    { videoId: 'PkZNo7MFOUg', title: 'Aprende JavaScript en 1 Hora', durationSeconds: 3600 },
    { videoId: 'zJSY8tbf_ys', title: 'React Crash Course', durationSeconds: 4200 },
    { videoId: '8pDqJVdNa44', title: 'CSS Grid & Flexbox', durationSeconds: 2400 },
  ],
  c6: [
    { videoId: 'c1XGEQ4L_gY', title: 'Torneo Final de CS:GO', durationSeconds: 7200 },
    { videoId: 'v8v11zB4gG4', title: 'Speedrun Mario 64', durationSeconds: 1500 },
    { videoId: 'qicmG3-t29M', title: 'Top 10 RPGs', durationSeconds: 900 },
  ],
  c7: [
    { videoId: 't4mBv3Ym9yA', title: 'Machine Learning con Python', durationSeconds: 3200 },
    { videoId: 'AirVcjB3O_E', title: 'Redes Neuronales Explicadas', durationSeconds: 1500 },
    { videoId: 'k151N3r12A4', title: '¿Qué es ChatGPT?', durationSeconds: 800 },
  ],
  c8: [
    { videoId: 'B5q4z7A30c0', title: 'Rutina de Mañana', durationSeconds: 600 },
    { videoId: 'lB_T25X4w90', title: 'Minimalismo y Orden', durationSeconds: 850 },
    { videoId: 'o26O0Q_8m7s', title: 'Viaje por Japón', durationSeconds: 1200 },
  ],
};

// Generamos una programación circular para las últimas 24h y próximas 48h
export function generatePrograms(baseDate = new Date()): Program[] {
  const programs: Program[] = [];
  
  // Empezamos desde ayer para cubrir el "ahora" de forma segura, hasta mañana.
  const startAnchor = startOfDay(new Date(baseDate.getTime() - 24 * 60 * 60 * 1000));
  
  CHANNELS.forEach((channel) => {
    const videos = CHANNEL_VIDEOS[channel.id] || CHANNEL_VIDEOS['c1'];
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
  });
  
  return programs;
}

// Inicializar la programación global
export const ALL_PROGRAMS = generatePrograms();

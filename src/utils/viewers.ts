// Para simular la cantidad de espectadores que varían con el tiempo.
// Se puede hacer de manera determinista usando el canal y la hora actual o pseudo-aleatoria.

export function generateViewers(channelId: string, timestamp: number): number {
  // Hash muy simple usando el ID del canal y la hora actual (en ventanas de 5 minutos)
  const windowMs = 5 * 60 * 1000;
  const timeWindow = Math.floor(timestamp / windowMs);
  
  // Convertir string de channelId a int
  let hash = 0;
  for (let i = 0; i < channelId.length; i++) {
    hash = channelId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Pseudo-random value basado en canal y ventana de tiempo
  const pseudoRandom = Math.abs(Math.sin(hash * timeWindow));
  
  // Base viewers dependiendo del canal (ej. c1 tiene más, c8 tiene menos)
  const base = 50 + (Math.abs(hash) % 1500); 
  
  // Variación hasta +200 espectadores
  return Math.floor(base + (pseudoRandom * 200));
}

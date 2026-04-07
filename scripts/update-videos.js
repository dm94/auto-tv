import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.YOUTUBE_API_KEY;
const MAX_RESULTS = 10;

// Categorías basadas en los archivos c1.json a c8.json
const CATEGORIES = [
  { file: 'c1.json', query: 'noticias en vivo español' },
  { file: 'c2.json', query: 'tecnología review gadgets' },
  { file: 'c3.json', query: 'deportes resumen futbol' },
  { file: 'c4.json', query: 'lofi hip hop radio chill' },
  { file: 'c5.json', query: 'programación web tutorial' },
  { file: 'c6.json', query: 'gameplay español' },
  { file: 'c7.json', query: 'inteligencia artificial noticias' },
  { file: 'c8.json', query: 'vlog viaje rutina saludable' }
];

async function fetchVideosForCategory(query) {
  if (!API_KEY) {
    throw new Error('YOUTUBE_API_KEY is not defined in environment variables.');
  }

  // 1. Buscar videos (Search API)
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=${MAX_RESULTS}&key=${API_KEY}`;
  const searchRes = await fetch(searchUrl);
  
  if (!searchRes.ok) {
    throw new Error(`Error fetching search for "${query}": ${searchRes.statusText}`);
  }
  
  const searchData = await searchRes.json();
  const videoIds = searchData.items.map((item) => item.id.videoId);
  
  if (videoIds.length === 0) return [];

  // 2. Obtener duración de los videos (Videos API)
  const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds.join(',')}&key=${API_KEY}`;
  const videosRes = await fetch(videosUrl);
  
  if (!videosRes.ok) {
    throw new Error(`Error fetching details for "${query}": ${videosRes.statusText}`);
  }
  
  const videosData = await videosRes.json();
  
  return videosData.items.map((item) => {
    return {
      videoId: item.id,
      title: item.snippet.title,
      durationSeconds: parseIsoDuration(item.contentDetails.duration)
    };
  });
}

// Convierte duración ISO 8601 (ej. PT1H2M10S) a segundos
function parseIsoDuration(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  
  return hours * 3600 + minutes * 60 + seconds;
}

async function main() {
  if (!API_KEY) {
    console.warn('⚠️ YOUTUBE_API_KEY no encontrada. Por favor, configura esta variable de entorno.');
    console.warn('Simulando la ejecución (no se actualizarán los archivos).');
    process.exit(1); // Salir con error para que Github Actions lo detecte si falta la key
  }

  const outputDir = path.join(__dirname, '..', 'public', 'json');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const category of CATEGORIES) {
    console.log(`Buscando videos para: ${category.query}...`);
    try {
      const videos = await fetchVideosForCategory(category.query);
      if (videos.length > 0) {
        const filePath = path.join(outputDir, category.file);
        fs.writeFileSync(filePath, JSON.stringify(videos, null, 2) + '\n', 'utf8');
        console.log(`✅ ${category.file} actualizado con ${videos.length} videos.`);
      } else {
        console.log(`⚠️ No se encontraron videos para: ${category.query}`);
      }
    } catch (error) {
      console.error(`❌ Error actualizando ${category.file}:`, error.message);
      process.exit(1);
    }
  }
  
  console.log('🎉 Actualización completada.');
}

main();

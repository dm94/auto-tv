import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.YOUTUBE_API_KEY;
const MAX_RESULTS = 10;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      const res = await fetch(url, options);

      if (res.status === 429) {
        lastError = new Error(`Rate limited (429): ${res.statusText}`);
        if (i === maxRetries) break;

        const delay = Math.pow(2, i) * 1000;
        console.warn(`⚠️ Rate limited (429). Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await sleep(delay);
        continue;
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status} ${res.statusText}`);
      }

      return await res.json();
    } catch (error) {
      lastError = error;
      if (i === maxRetries) break;
      const delay = Math.pow(2, i) * 1000;
      console.warn(`⚠️ Fetch error: ${error.message}. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
      await sleep(delay);
    }
  }

  throw lastError;
}

// Categories based on files c1.json through c16.json
const CATEGORIES = [
  { file: 'c1.json', query: 'noticias españa, economía en español' },
  { file: 'c2.json', query: 'tecnología gadgets español' },
  { file: 'c3.json', query: 'deportes resumen' },
  { file: 'c4.json', query: 'lofi radio chill' },
  { file: 'c5.json', query: 'programación novedades tutorial español' },
  { file: 'c6.json', query: 'videojuegos novedades gameplay español' },
  { file: 'c7.json', query: 'inteligencia artificial noticias español' },
  { file: 'c8.json', query: 'vlog viaje rutina saludable español' },
  { file: 'c9.json', query: 'documentales naturaleza historia ciencia español' },
  { file: 'c10.json', query: 'trailers cine series películas español latino' },
  { file: 'c11.json', query: 'coches motos actualidad motor español' },
  { file: 'c12.json', query: 'recetas cocina' },
  { file: 'c13.json', query: 'comedia recopilaciones videos impactantes' },
  { file: 'c14.json', query: 'bricolaje diy life hacks' },
  { file: 'c15.json', query: 'películas clásicas completas en español' },
  { file: 'c16.json', query: 'música éxitos actualidad' }
];

async function fetchVideosForCategory(query) {
  if (!API_KEY) {
    throw new Error('YOUTUBE_API_KEY is not defined in environment variables.');
  }

  // 1. Search for videos (Search API)
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=${MAX_RESULTS}&key=${API_KEY}`;
  const searchData = await fetchWithRetry(searchUrl);

  const videoIds = searchData.items.map((item) => item.id.videoId);

  if (videoIds.length === 0) return [];

  // 2. Get video durations (Videos API)
  const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds.join(',')}&key=${API_KEY}`;
  const videosData = await fetchWithRetry(videosUrl);

  return videosData.items.map((item) => {
    return {
      videoId: item.id,
      title: item.snippet.title,
      durationSeconds: parseIsoDuration(item.contentDetails.duration)
    };
  });
}

function getPublishedAfterIso(days) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const publishedAfterDate = new Date(Date.now() - days * millisecondsPerDay);

  return publishedAfterDate.toISOString();
}

// Converts ISO 8601 duration (e.g. PT1H2M10S) to seconds
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
    console.warn('⚠️ YOUTUBE_API_KEY not found. Please set this environment variable.');
    console.warn('Simulation mode (files will not be updated).');
    process.exit(1); // Exit with error so GitHub Actions can detect the missing key
  }

  const outputDir = path.join(__dirname, '..', 'public', 'json');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const category of CATEGORIES) {
    console.log(`Searching videos for: ${category.query}...`);
    try {
      const videos = await fetchVideosForCategory(category.query);
      // Wait 1 second between categories to avoid burst rate limits
      await sleep(1000);
      if (videos.length > 0) {
        const filePath = path.join(outputDir, category.file);
        fs.writeFileSync(filePath, JSON.stringify(videos, null, 2) + '\n', 'utf8');
        console.log(`✅ ${category.file} updated with ${videos.length} videos.`);
      } else {
        console.log(`⚠️ No videos found for: ${category.query}`);
      }
    } catch (error) {
      console.error(`❌ Error updating ${category.file}:`, error.message);
      process.exit(1);
    }
  }

  console.log('🎉 Update completed.');
}

main();

const fs = require('fs');

const channels = {
  c1: [
    { videoId: "aqz-KE-bpKQ", title: "Noticias de la Mañana", durationSeconds: 596 },
    { videoId: "LXb3EKWsInQ", title: "Reportaje: Naturaleza en Peligro", durationSeconds: 314 },
    { videoId: "eRsGyueVLvQ", title: "Boletín Internacional", durationSeconds: 888 },
    { videoId: "jNQXAC9IVRw", title: "Breves Informativos", durationSeconds: 19 },
    { videoId: "R6MlUcmOul8", title: "Mesa de Debate", durationSeconds: 734 },
    { videoId: "v64KOxKVLVg", title: "Documental: Océanos", durationSeconds: 7200 }
  ],
  c2: [
    { videoId: "Y-rmzh0PI3c", title: "Tech Review Semanal", durationSeconds: 734 },
    { videoId: "WhWc3b3KhnY", title: "Unboxing: Últimos Gadgets", durationSeconds: 464 },
    { videoId: "mN0zPOpADL4", title: "El Futuro de la IA", durationSeconds: 231 },
    { videoId: "UXqq0ZvbOnk", title: "Análisis de Software", durationSeconds: 233 },
    { videoId: "Z4C82eyhwxc", title: "Gadget Express", durationSeconds: 150 },
    { videoId: "Bey4XXJAqS8", title: "Podcast Tecnológico", durationSeconds: 10920 }
  ],
  c3: [
    { videoId: "R6MlUcmOul8", title: "Resumen Deportivo", durationSeconds: 734 },
    { videoId: "ZROlljyKpBg", title: "Mejores Jugadas de la Semana", durationSeconds: 150 },
    { videoId: "SkVqJ1SGeL0", title: "Entrevista Exclusiva", durationSeconds: 150 },
    { videoId: "aqz-KE-bpKQ", title: "Análisis del Partido", durationSeconds: 596 },
    { videoId: "eRsGyueVLvQ", title: "Historia de los Mundiales", durationSeconds: 888 },
    { videoId: "v64KOxKVLVg", title: "Maratón Deportivo", durationSeconds: 7200 }
  ],
  c4: [
    { videoId: "Bey4XXJAqS8", title: "Lofi Relax 24/7", durationSeconds: 10920 },
    { videoId: "LXb3EKWsInQ", title: "Chill Beats para Estudiar", durationSeconds: 314 },
    { videoId: "Y-rmzh0PI3c", title: "Synthwave Mix", durationSeconds: 734 },
    { videoId: "WhWc3b3KhnY", title: "Jazz Hop Café", durationSeconds: 464 },
    { videoId: "v64KOxKVLVg", title: "Ambient Music", durationSeconds: 7200 }
  ],
  c5: [
    { videoId: "eRsGyueVLvQ", title: "Curso de React desde cero", durationSeconds: 888 },
    { videoId: "R6MlUcmOul8", title: "Aprende TypeScript", durationSeconds: 734 },
    { videoId: "mN0zPOpADL4", title: "Patrones de Diseño", durationSeconds: 231 },
    { videoId: "UXqq0ZvbOnk", title: "Tutorial de Node.js", durationSeconds: 233 },
    { videoId: "aqz-KE-bpKQ", title: "CSS Grid y Flexbox", durationSeconds: 596 },
    { videoId: "Bey4XXJAqS8", title: "Maratón de Programación", durationSeconds: 10920 }
  ],
  c6: [
    { videoId: "WhWc3b3KhnY", title: "Speedrun Mundial", durationSeconds: 464 },
    { videoId: "Z4C82eyhwxc", title: "Minecraft Survival", durationSeconds: 150 },
    { videoId: "Y-rmzh0PI3c", title: "Torneo de eSports", durationSeconds: 734 },
    { videoId: "ZROlljyKpBg", title: "Top 10 Juegos del Año", durationSeconds: 150 },
    { videoId: "SkVqJ1SGeL0", title: "Review de Consolas", durationSeconds: 150 },
    { videoId: "v64KOxKVLVg", title: "Gameplay sin Comentarios", durationSeconds: 7200 }
  ],
  c7: [
    { videoId: "mN0zPOpADL4", title: "Redes Neuronales Explicadas", durationSeconds: 231 },
    { videoId: "eRsGyueVLvQ", title: "Historia de la IA", durationSeconds: 888 },
    { videoId: "UXqq0ZvbOnk", title: "Machine Learning Práctico", durationSeconds: 233 },
    { videoId: "R6MlUcmOul8", title: "Ética en la Inteligencia Artificial", durationSeconds: 734 },
    { videoId: "aqz-KE-bpKQ", title: "Futuro de la Robótica", durationSeconds: 596 },
    { videoId: "Bey4XXJAqS8", title: "Conferencia AI 2024", durationSeconds: 10920 }
  ],
  c8: [
    { videoId: "LXb3EKWsInQ", title: "Vlog de Viajes: Costa Rica", durationSeconds: 314 },
    { videoId: "jNQXAC9IVRw", title: "Un Día en mi Vida", durationSeconds: 19 },
    { videoId: "Z4C82eyhwxc", title: "Recetas Saludables", durationSeconds: 150 },
    { videoId: "Y-rmzh0PI3c", title: "Rutina de Mañana", durationSeconds: 734 },
    { videoId: "WhWc3b3KhnY", title: "Decoración de Interiores", durationSeconds: 464 },
    { videoId: "v64KOxKVLVg", title: "Relajación y Meditación", durationSeconds: 7200 }
  ]
};

for (const [id, videos] of Object.entries(channels)) {
  fs.writeFileSync(`/workspace/public/json/${id}.json`, JSON.stringify(videos, null, 2));
  console.log(`Saved ${id}.json with ${videos.length} videos`);
}

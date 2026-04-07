import json
import subprocess

channels = [
    {"id": "c1", "query": "noticias documental mundo largo", "limit": 6},
    {"id": "c2", "query": "tecnologia review smartphone", "limit": 6},
    {"id": "c3", "query": "deportes resumen futbol largo", "limit": 6},
    {"id": "c4", "query": "lofi beats relax long", "limit": 6},
    {"id": "c5", "query": "curso programacion completo", "limit": 6},
    {"id": "c6", "query": "minecraft long gameplay no commentary", "limit": 6},
    {"id": "c7", "query": "inteligencia artificial documental largo", "limit": 6},
    {"id": "c8", "query": "travel vlog 4k cinematic", "limit": 6}
]

for ch in channels:
    print(f"Fetching videos for {ch['id']} ({ch['query']})...")
    cmd = [
        "yt-dlp",
        f"ytsearch{ch['limit']}:{ch['query']}",
        "--dump-json",
        "--match-filter", "duration > 300",  # Only longer videos
        "--no-playlist"
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        videos = []
        for line in result.stdout.strip().split('\n'):
            if not line: continue
            try:
                data = json.loads(line)
                duration = data.get('duration')
                if duration and int(duration) > 0:
                    videos.append({
                        "videoId": data.get('id'),
                        "title": data.get('title'),
                        "durationSeconds": int(duration)
                    })
            except Exception as e:
                pass
        
        # Write to JSON
        out_file = f"/workspace/public/json/{ch['id']}.json"
        with open(out_file, 'w') as f:
            json.dump(videos, f, indent=2, ensure_ascii=False)
        print(f"Saved {len(videos)} videos to {out_file}")
    except Exception as e:
        print(f"Error for {ch['id']}: {e}")


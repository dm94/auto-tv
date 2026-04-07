const https = require('https');

const videos = [
  "aqz-KE-bpKQ", "eRsGyueVLvQ", "R6MlUcmOul8", "Y-rmzh0PI3c", "WhWc3b3KhnY", 
  "mN0zPOpADL4", "UXqq0ZvbOnk", "iCvmsMzlF7o", "R1vskiVDwl4", "rfscVS0vtbw", 
  "bMknfKXIFA8", "1fueZCTYkpA", "LXb3EKWsInQ", "v64KOxKVLVg", "Bey4XXJAqS8",
  "jNQXAC9IVRw", "dQw4w9WgXcQ", "2g811Eo7K8U", "p2wE17D_3uA", "sBxsL_m_Y0M", "YvT_gqs5ETk"
];

async function checkVideo(id) {
  return new Promise((resolve) => {
    https.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`, (res) => {
      resolve({ id, status: res.statusCode });
    }).on('error', () => resolve({ id, status: 'error' }));
  });
}

async function run() {
  for (const id of videos) {
    const res = await checkVideo(id);
    console.log(`${res.id}: ${res.status}`);
  }
}
run();

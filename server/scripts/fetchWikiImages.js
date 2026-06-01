const https = require('https');

function getWikiImage(term) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`;
    https.get(url, {
      headers: { 'User-Agent': 'JayathuraPharmacyImageUpdater/1.0 (jayathurapharmacy@example.com)' }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const img = parsed.originalimage ? parsed.originalimage.source : (parsed.thumbnail ? parsed.thumbnail.source : null);
          resolve(img);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => {
      resolve(null);
    });
  });
}

async function test() {
  const terms = ['Amlodipine', 'Amoxicillin', 'Atorvastatin', 'Azithromycin', 'Dettol', 'Ibuprofen', 'Metformin', 'Omeprazole', 'Paracetamol', 'Sudocrem', 'Surgical_mask', 'Vitamin_C', 'Vicks_VapoRub'];
  for (const term of terms) {
    const img = await getWikiImage(term);
    console.log(`${term} -> ${img}`);
  }
}

test();

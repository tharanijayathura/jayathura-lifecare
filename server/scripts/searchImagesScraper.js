const https = require('https');

function searchImageBing(query) {
  return new Promise((resolve) => {
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&safeSearch=strict`;
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let html = '';
      res.on('data', (chunk) => { html += chunk; });
      res.on('end', () => {
        try {
          // Look for m="{"imgurl":"https://..."
          const matches = html.match(/m="\{&quot;imgurl&quot;:&quot;(https:[^&]+)&quot;/g);
          if (matches && matches.length > 0) {
            // Get the first match and clean it
            const firstMatch = matches[0];
            const cleanUrlMatch = firstMatch.match(/https:[^&]+/);
            if (cleanUrlMatch) {
              const imageUrl = decodeURIComponent(cleanUrlMatch[0]);
              resolve(imageUrl);
              return;
            }
          }
          resolve(null);
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
  const terms = [
    'Dettol Liquid Antiseptic 250ml',
    'Dettol Sanitizer Gel 50ml',
    'Durex Mutual Climax 10s',
    'Eno Lemon 5g'
  ];
  for (const term of terms) {
    const img = await searchImageBing(term);
    console.log(`${term} -> ${img}`);
  }
}

test();

const https = require('https');
const http = require('http');
const url = require('url');

function fetchHtml(targetUrl) {
  return new Promise((resolve) => {
    const parsedUrl = url.parse(targetUrl);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    const req = client.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 10000
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = url.resolve(targetUrl, res.headers.location);
        resolve(fetchHtml(redirectUrl));
        return;
      }
      let html = '';
      res.on('data', (chunk) => { html += chunk; });
      res.on('end', () => resolve(html));
    });
    req.on('error', () => resolve(''));
  });
}

async function run() {
  const query = 'Dettol Liquid Antiseptic 250ml';
  const targetUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  const html = await fetchHtml(targetUrl);
  console.log('HTML length:', html.length);
  
  // Find external links that are from e-commerce sites like Daraz, Glomark, Kapruka, etc.
  const urls = html.match(/href="([^"]+)"/g) || [];
  console.log(`Found ${urls.length} links.`);
  const filtered = urls.filter(u => u.includes('daraz') || u.includes('glomark') || u.includes('kapruka') || u.includes('myhealth') || u.includes('lassana') || u.includes('wikipedia') || u.includes('netmeds') || u.includes('indiamart'));
  filtered.slice(0, 10).forEach(l => console.log(l));
}

run();

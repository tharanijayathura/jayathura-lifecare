const https = require('https');
const http = require('http');
const url = require('url');

const mappings = {
  'ACC-0031': 'https://gaganapharmacy.lk/product/accu-chek-active-test-strips-10-strips/',
  'AML-0010': 'https://healthplusnigeria.com/products/teva-amlodipine-5mg-x28',
  'AMO-0006': 'https://wellonapharma.com/product/finished/amoxicillin-tablets-500mg',
  'ASP-0048': 'https://storeofhealth.com/products/aspirin-cardio-100mg-2x-30-tablets-bayer',
  'ATO-0008': 'https://wellonapharma.com/product/finished/atorvastatin-tablets-20mg',
  'AZI-0013': 'https://dmdskinsciences.com/products/rx-azitritec-azithromycin-500mg-tablet-3s?srsltid=AfmBOopKxHf9F1vpP-u-jg2Nikjdz22nXM35Do_SXECH9Hhr4B6lYWWk',
  'BET-0034': 'https://sukitha.com/shop/home-medicine/betadine-solution-50ml/?srsltid=AfmBOorAU8p6a-C186MLo1BpMGUbDxu88rwxdG-2Q4Mc83iyFU96Tjhm',
  'BRA-0030': 'https://www.braunhealthcare.com/uk_en/thermometer/digital-stick/',
  'CAL-0020': 'https://www.alpropharmacy.com/products/mpi-calcium-carbonate-500mg-100x10s?srsltid=AfmBOorkBQX1vSRG_b496kgJELMD4rxNYmmO7k1BF8MsIWBg9lhoGlmz',
  'CEN-0021': 'https://en.wikipedia.org/wiki/Centrum_%28multivitamin%29',
  'CET-0025': 'https://www.daraz.lk/products/cetaphil-gentle-skin-cleanser-gentle-face-wash-for-dry-sensitive-skin-250ml-i163100412.html',
  'CET-0016': 'https://www.iqdoctor.co.uk/treatments/allergies/cetirizine-10mg-tablets/?srsltid=AfmBOorRabyYOrQbx3R9HcFDGpQZ-VNDsdrNZzaKKSPEKf3pBM5fHcdw',
  'CIP-0012': 'https://www.indiamart.com/proddetail/ciprofloxacin-500-mg-tablets-23258810433.html?srsltid=AfmBOopHrZBEPZ4I-DMdB5w1unGnqPhr4q9Ap58jO5jgO66-J1oLl9zY',
  'CLE-0027': 'https://www.cleareyes.com/eye-drops/multi-symptom-relief/clear-eyes-triple-action-relief-eye-drops',
  'CLO-0046': 'https://entirelypetspharmacy.com/clopidogrel-tablets-75mg-500-count.html?srsltid=AfmBOoqxw5wUw4xN-oV8sVp3AAFW-Z5LGm2ir2M0f3XvDgm9nxsdj_hM',
  'COL-0024': 'https://egrocery.asia/colgate-maximum-cavities-protection-toothpaste-100g.html'
};

function fetchHtml(targetUrl) {
  return new Promise((resolve) => {
    const parsedUrl = url.parse(targetUrl);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    const req = client.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
      },
      timeout: 10000
    }, (res) => {
      // Handle redirect
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
    req.on('timeout', () => {
      req.destroy();
      resolve('');
    });
  });
}

function extractOgImage(html, targetUrl) {
  if (!html) return null;
  // Match og:image or twitter:image or itemprop="image"
  const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                  html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
                  html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
                  html.match(/<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i);
  
  if (ogMatch && ogMatch[1]) {
    return url.resolve(targetUrl, ogMatch[1]);
  }

  // Fallback to searching for standard image tags that might be the main product image
  const imgMatches = html.match(/<img[^>]+src=["']([^"']+)["']/gi);
  if (imgMatches) {
    for (const imgTag of imgMatches) {
      const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
      if (srcMatch && srcMatch[1]) {
        const src = srcMatch[1];
        if (src.includes('product') || src.includes('uploads') || src.includes('media') || src.includes('images')) {
          if (!src.includes('logo') && !src.includes('icon')) {
            return url.resolve(targetUrl, src);
          }
        }
      }
    }
  }

  return null;
}

async function run() {
  const results = {};
  for (const [code, pageUrl] of Object.entries(mappings)) {
    console.log(`Fetching ${code}...`);
    const html = await fetchHtml(pageUrl);
    const imgUrl = extractOgImage(html, pageUrl);
    console.log(`-> Image: ${imgUrl || 'Not found'}\n`);
    results[code] = imgUrl || pageUrl; // fallback to pageUrl if not found
  }
  console.log('Results mapping:');
  console.log(JSON.stringify(results, null, 2));
}

run();

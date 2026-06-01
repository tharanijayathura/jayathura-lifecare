const dns = require('dns');
const mongoose = require('mongoose');
const https = require('https');
const http = require('http');
const url = require('url');
require('dotenv').config();

const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoUrl && mongoUrl.includes('mongodb+srv://')) {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}

const Medicine = require('../models/Medicine');

const newUserMappings = {
  'BET-0034': 'https://www.indiamart.com/proddetail/betadine-cleansing-solution-50ml-18043406662.html?srsltid=AfmBOork4ZuvX_0x58v2CpWlOb22Ltw0uOwHHWIkNGfLkTHL3aUnKUO-',
  'BRA-0030': 'https://www.braunhealthcare.com/uk_en/thermometer/digital-stick-age-precision/',
  'CLE-0027': 'https://www.cleareyes.com/eye-drops/multi-symptom-relief/clear-eyes-triple-action-relief-eye-drops',
  'DET-0033': 'https://www.al-dawaa.com/en/p/201935/dettol-liquid-antiseptic-250-ml?srsltid=AfmBOoqJkl0HdsHYhh-O5yM-aE9YPCcsfBSwThKJyDXAuKfdFoe4qn7F',
  'DET-0041': 'https://glomark.lk/dettol-hand-sanitizer-fresh-50ml/p/12389?srsltid=AfmBOorhLSSqUSxRcPL0kXKYbInJ5WPIpuE4alS6BpNSDiomPfR5Rr8P',
  'ENO-0003': 'https://www.kogland.com/eno-lemon-sachet-5g?srsltid=AfmBOor22-3NHIeupvit3XqNY1XDENI3mEIhi3mOF8rKpdKgMCpiKL2i',
  'FOL-0037': 'https://products.pharmamt.com/product/folic-acid-tablets-5mg/',
  'FRO-0043': 'https://uk.frontline.com/products/frontline-spot-flea-and-tick-treatment-dogs',
  'HYD-0026': 'https://nowonsuper.lk/product/hydrocortisone-cream-bp-1-hydrosone-15g/',
  'IBU-0015': 'https://www.indiamart.com/proddetail/ibuprofen-tablet-400mg-2855090150262.html?srsltid=AfmBOorkVxlfITDP2ZmHAEC4K9-A0T1vQ4clD0vl8Q15vGwV-__MWF8U',
  'JEE-0005': 'https://www.facebook.com/100063617800113/posts/jeewani-use-for-the-oral-rehydration-therapy-the-international-composition-of-or/104376267895284/',
  'JOI-0052': 'https://www.amazon.com/Glucosamine-Chondroitin-Turmeric-MSM-Boswellia/dp/B01M5DEMWI',
  'LAN-0044': 'https://medplusnig.com/product/lantus-solosta-insulin-5pens-8Jt4I9?srsltid=AfmBOooLVwskbjv9cV7zESnMqQamDe6O8pdmaiILJjh4wT1O5XR9wETM',
  'LIN-0042': 'https://www.ebay.com/itm/185901831006',
  'MET-0007': 'https://spmc.gov.lk/products/biguanide/-metformin-tablets-bp500mg-blister',
  'PAN-0001': 'https://www.panadol.com/en-lk/products/panadol.html',
  'MUL-0050': 'https://appeton.com/49-appeton-baby-drops.php',
  'SAL-0049': 'https://www.gosupps.com/salicylic-acid-ointment-25g-0-9-oz-5-ointment-0-88-ounce-pack-of-1.html',
  'SID-0002': 'https://serandib.co.nz/product/siddhalepa-herbal-ayurvedic-balm-50g/',
  'VIT-0018': 'https://www.essentials.lk/products/kirkland-signature-vitamin-c-500mg-chewable-500-tablets?srsltid=AfmBOooLc3A1_NNAl8jlx3T4o_9gTjxONhd8Lzn2WuoJhruXuGH82uBW',
  'VIT-0019': 'https://greenlife.sg/products/vegan-vitamin-d3-1000iu-100-tablets?srsltid=AfmBOopQo3b4IYgqagjsJoIT38wqlWMDfuRBB9-8adVKSfZ28pFGAUSU',
  'WOO-0035': 'https://www.daraz.lk/products/woodwards-gripe-water-130ml-non-alcoholic-i202411082.html',
  'WHE-0045': 'https://www.edgenutrition.life/',
  'WAX-0028': 'https://osudpotro.com/waxsol-10-ml-ear-drop'
};

// Clean default fallbacks if scraping gets blocked by cloudflare, rate limits, or site blocks
const hardcodedImageFallbacks = {
  'BET-0034': 'https://5.imimg.com/data5/SELLER/Default/2021/3/JC/IP/KJ/22143093/betadine-solution-500x500.jpg',
  'BRA-0030': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Thermometer-18968.jpg/640px-Thermometer-18968.jpg',
  'CLE-0027': 'https://www.cleareyes.com/sites/cleareyes/files/products/clear-eyes-triple-action-relief.png',
  'DET-0033': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Dettol_Liquid.jpg/640px-Dettol_Liquid.jpg',
  'DET-0041': 'https://glomark.lk/images/products/12389.png', // Glomark direct image
  'ENO-0003': 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Eno-logo.png',
  'FOL-0037': 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&q=80',
  'FRO-0043': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/FrontlineSpotOnForCatsAndDogs.jpg/640px-FrontlineSpotOnForCatsAndDogs.jpg',
  'HYD-0026': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&q=80',
  'IBU-0015': 'https://5.imimg.com/data5/ANDROID/Default/2023/5/308107769/PP/XJ/TE/41551061/product-jpeg-500x500.jpg',
  'JEE-0005': 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Oral_rehydration_salts_%28ORS%29_-_Packet.jpg',
  'JOI-0052': 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&q=80',
  'LAN-0044': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Novopen-color.JPG/640px-Novopen-color.JPG',
  'LIN-0042': 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Samahan_sachet.jpg',
  'MET-0007': 'https://images.unsplash.com/photo-1607619056574-7b8d304f3c6f?w=400&q=80',
  'PAN-0001': 'https://upload.wikimedia.org/wikipedia/commons/0/07/Panadol_500_mg.jpg',
  'MUL-0050': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Vitamine_Baby_Drops.jpg/640px-Vitamine_Baby_Drops.jpg',
  'SAL-0049': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&q=80',
  'SID-0002': 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Siddalepa_ayurvedic_balm_in_hand.JPG',
  'VIT-0018': 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&q=80',
  'VIT-0019': 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&q=80',
  'WOO-0035': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Gripe_water_bottle.jpg/640px-Gripe_water_bottle.jpg',
  'WHE-0045': 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80',
  'WAX-0028': 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80'
};

function fetchHtml(targetUrl) {
  return new Promise((resolve) => {
    const parsedUrl = url.parse(targetUrl);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    const req = client.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      },
      timeout: 6000
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
    req.on('timeout', () => {
      req.destroy();
      resolve('');
    });
  });
}

function extractOgImage(html, targetUrl) {
  if (!html) return null;
  const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                  html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
                  html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
                  html.match(/<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i);
  
  if (ogMatch && ogMatch[1]) {
    return url.resolve(targetUrl, ogMatch[1]);
  }

  // Fallback: search for products folder images in page body
  const imgMatches = html.match(/<img[^>]+src=["']([^"']+)["']/gi);
  if (imgMatches) {
    for (const imgTag of imgMatches) {
      const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
      if (srcMatch && srcMatch[1]) {
        const src = srcMatch[1];
        if (src.includes('product') || src.includes('uploads') || src.includes('media') || src.includes('images')) {
          if (!src.includes('logo') && !src.includes('icon') && !src.includes('banner')) {
            return url.resolve(targetUrl, src);
          }
        }
      }
    }
  }
  return null;
}

async function run() {
  try {
    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB\n');

    let updated = 0;
    for (const [code, pageUrl] of Object.entries(newUserMappings)) {
      console.log(`Resolving code: ${code}...`);
      console.log(`Page: ${pageUrl}`);

      let imageToStore = null;

      // Facebook, eBay and complex search links often block scraping or return no metadata
      if (!pageUrl.includes('facebook.com') && !pageUrl.includes('ebay.com') && !pageUrl.includes('amazon.com')) {
        const html = await fetchHtml(pageUrl);
        const extracted = extractOgImage(html, pageUrl);
        if (extracted && extracted.startsWith('http')) {
          imageToStore = extracted;
          console.log(`  ✅ Extracted: ${imageToStore}`);
        }
      }

      if (!imageToStore) {
        imageToStore = hardcodedImageFallbacks[code];
        console.log(`  👉 Using hotlink-safe direct fallback: ${imageToStore}`);
      }

      // Update the database
      const result = await Medicine.updateOne({ code }, { image: imageToStore });
      if (result.matchedCount > 0) {
        console.log(`  💾 Saved database successfully for ${code}\n`);
        updated++;
      } else {
        console.log(`  ⚠️ Code ${code} not found in database!\n`);
      }

      // Quick throttle delay
      await new Promise(r => setTimeout(r, 600));
    }

    console.log(`\n🎉 Success! Resolved and updated ${updated} medicines with the new image mappings.`);
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error during execution:', err);
    process.exit(1);
  }
}

run();

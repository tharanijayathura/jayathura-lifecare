const dns = require('dns');
const mongoose = require('mongoose');
const https = require('https');
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoUrl && mongoUrl.includes('mongodb+srv://')) {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}

const Medicine = require('../models/Medicine');

// Known direct image URLs or overrides for A-C
const initialOverrides = {
  'ACC-0031': 'https://gaganapharmacy.lk/wp-content/uploads/2021/02/Accu-Chek-Active-10.jpg',
  'AML-0010': 'https://healthplusnigeria.com/cdn/shop/files/Teva_20Amlodipine_205mg_20x28_20_281_29_225dda1b-0952-4d11-8c0a-6ea57a0655fb.webp?v=1775644064',
  'AMO-0006': 'https://wellonapharma.com/admincms/product_img/product_resize_img/amoxicillin-tablets_1732540129.jpg',
  'ASP-0048': 'https://storeofhealth.com/cdn/shop/products/aspirin-cardio-100mg-30-comprimate-bayer-10022258_1200x1200.jpg?v=1597619087',
  'ATO-0008': 'https://wellonapharma.com/admincms/product_img/product_resize_img/atorvastatin-20mg-tablets_1619445277.jpg',
  'AZI-0013': 'https://dmdskinsciences.com/cdn/shop/files/azythromycinbox.jpg?v=1747206824',
  'BET-0034': 'https://sukitha.com/wp-content/uploads/2020/11/Betadine-Solution-50ml.jpg', // manual check of the product image pattern
  'BRA-0030': 'https://www.braunhealthcare.com/media/catalog/product/b/r/braun_prt1000_1.jpg', // Braun thermometer image
  'CAL-0020': 'https://www.alpropharmacy.com/cdn/shop/files/00130417_L_1.jpg?v=1767198893',
  'CEN-0021': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Wyeth_Centrum.jpg/1280px-Wyeth_Centrum.jpg',
  'CET-0025': 'https://img.drz.lazcdn.com/static/lk/p/061e018a901940341ecf2e68fe0d07ae.jpg',
  'CET-0016': 'https://www.iqdoctor.co.uk/product_images/cetirizine-10mg-tablets.png',
  'CIP-0012': 'https://5.imimg.com/data5/ANDROID/Default/2021/3/XQ/LI/VI/117942698/product-jpeg-500x500.jpg', // IndiaMart Ciprofloxacin image
  'CLE-0027': 'https://www.cleareyes.com/sites/cleareyes/files/products/clear-eyes-triple-action-relief.png', // Clear Eyes image
  'CLO-0046': 'https://s.turbifycdn.com/aah/yhst-135855760451349/clopidogrel-tablets-75mg-500-count-manufacture-may-vary-46.jpg',
  'COL-0024': 'https://egrocery.asia/wp-content/uploads/2021/11/Colgate-Maximum-Cavities-Protection-Toothpaste-100g.jpg'
};

function fetchHtml(targetUrl) {
  return new Promise((resolve) => {
    const parsedUrl = url.parse(targetUrl);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    const req = client.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 8000
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

  // Fallback: search for clean product images in body
  const imgMatches = html.match(/<img[^>]+src=["']([^"']+)["']/gi);
  if (imgMatches) {
    for (const imgTag of imgMatches) {
      const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
      if (srcMatch && srcMatch[1]) {
        const src = srcMatch[1];
        if (src.includes('product') || src.includes('uploads') || src.includes('media') || src.includes('images')) {
          if (!src.includes('logo') && !src.includes('icon') && !src.includes('banner') && src.startsWith('http')) {
            return src;
          }
        }
      }
    }
  }

  return null;
}

async function getProductImage(query, brand) {
  try {
    const fullQuery = `${query} ${brand || ''}`.trim();
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(fullQuery + ' product')}`;
    const searchHtml = await fetchHtml(searchUrl);
    
    // Parse uddg links
    const uddgMatches = searchHtml.match(/uddg=([^&"]+)/g) || [];
    const productPages = [];
    
    for (const match of uddgMatches) {
      const pageUrl = decodeURIComponent(match.substring(5));
      // Prioritize online pharmacies, e-commerce, and wikipedia
      if (
        pageUrl.includes('daraz') || 
        pageUrl.includes('netmeds') || 
        pageUrl.includes('glomark') || 
        pageUrl.includes('kapruka') || 
        pageUrl.includes('myhealth') ||
        pageUrl.includes('lassana') ||
        pageUrl.includes('wikipedia') ||
        pageUrl.includes('1mg') ||
        pageUrl.includes('indiamart') ||
        pageUrl.includes('amazon') ||
        pageUrl.includes('dettol') ||
        pageUrl.includes('chemistwarehouse') ||
        pageUrl.includes('durex') ||
        pageUrl.includes('woodwards') ||
        pageUrl.includes('sudocrem') ||
        pageUrl.includes('boots') ||
        pageUrl.includes('superdrug')
      ) {
        productPages.push(pageUrl);
      }
    }

    // Also collect general links as backup
    for (const match of uddgMatches) {
      const pageUrl = decodeURIComponent(match.substring(5));
      if (!productPages.includes(pageUrl) && !pageUrl.includes('duckduckgo.com') && !pageUrl.includes('google.com')) {
        productPages.push(pageUrl);
      }
    }

    console.log(`  Found ${productPages.length} potential product pages. Trying top 3...`);

    // Fetch top 3 pages and extract image
    for (let i = 0; i < Math.min(productPages.length, 3); i++) {
      const pageUrl = productPages[i];
      console.log(`  Trying page: ${pageUrl}`);
      const pageHtml = await fetchHtml(pageUrl);
      const img = extractOgImage(pageHtml, pageUrl);
      if (img && img.startsWith('http') && !img.includes('logo') && !img.includes('placeholder')) {
        console.log(`  ✅ Found Image: ${img}`);
        return img;
      }
    }
  } catch (error) {
    console.error(`  Error searching: ${error.message}`);
  }
  return null;
}

// Fallback images in case scraping fails for specific items
const defaultFallbacks = {
  'Durex Mutual Climax 10s': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Durex_condoms.jpg/640px-Durex_condoms.jpg',
  'Panadol 500mg': 'https://upload.wikimedia.org/wikipedia/commons/0/07/Panadol_500_mg.jpg',
  'Siddhalepa Balm 50g': 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Siddalepa_ayurvedic_balm_in_hand.JPG',
  'Eno Lemon 5g': 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Eno-logo.png',
  'Vicks VapoRub 25g': 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Vicks_VapoRub_IMG_20211101.jpg',
  'Jeewani (ORS) 4.5g': 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Oral_rehydration_salts_%28ORS%29_-_Packet.jpg',
  'Surgical Face Masks 50pcs': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Surgical_face_mask.jpg/1280px-Surgical_face_mask.jpg'
};

async function autoFindAndUpdate() {
  try {
    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB\n');

    const medicines = await Medicine.find().sort({ name: 1 });
    console.log(`Processing ${medicines.length} medicines...\n`);

    const mapping = {};

    for (let i = 0; i < medicines.length; i++) {
      const med = medicines[i];
      console.log(`[${i + 1}/${medicines.length}] ${med.name} (${med.code || 'No Code'})`);

      let imageUrl = null;

      // 1. Check if we have an override for this code
      if (med.code && initialOverrides[med.code]) {
        imageUrl = initialOverrides[med.code];
        console.log(`  👉 Using initial override: ${imageUrl}`);
      } else {
        // 2. Try scraping Google/DDG product page
        imageUrl = await getProductImage(med.name, med.brand);
        
        // 3. Fallback to default check if scraping failed
        if (!imageUrl && defaultFallbacks[med.name]) {
          imageUrl = defaultFallbacks[med.name];
          console.log(`  👉 Using static fallback: ${imageUrl}`);
        }
      }

      if (imageUrl) {
        mapping[med._id.toString()] = imageUrl;
        // Update in database!
        med.image = imageUrl;
        await med.save();
        console.log(`  💾 Updated DB for ${med.name}\n`);
      } else {
        console.log(`  ❌ Could not find image for ${med.name}\n`);
      }

      // Add a small delay between requests to avoid rate limits
      await new Promise(r => setTimeout(r, 1000));
    }

    // Write the resulting mapping to a json file
    const mappingFile = path.join(__dirname, 'medicine_images_mapping.json');
    fs.writeFileSync(mappingFile, JSON.stringify(mapping, null, 2), 'utf8');
    console.log(`✅ Saved image mappings to ${mappingFile}`);

    await mongoose.connection.close();
    console.log('✅ Finished updating all medicine images!');
  } catch (error) {
    console.error('❌ Error during update process:', error);
    process.exit(1);
  }
}

autoFindAndUpdate();

// server/routes/medicines.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Medicine = require('../models/Medicine');
const { authMiddleware, adminMiddleware, adminOrPharmacistMiddleware } = require('../middleware/auth');
const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/medicines';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'medicine-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const fileName = (file.originalname || '').toLowerCase();
    const isImageExt = fileName.endsWith('.jpg') || 
                       fileName.endsWith('.jpeg') || 
                       fileName.endsWith('.png') || 
                       fileName.endsWith('.jfif') ||
                       fileName.endsWith('.webp') ||
                       fileName.endsWith('.gif') ||
                       fileName.endsWith('.bmp');
    if (file.mimetype.startsWith('image/') || isImageExt) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// GET /api/medicines - Get all medicines (public, but filtered for patients)
// Patients cannot see prescription medicines, but pharmacists and admins can see all
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = { isActive: true };
    
    // Check if user is authenticated and get their role
    const token = req.headers.authorization?.split(' ')[1];
    let userRole = null;
    
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const User = require('../models/User');
        const user = await User.findById(decoded.id).select('role');
        if (user) {
          userRole = user.role;
        }
      } catch (err) {
        // Token invalid or expired, treat as public
      }
    }
    
    // If user is patient or not authenticated, exclude prescription medicines
    if (userRole !== 'pharmacist' && userRole !== 'admin') {
      query.category = { $ne: 'prescription' };
      query.requiresPrescription = { $ne: true };
    }
    
    if (category && category !== 'all') {
      // If patient tries to access prescription category, deny it
      if (category === 'prescription' && userRole !== 'pharmacist' && userRole !== 'admin') {
        return res.status(403).json({ message: 'Prescription medicines are not available for patients' });
      }
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const medicines = await Medicine.find(query)
      .select('-stockAlert -stock.units -minStockUnits')
      .sort({ createdAt: -1 });
    
    // For public API, only show if stock is available
    const availableMedicines = medicines.map(med => {
      const medObj = med.toObject();
      // Only show stock in packs for public, hide internal calculations
      return {
        ...medObj,
        stock: med.stock.packs,
        price: med.price.perPack,
        available: med.stock.packs > 0
      };
    });
    
    res.json(availableMedicines);
  } catch (error) {
    console.error('Get medicines error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/medicines/pharmacist - Get all medicines for pharmacist (including prescription medicines)
router.get('/pharmacist', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'pharmacist' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Pharmacist or admin access required' });
    }

    const { category, search } = req.query;
    const query = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const medicines = await Medicine.find(query)
      .select('-stockAlert -stock.units -minStockUnits')
      .sort({ createdAt: -1 });
    
    // Format for frontend
    const formattedMedicines = medicines.map(med => {
      const medObj = med.toObject();
      return {
        ...medObj,
        stock: med.stock.packs,
        price: med.price.perPack,
        available: med.stock.packs > 0
      };
    });
    
    res.json(formattedMedicines);
  } catch (error) {
    console.error('Get medicines (pharmacist) error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/medicines/admin - Get all medicines for admin (with stock alerts)
router.get('/admin', adminOrPharmacistMiddleware, async (req, res) => {
  try {
    const { category, includeInactive } = req.query;
    const query = {};
    
    // Only show active medicines by default, unless includeInactive is true
    if (includeInactive !== 'true') {
      query.$or = [
        { isActive: true },
        { isActive: { $exists: false } } // For backward compatibility with old records
      ];
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const medicines = await Medicine.find(query)
      .populate('stockAlert.alertedBy', 'name email')
      .sort({ createdAt: -1 });
    
    // Include virtuals in response
    const medicinesWithVirtuals = medicines.map(med => {
      const medObj = med.toObject();
      return {
        ...medObj,
        isLowStock: med.isLowStock,
        isOutOfStock: med.isOutOfStock,
        stockValue: med.stockValue,
        packDisplay: med.getPackDisplay()
      };
    });
    
    res.json(medicinesWithVirtuals);
  } catch (error) {
    console.error('Get medicines (admin) error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/medicines/proxy-image - Proxy external images and dynamically scrape webpage URLs at runtime
router.get('/proxy-image', (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) {
    return res.status(400).send('URL is required');
  }

  // Hardcoded image fallbacks in case resolving fails or is blocked
  const fallbacks = {
    'ACC-0031': 'https://gaganapharmacy.lk/wp-content/uploads/2021/02/Accu-Chek-Active-10.jpg',
    'AML-0010': 'https://healthplusnigeria.com/cdn/shop/files/Teva_20Amlodipine_205mg_20x28_20_281_29_225dda1b-0952-4d11-8c0a-6ea57a0655fb.webp?v=1775644064',
    'AMO-0006': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Amoxicillin_capsules_500mg.jpg/640px-Amoxicillin_capsules_500mg.jpg',
    'ASP-0048': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Aspirin_pills.jpg/640px-Aspirin_pills.jpg',
    'ATO-0008': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Atorvastatin_20mg.jpg/640px-Atorvastatin_20mg.jpg',
    'AZI-0013': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Azithromycin_pills_in_bottle.jpg/640px-Azithromycin_pills_in_bottle.jpg',
    'BET-0034': 'https://5.imimg.com/data5/SELLER/Default/2021/3/JC/IP/KJ/22143093/betadine-solution-500x500.jpg',
    'BRA-0030': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Thermometer-18968.jpg/640px-Thermometer-18968.jpg',
    'CAL-0020': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Calcium_Carbonate.JPG/640px-Calcium_Carbonate.JPG',
    'CEN-0021': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Wyeth_Centrum.jpg/1280px-Wyeth_Centrum.jpg',
    'CET-0025': 'https://img.drz.lazcdn.com/static/lk/p/061e018a901940341ecf2e68fe0d07ae.jpg',
    'CET-0016': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cetirizine_10mg_tablets.jpg/640px-Cetirizine_10mg_tablets.jpg',
    'CIP-0012': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Ciprofloxacin_pills.jpg/640px-Ciprofloxacin_pills.jpg',
    'CLE-0027': 'https://www.cleareyes.com/sites/cleareyes/files/products/clear-eyes-triple-action-relief.png',
    'CLO-0046': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Clopidogrel_tablets_75mg.jpg/640px-Clopidogrel_tablets_75mg.jpg',
    'COL-0024': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Tubos_de_crema_dental_Colgate_Triple_Acci%C3%B3n.jpg/640px-Tubos_de_crema_dental_Colgate_Triple_Acci%C3%B3n.jpg',
    'DET-0033': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Dettol_Liquid.jpg/640px-Dettol_Liquid.jpg',
    'DET-0041': 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Hand_sanitizer.jpg',
    'DUR-0039': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Durex_condoms.jpg/640px-Durex_condoms.jpg',
    'ENO-0003': 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Eno-logo.png',
    'FOL-0037': 'https://products.pharmamt.com/wp-content/uploads/sites/2/2024/03/Folic-Acid-Tablets-5-mg.webp',
    'FRO-0043': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/FrontlineSpotOnForCatsAndDogs.jpg/640px-FrontlineSpotOnForCatsAndDogs.jpg',
    'HYD-0026': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&q=80',
    'IBU-0015': 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&q=80',
    'JEE-0005': 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Oral_rehydration_salts_%28ORS%29_-_Packet.jpg',
    'JOI-0052': 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&q=80',
    'LAN-0044': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Novopen-color.JPG/640px-Novopen-color.JPG',
    'LIN-0042': 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Samahan_sachet.jpg',
    'LIS-0023': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Listerine_mouthwash.JPG/640px-Listerine_mouthwash.JPG',
    'LOR-0017': 'https://images.unsplash.com/photo-1607619056574-7b8d304f3c6f?w=400&q=80',
    'LOS-0011': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
    'MET-0007': 'https://spmc.gov.lk/resources/190/icon.jpg',
    'PAN-0001': 'https://upload.wikimedia.org/wikipedia/commons/0/07/Panadol_500_mg.jpg',
    'MUL-0050': 'https://appeton.com/assets/images/child_health/appeton-multivitamin-plus-drops.png',
    'SAL-0049': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&q=80',
    'SID-0002': 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Siddalepa_ayurvedic_balm_in_hand.JPG',
    'VIT-0018': 'http://www.essentials.lk/cdn/shop/files/KirklandSignatureVitaminC500mgChewable500Tablets.jpg?v=1724662286&width=1024',
    'VIT-0019': 'https://greenlife.sg/cdn/shop/files/GreenLife_VitaminD31000IUVegan_Tablets_2024_1_1200x1200.jpg?v=1736914506',
    'WOO-0035': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Gripe_water_bottle.jpg/640px-Gripe_water_bottle.jpg',
    'WHE-0045': 'https://www.edgenutrition.life/images/site-specific/home/webp/compressed/mobile-main-visual-updated.webp',
    'WAX-0028': 'https://cdn.osudpotro.com/medicine/waxsol-1634375001169.webp'
  };

  const https = require('https');
  const http = require('http');
  const url = require('url');

  const fetchHtml = (targetUrl) => {
    return new Promise((resolve) => {
      const parsedUrl = url.parse(targetUrl);
      const client = parsedUrl.protocol === 'https:' ? https : http;
      const req = client.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        },
        timeout: 4000
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
  };

  const getDirectImageUrl = async (targetUrl) => {
    // 1. If it already looks like a direct image URL, return it
    const lower = targetUrl.toLowerCase();
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.webp') || lower.endsWith('.gif') || lower.includes('/cdn/shop/files/') || lower.includes('/wp-content/uploads/')) {
      return targetUrl;
    }

    // 2. Otherwise it's a webpage. Fetch the page and extract the image
    try {
      const html = await fetchHtml(targetUrl);
      if (!html) return null;

      const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
                      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
                      html.match(/<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i);
      
      if (ogMatch && ogMatch[1]) {
        return url.resolve(targetUrl, ogMatch[1]);
      }

      // Fallback search in body for standard product image directories
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
    } catch (e) {
      console.error('Dynamic resolution failed:', e.message);
    }
    return null;
  };

  const pipeImage = (targetUrl) => {
    try {
      const parsedUrl = url.parse(targetUrl);
      const client = parsedUrl.protocol === 'https:' ? https : http;
      
      const requestOptions = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': parsedUrl.protocol + '//' + parsedUrl.host
        },
        timeout: 10000
      };

      const proxyReq = client.get(targetUrl, requestOptions, (proxyRes) => {
        res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
        proxyRes.pipe(res);
      });

      proxyReq.on('error', (err) => {
        console.error('Image proxy piping request error:', err.message);
        res.status(500).send('Error loading image');
      });
    } catch (err) {
      console.error('Image proxy opening client error:', err.message);
      res.status(500).send('Error processing image URL');
    }
  };

  // Main flow executor:
  (async () => {
    try {
      let resolvedUrl = await getDirectImageUrl(imageUrl);
      
      // If resolving failed, or if it returned a generic logo or placeholder, route to fallback
      if (!resolvedUrl || resolvedUrl.includes('logo') || resolvedUrl.includes('Search.png') || resolvedUrl.includes('gosupps.png')) {
        let fallbackUrl = null;
        
        // Find code matching the requested page URL from fallbacks
        for (const [code, fallback] of Object.entries(fallbacks)) {
          if (imageUrl.toLowerCase().includes(code.toLowerCase())) {
            fallbackUrl = fallback;
            break;
          }
        }

        // Search based on query matches or keywords if still null
        if (!fallbackUrl) {
          if (imageUrl.includes('betadine')) fallbackUrl = fallbacks['BET-0034'];
          else if (imageUrl.includes('thermometer')) fallbackUrl = fallbacks['BRA-0030'];
          else if (imageUrl.includes('cleareyes')) fallbackUrl = fallbacks['CLE-0027'];
          else if (imageUrl.includes('al-dawaa') || imageUrl.includes('dettol-liquid')) fallbackUrl = fallbacks['DET-0033'];
          else if (imageUrl.includes('glomark') && imageUrl.includes('sanitizer')) fallbackUrl = fallbacks['DET-0041'];
          else if (imageUrl.includes('eno')) fallbackUrl = fallbacks['ENO-0003'];
          else if (imageUrl.includes('folic')) fallbackUrl = fallbacks['FOL-0037'];
          else if (imageUrl.includes('frontline')) fallbackUrl = fallbacks['FRO-0043'];
          else if (imageUrl.includes('hydrocortisone') || imageUrl.includes('hydrosone')) fallbackUrl = fallbacks['HYD-0026'];
          else if (imageUrl.includes('ibuprofen')) fallbackUrl = fallbacks['IBU-0015'];
          else if (imageUrl.includes('jeewani')) fallbackUrl = fallbacks['JEE-0005'];
          else if (imageUrl.includes('glucosamine')) fallbackUrl = fallbacks['JOI-0052'];
          else if (imageUrl.includes('insulin') || imageUrl.includes('lantus')) fallbackUrl = fallbacks['LAN-0044'];
          else if (imageUrl.includes('samahan') || imageUrl.includes('ebay')) fallbackUrl = fallbacks['LIN-0042'];
          else if (imageUrl.includes('metformin')) fallbackUrl = fallbacks['MET-0007'];
          else if (imageUrl.includes('panadol')) fallbackUrl = fallbacks['PAN-0001'];
          else if (imageUrl.includes('baby-drops')) fallbackUrl = fallbacks['MUL-0050'];
          else if (imageUrl.includes('salicylic')) fallbackUrl = fallbacks['SAL-0049'];
          else if (imageUrl.includes('siddhalepa')) fallbackUrl = fallbacks['SID-0002'];
          else if (imageUrl.includes('vitamin-c')) fallbackUrl = fallbacks['VIT-0018'];
          else if (imageUrl.includes('vitamin-d3')) fallbackUrl = fallbacks['VIT-0019'];
          else if (imageUrl.includes('gripe')) fallbackUrl = fallbacks['WOO-0035'];
          else if (imageUrl.includes('protein') || imageUrl.includes('nutrition')) fallbackUrl = fallbacks['WHE-0045'];
          else if (imageUrl.includes('waxsol')) fallbackUrl = fallbacks['WAX-0028'];
        }

        resolvedUrl = fallbackUrl || fallbacks['PAN-0001'];
      }

      pipeImage(resolvedUrl);
    } catch (e) {
      res.status(500).send('Error');
    }
  })();
});

// GET /api/medicines/:id - Get single medicine
router.get('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json(medicine);
  } catch (error) {
    console.error('Get medicine error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/medicines - Create new medicine (admin/pharmacist)
router.post('/', adminOrPharmacistMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { 
      name, 
      brand, 
      category, 
      description, 
      baseUnit,
      packagingType,
      packagingQtyPerPack,
      packagingPackName,
      pricePerPack,
      stockPacks,
      minStockUnits,
      requiresPrescription 
    } = req.body;
    
    // Also try to parse from JSON strings if sent that way (backward compatibility)
    let packaging, price, stock;
    try {
      packaging = typeof req.body.packaging === 'string' ? JSON.parse(req.body.packaging) : req.body.packaging;
      price = typeof req.body.price === 'string' ? JSON.parse(req.body.price) : req.body.price;
      stock = typeof req.body.stock === 'string' ? JSON.parse(req.body.stock) : req.body.stock;
    } catch (e) {
      // Ignore parse errors, use individual fields
    }
    
    // Use individual fields or parsed objects
    const qtyPerPack = parseInt(packaging?.qtyPerPack || packagingQtyPerPack || 1);
    const perPack = parseFloat(price?.perPack || pricePerPack);
    const stockPacksValue = parseInt(stock?.packs || stockPacks || 0);
    
    if (!name || !category) {
      return res.status(400).json({ message: 'Name and category are required' });
    }
    
    if (!perPack || isNaN(perPack)) {
      return res.status(400).json({ message: 'Price per pack is required and must be a valid number' });
    }
    
    if (!baseUnit) {
      return res.status(400).json({ message: 'Base unit is required (tablet, capsule, ml, gram, piece)' });
    }
    
    if (qtyPerPack < 1) {
      return res.status(400).json({ message: 'Quantity per pack must be at least 1' });
    }
    
    // Calculate per unit price
    const perUnit = parseFloat((perPack / qtyPerPack).toFixed(2));
    
    // Calculate total units
    const totalUnits = stockPacksValue * qtyPerPack;
    
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/medicines/${req.file.filename}`;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }
    
    const packagingTypeValue = packaging?.type || packagingType || 'unit';
    const packNameValue = packaging?.packName || packagingPackName || `1 ${packagingTypeValue} (${qtyPerPack} ${baseUnit}${qtyPerPack > 1 ? 's' : ''})`;
    
    const medicine = new Medicine({
      name,
      brand,
      category,
      description,
      baseUnit: baseUnit || 'tablet',
      packaging: {
        type: packagingTypeValue,
        qtyPerPack: qtyPerPack,
        packName: packNameValue
      },
      price: {
        perPack: perPack,
        perUnit: perUnit
      },
      stock: {
        packs: stockPacksValue,
        units: totalUnits
      },
      minStockUnits: parseInt(minStockUnits || 10),
      image: imageUrl,
      requiresPrescription: requiresPrescription === 'true' || requiresPrescription === true
    });
    
    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    console.error('Create medicine error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/medicines/:id - Update medicine (admin/pharmacist)
router.put('/:id', adminOrPharmacistMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { 
      name, 
      brand, 
      category, 
      description, 
      baseUnit,
      packagingType,
      packagingQtyPerPack,
      packagingPackName,
      pricePerPack,
      stockPacks,
      minStockUnits,
      requiresPrescription 
    } = req.body;
    
    // Also try to parse from JSON strings if sent that way (backward compatibility)
    let packaging, price, stock;
    try {
      packaging = typeof req.body.packaging === 'string' ? JSON.parse(req.body.packaging) : req.body.packaging;
      price = typeof req.body.price === 'string' ? JSON.parse(req.body.price) : req.body.price;
      stock = typeof req.body.stock === 'string' ? JSON.parse(req.body.stock) : req.body.stock;
    } catch (e) {
      // Ignore parse errors, use individual fields
    }
    
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    // Update basic fields
    if (name) medicine.name = name;
    if (brand !== undefined) medicine.brand = brand;
    if (category) medicine.category = category;
    if (description !== undefined) medicine.description = description;
    if (baseUnit) medicine.baseUnit = baseUnit;
    if (minStockUnits !== undefined) medicine.minStockUnits = parseInt(minStockUnits);
    if (requiresPrescription !== undefined) {
      medicine.requiresPrescription = requiresPrescription === 'true' || requiresPrescription === true;
    }
    
    // Update packaging
    if (packagingType || packaging?.type) {
      medicine.packaging.type = packagingType || packaging.type;
    }
    if (packagingQtyPerPack || packaging?.qtyPerPack) {
      medicine.packaging.qtyPerPack = parseInt(packagingQtyPerPack || packaging.qtyPerPack);
    }
    if (packagingPackName !== undefined || packaging?.packName) {
      medicine.packaging.packName = packagingPackName || packaging.packName;
    }
    
    // Update price
    if (pricePerPack !== undefined || price?.perPack !== undefined) {
      medicine.price.perPack = parseFloat(pricePerPack || price.perPack);
      // Recalculate per unit
      if (medicine.packaging.qtyPerPack > 0) {
        medicine.price.perUnit = parseFloat((medicine.price.perPack / medicine.packaging.qtyPerPack).toFixed(2));
      }
    }
    
    // Update stock
    if (stockPacks !== undefined || stock?.packs !== undefined) {
      medicine.stock.packs = parseInt(stockPacks || stock.packs);
      // Recalculate units
      medicine.stock.units = medicine.stock.packs * medicine.packaging.qtyPerPack;
    }
    
    // Handle image update
    if (req.file) {
      // Delete old image if exists
      if (medicine.image && medicine.image.startsWith('/uploads/')) {
        const oldPath = medicine.image.substring(1);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      medicine.image = `/uploads/medicines/${req.file.filename}`;
    } else if (req.body.image !== undefined) {
      // If empty string is sent, remove the image
      if (req.body.image === '' || req.body.image === null) {
        // Delete old image file if exists
        if (medicine.image && medicine.image.startsWith('/uploads/')) {
          const oldPath = medicine.image.substring(1);
          if (fs.existsSync(oldPath)) {
            try {
              fs.unlinkSync(oldPath);
            } catch (err) {
              console.error('Error deleting old image:', err);
            }
          }
        }
        medicine.image = '';
      } else {
        medicine.image = req.body.image;
      }
    }
    
    await medicine.save();
    res.json(medicine);
  } catch (error) {
    console.error('Update medicine error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/medicines/all - Delete all medicines (admin/pharmacist)
router.delete('/all', adminOrPharmacistMiddleware, async (req, res) => {
  try {
    const result = await Medicine.deleteMany({});
    res.json({ 
      message: `Successfully deleted ${result.deletedCount} medicines`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Delete all medicines error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/medicines/:id - Delete medicine (admin/pharmacist)
router.delete('/:id', adminOrPharmacistMiddleware, async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    // Soft delete using updateOne to avoid validation issues
    // This bypasses validation which is safe since we're only updating isActive
    await Medicine.updateOne(
      { _id: req.params.id },
      { $set: { isActive: false } },
      { runValidators: false }
    );
    
    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    console.error('Delete medicine error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/medicines/:id/alert - Pharmacist can alert admin about low stock
router.post('/:id/alert', authMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;
    const medicine = await Medicine.findById(req.params.id);
    
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    // Only pharmacists and admins can alert
    if (req.user.role !== 'pharmacist' && req.user.role !== 'admin' && !req.user.isSuperAdmin) {
      return res.status(403).json({ message: 'Only pharmacists and admins can create alerts' });
    }
    
    medicine.stockAlert = {
      isAlerted: true,
      alertedBy: req.user._id,
      alertedAt: new Date(),
      alertReason: reason || `Stock is low: ${medicine.stock.units} ${medicine.baseUnit}s remaining (min: ${medicine.minStockUnits})`
    };
    
    await medicine.save();
    res.json({ message: 'Alert created successfully', medicine });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/medicines/:id/clear-alert - Admin/pharmacist can clear alert
router.post('/:id/clear-alert', adminOrPharmacistMiddleware, async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    medicine.stockAlert = {
      isAlerted: false,
      alertedBy: null,
      alertedAt: null,
      alertReason: ''
    };
    
    await medicine.save();
    res.json({ message: 'Alert cleared successfully', medicine });
  } catch (error) {
    console.error('Clear alert error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


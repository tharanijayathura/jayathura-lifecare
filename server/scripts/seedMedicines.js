const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const dns = require('dns');
const Medicine = require('../models/Medicine');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (MONGO_URI && MONGO_URI.startsWith('mongodb+srv://') && process.env.MONGO_DNS_SERVERS) {
  const dnsServers = process.env.MONGO_DNS_SERVERS
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers.length > 0) {
    dns.setServers(dnsServers);
    console.log('🌐 Using DNS servers for MongoDB SRV lookups:', dnsServers.join(', '));
  }
}

const medicines = [
  // 1. OTC & Common
  {
    name: 'Panadol 500mg',
    brand: 'GSK',
    category: 'otc',
    description: 'Relief of pain and fever. For headaches, backache, rheumatic and muscle pain, toothache, and cold symptoms.',
    baseUnit: 'tablet',
    packaging: { type: 'card', qtyPerPack: 12, packName: 'Card of 12' },
    price: { perPack: 120 },
    stock: { packs: 100 },
    minStockUnits: 120,
    requiresPrescription: false,
    isCommon: true,
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Panadol_500_mg.jpg'
  },
  {
    name: 'Siddhalepa Balm 50g',
    brand: 'Siddhalepa',
    category: 'herbal',
    description: 'Ayurvedic herbal balm for quick relief of cold, flu, headache, swelling and muscle soreness.',
    baseUnit: 'gram',
    packaging: { type: 'unit', qtyPerPack: 50, packName: '50g Pot' },
    price: { perPack: 250 },
    stock: { packs: 50 },
    minStockUnits: 500,
    requiresPrescription: false,
    isCommon: true,
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Siddalepa_ayurvedic_balm_in_hand.JPG'
  },
  {
    name: 'Eno Lemon 5g',
    brand: 'GSK',
    category: 'otc',
    description: 'Antacid powder for fast-acting relief from acidity, indigestion, and heartburn.',
    baseUnit: 'piece',
    packaging: { type: 'sachet', qtyPerPack: 1, packName: '5g Sachet' },
    price: { perPack: 45 },
    stock: { packs: 200 },
    minStockUnits: 50,
    requiresPrescription: false,
    isCommon: true,
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Eno-logo.png'
  },
  {
    name: 'Vicks VapoRub 25g',
    brand: 'P&G',
    category: 'otc',
    description: 'Mentholated ointment for quick relief from cough and cold chest congestions.',
    baseUnit: 'gram',
    packaging: { type: 'unit', qtyPerPack: 25, packName: '25g Pot' },
    price: { perPack: 180 },
    stock: { packs: 60 },
    minStockUnits: 250,
    requiresPrescription: false,
    isCommon: true,
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Vicks_VapoRub_IMG_20211101.jpg'
  },
  {
    name: 'Jeewani (ORS) 4.5g',
    brand: 'SPC',
    category: 'otc',
    description: 'Oral Rehydration Salts to restore body fluids and essential electrolytes.',
    baseUnit: 'piece',
    packaging: { type: 'sachet', qtyPerPack: 1, packName: 'Sachet' },
    price: { perPack: 20 },
    stock: { packs: 500 },
    minStockUnits: 100,
    requiresPrescription: false,
    isCommon: true,
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Oral_rehydration_salts_%28ORS%29_-_Packet.jpg'
  },

  // 2. Prescription Medicines (Rx)
  {
    name: 'Amoxicillin 500mg',
    brand: 'GlaxoSmithKline',
    category: 'prescription',
    description: 'Penicillin-type antibiotic used to treat bacterial throat, ear, and sinus infections.',
    baseUnit: 'capsule',
    packaging: { type: 'card', qtyPerPack: 10, packName: 'Card of 10' },
    price: { perPack: 350 },
    stock: { packs: 80 },
    minStockUnits: 50,
    requiresPrescription: true,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80'
  },
  {
    name: 'Metformin 500mg',
    brand: 'Merck',
    category: 'prescription',
    description: 'First-line medication for the treatment of type 2 diabetes.',
    baseUnit: 'tablet',
    packaging: { type: 'card', qtyPerPack: 15, packName: 'Card of 15' },
    price: { perPack: 120 },
    stock: { packs: 120 },
    minStockUnits: 100,
    requiresPrescription: true,
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d304f3c6f?w=400&q=80'
  },
  {
    name: 'Atorvastatin 20mg',
    brand: 'Pfizer',
    category: 'prescription',
    description: 'Statin medication used to prevent cardiovascular disease and lower lipids.',
    baseUnit: 'tablet',
    packaging: { type: 'card', qtyPerPack: 10, packName: 'Card of 10' },
    price: { perPack: 650 },
    stock: { packs: 90 },
    minStockUnits: 50,
    requiresPrescription: true,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&q=80'
  },
  {
    name: 'Omeprazole 20mg',
    brand: 'AstraZeneca',
    category: 'prescription',
    description: 'Proton pump inhibitor that decreases stomach acid secretion.',
    baseUnit: 'capsule',
    packaging: { type: 'bottle', qtyPerPack: 28, packName: 'Bottle of 28' },
    price: { perPack: 420 },
    stock: { packs: 110 },
    minStockUnits: 150,
    requiresPrescription: true,
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&q=80'
  },
  {
    name: 'Amlodipine 5mg',
    brand: 'Pfizer',
    category: 'prescription',
    description: 'Calcium channel blocker used to treat high blood pressure and chest pain.',
    baseUnit: 'tablet',
    packaging: { type: 'card', qtyPerPack: 14, packName: 'Card of 14' },
    price: { perPack: 180 },
    stock: { packs: 140 },
    minStockUnits: 200,
    requiresPrescription: true,
    image: 'https://images.unsplash.com/photo-1584017912448-6a3f12a2ef4f?w=400&q=80'
  },
  {
    name: 'Losartan Potassium 50mg',
    brand: 'MSD',
    category: 'prescription',
    description: 'Angiotensin II receptor antagonist medication used to treat hypertension.',
    baseUnit: 'tablet',
    packaging: { type: 'card', qtyPerPack: 10, packName: 'Card of 10' },
    price: { perPack: 290 },
    stock: { packs: 75 },
    minStockUnits: 80,
    requiresPrescription: true,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80'
  },
  {
    name: 'Ciprofloxacin 500mg',
    brand: 'Bayer',
    category: 'prescription',
    description: 'Fluoroquinolone antibiotic used to treat bacterial urinary tract infections.',
    baseUnit: 'tablet',
    packaging: { type: 'card', qtyPerPack: 10, packName: 'Card of 10' },
    price: { perPack: 450 },
    stock: { packs: 60 },
    minStockUnits: 40,
    requiresPrescription: true,
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d304f3c6f?w=400&q=80'
  },
  {
    name: 'Azithromycin 500mg',
    brand: 'Pfizer',
    category: 'prescription',
    description: 'Macrolide antibiotic used for respiratory and skin bacterial infections.',
    baseUnit: 'tablet',
    packaging: { type: 'card', qtyPerPack: 3, packName: 'Card of 3' },
    price: { perPack: 280 },
    stock: { packs: 150 },
    minStockUnits: 50,
    requiresPrescription: true,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&q=80'
  },
  {
    name: 'Salbutamol Inhaler 100mcg',
    brand: 'GSK',
    category: 'prescription',
    description: 'Fast-acting bronchodilator for asthma attacks and chronic lung spasms.',
    baseUnit: 'piece',
    packaging: { type: 'unit', qtyPerPack: 1, packName: 'Inhaler Device' },
    price: { perPack: 680 },
    stock: { packs: 40 },
    minStockUnits: 10,
    requiresPrescription: true,
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&q=80'
  },

  // 3. OTC Remedies & General
  {
    name: 'Ibuprofen 400mg',
    brand: 'Nurofen',
    category: 'otc',
    description: 'Non-steroidal anti-inflammatory drug (NSAID) used for fast pain and fever relief.',
    baseUnit: 'tablet',
    packaging: { type: 'card', qtyPerPack: 10, packName: 'Card of 10' },
    price: { perPack: 150 },
    stock: { packs: 200 },
    minStockUnits: 100,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&q=80'
  },
  {
    name: 'Cetirizine Hydrochloride 10mg',
    brand: 'Zyrtec',
    category: 'otc',
    description: 'Non-drowsy 24h antihistamine for sneezing, runny nose, and allergic rashes.',
    baseUnit: 'tablet',
    packaging: { type: 'card', qtyPerPack: 10, packName: 'Card of 10' },
    price: { perPack: 90 },
    stock: { packs: 250 },
    minStockUnits: 80,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80'
  },
  {
    name: 'Loratadine 10mg',
    brand: 'Claritin',
    category: 'otc',
    description: 'Allergy medicine providing 24-hour relief from seasonal environmental triggers.',
    baseUnit: 'tablet',
    packaging: { type: 'card', qtyPerPack: 10, packName: 'Card of 10' },
    price: { perPack: 110 },
    stock: { packs: 180 },
    minStockUnits: 60,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d304f3c6f?w=400&q=80'
  },

  // 4. Vitamins & Supplements
  {
    name: 'Vitamin C 500mg Chewable',
    brand: 'Redoxon',
    category: 'vitamins',
    description: 'Daily orange-flavored vitamin C chewables to support immunity health.',
    baseUnit: 'tablet',
    packaging: { type: 'bottle', qtyPerPack: 30, packName: '30 Tablets' },
    price: { perPack: 850 },
    stock: { packs: 90 },
    minStockUnits: 15,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&q=80'
  },
  {
    name: 'Vitamin D3 1000IU',
    brand: 'Solgar',
    category: 'vitamins',
    description: 'Essential D3 softgels for bone density, joints, and immune defense.',
    baseUnit: 'capsule',
    packaging: { type: 'bottle', qtyPerPack: 60, packName: '60 Softgels' },
    price: { perPack: 1450 },
    stock: { packs: 70 },
    minStockUnits: 10,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&q=80'
  },
  {
    name: 'Calcium Carbonate 500mg',
    brand: 'Caltrate',
    category: 'vitamins',
    description: 'High-potency calcium supplements to prevent osteoporosis.',
    baseUnit: 'tablet',
    packaging: { type: 'bottle', qtyPerPack: 50, packName: '50 Tablets' },
    price: { perPack: 980 },
    stock: { packs: 85 },
    minStockUnits: 15,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&q=80'
  },
  {
    name: 'Centrum Complete Multivitamin',
    brand: 'Centrum',
    category: 'vitamins',
    description: 'Daily multivitamin/multimineral supplement formulated for adult health.',
    baseUnit: 'tablet',
    packaging: { type: 'bottle', qtyPerPack: 30, packName: '30 Tablets' },
    price: { perPack: 1650 },
    stock: { packs: 100 },
    minStockUnits: 10,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&q=80'
  },

  // 5. Health & Wellness
  {
    name: 'Sensodyne Fresh Mint Toothpaste',
    brand: 'GSK',
    category: 'personal-care',
    description: 'Clinically proven sensitivity protection with a fresh mint flavor.',
    baseUnit: 'gram',
    packaging: { type: 'tube', qtyPerPack: 75, packName: '75g Tube' },
    price: { perPack: 320 },
    stock: { packs: 120 },
    minStockUnits: 500,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&q=80'
  },
  {
    name: 'Listerine Cool Mint 250ml',
    brand: 'J&J',
    category: 'personal-care',
    description: 'Antiseptic mouthwash killing 99.9% of bad breath germs.',
    baseUnit: 'ml',
    packaging: { type: 'bottle', qtyPerPack: 250, packName: '250ml Bottle' },
    price: { perPack: 490 },
    stock: { packs: 80 },
    minStockUnits: 1000,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&q=80'
  },
  {
    name: 'Colgate Total Protection 100g',
    brand: 'Colgate',
    category: 'personal-care',
    description: 'Antibacterial cavity defense fluoride toothpaste.',
    baseUnit: 'gram',
    packaging: { type: 'tube', qtyPerPack: 100, packName: '100g Tube' },
    price: { perPack: 180 },
    stock: { packs: 150 },
    minStockUnits: 1000,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&q=80'
  },
  {
    name: 'Cetaphil Gentle Skin Cleanser',
    brand: 'Galderma',
    category: 'personal-care',
    description: 'Soap-free formula gently cleaning sensitive skin conditions.',
    baseUnit: 'ml',
    packaging: { type: 'bottle', qtyPerPack: 125, packName: '125ml Bottle' },
    price: { perPack: 1850 },
    stock: { packs: 45 },
    minStockUnits: 500,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80'
  },
  {
    name: 'Hydrocortisone Cream 1% 15g',
    brand: 'Generic',
    category: 'personal-care',
    description: 'Mild steroid cream to treat skin inflammation, eczema, and bug bites.',
    baseUnit: 'gram',
    packaging: { type: 'tube', qtyPerPack: 15, packName: '15g Tube' },
    price: { perPack: 290 },
    stock: { packs: 100 },
    minStockUnits: 150,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&q=80'
  },
  {
    name: 'Clear Eyes Eye Drops 15ml',
    brand: 'Clear Eyes',
    category: 'personal-care',
    description: 'Redness relief drops to soothe burning, dry, and irritated eyes.',
    baseUnit: 'ml',
    packaging: { type: 'bottle', qtyPerPack: 15, packName: '15ml Dropper' },
    price: { perPack: 520 },
    stock: { packs: 60 },
    minStockUnits: 100,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&q=80'
  },
  {
    name: 'Waxsol Ear Drops 10ml',
    brand: 'Mylan',
    category: 'personal-care',
    description: 'Water-based formula that softens and disperses accumulated ear wax.',
    baseUnit: 'ml',
    packaging: { type: 'bottle', qtyPerPack: 10, packName: '10ml Dropper' },
    price: { perPack: 780 },
    stock: { packs: 50 },
    minStockUnits: 80,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&q=80'
  },

  // 6. Medical Devices & Equipment
  {
    name: 'Omron BP Monitor Hem-7120',
    brand: 'Omron',
    category: 'medical-devices',
    description: 'Accurate and user-friendly automated digital blood pressure monitor.',
    baseUnit: 'piece',
    packaging: { type: 'box', qtyPerPack: 1, packName: 'Device Box' },
    price: { perPack: 7500 },
    stock: { packs: 25 },
    minStockUnits: 5,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&q=80'
  },
  {
    name: 'Braun Digital Thermometer',
    brand: 'Braun',
    category: 'medical-devices',
    description: 'High-speed digital contact thermometer for oral, underarm, or rectal checks.',
    baseUnit: 'piece',
    packaging: { type: 'box', qtyPerPack: 1, packName: 'Device Box' },
    price: { perPack: 1850 },
    stock: { packs: 40 },
    minStockUnits: 10,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&q=80'
  },
  {
    name: 'Accu-Chek Active Glucometer',
    brand: 'Roche',
    category: 'medical-devices',
    description: 'Home blood glucose monitoring system to keep track of diabetic levels.',
    baseUnit: 'piece',
    packaging: { type: 'box', qtyPerPack: 1, packName: 'Device Box' },
    price: { perPack: 4900 },
    stock: { packs: 30 },
    minStockUnits: 5,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&q=80'
  },

  // 7. First Aid & Safety
  {
    name: 'Surgical Face Masks 50pcs',
    brand: 'Generic',
    category: 'first-aid',
    description: 'Disposable 3-ply non-woven medical masks with ear loops.',
    baseUnit: 'piece',
    packaging: { type: 'box', qtyPerPack: 50, packName: 'Box of 50' },
    price: { perPack: 350 },
    stock: { packs: 100 },
    minStockUnits: 200,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80'
  },
  {
    name: 'Dettol Liquid Antiseptic 250ml',
    brand: 'Reckitt',
    category: 'first-aid',
    description: 'Chloroxylenol-based antiseptic solution for cleaning wounds and surface disinfection.',
    baseUnit: 'ml',
    packaging: { type: 'bottle', qtyPerPack: 250, packName: '250ml Bottle' },
    price: { perPack: 380 },
    stock: { packs: 120 },
    minStockUnits: 1000,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80'
  },
  {
    name: 'Betadine Solution 50ml',
    brand: 'Mundipharma',
    category: 'first-aid',
    description: 'Povidone-iodine topical antiseptic liquid to sanitize minor cuts and abrasions.',
    baseUnit: 'ml',
    packaging: { type: 'bottle', qtyPerPack: 50, packName: '50ml Bottle' },
    price: { perPack: 420 },
    stock: { packs: 90 },
    minStockUnits: 200,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80'
  },

  // 8. Specialized & Baby Care
  {
    name: 'Woodwards Gripe Water 120ml',
    brand: 'Woodwards',
    category: 'baby-care',
    description: 'Alcohol-free dill oil formulation providing relief from infant colic and gas.',
    baseUnit: 'ml',
    packaging: { type: 'bottle', qtyPerPack: 120, packName: '120ml Bottle' },
    price: { perPack: 450 },
    stock: { packs: 60 },
    minStockUnits: 240,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=400&q=80'
  },
  {
    name: 'Sudocrem Nappy Care 125g',
    brand: 'Teva',
    category: 'baby-care',
    description: 'Hypoallergenic diaper rash barrier cream to soothe sore infant skin.',
    baseUnit: 'gram',
    packaging: { type: 'unit', qtyPerPack: 125, packName: '125g Pot' },
    price: { perPack: 1200 },
    stock: { packs: 40 },
    minStockUnits: 250,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=400&q=80'
  },
  {
    name: 'Folic Acid 5mg',
    brand: 'SPC',
    category: 'personal-care',
    description: 'Folate supplements critical for red blood cell health and early pregnancy defense.',
    baseUnit: 'tablet',
    packaging: { type: 'card', qtyPerPack: 10, packName: 'Card of 10' },
    price: { perPack: 60 },
    stock: { packs: 300 },
    minStockUnits: 100,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&q=80'
  },
  {
    name: 'Wellman Original 30s',
    brand: 'Vitabiotics',
    category: 'personal-care',
    description: 'Daily multivitamin pills containing zinc and energy boosters for men.',
    baseUnit: 'tablet',
    packaging: { type: 'box', qtyPerPack: 30, packName: 'Box of 30' },
    price: { perPack: 2600 },
    stock: { packs: 50 },
    minStockUnits: 10,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&q=80'
  },

  // 9. Personal Care & Hygiene
  {
    name: 'Durex Mutual Climax 10s',
    brand: 'Reckitt',
    category: 'personal-care',
    description: 'Condoms containing ribbed/dotted textures and cooling climax gel.',
    baseUnit: 'piece',
    packaging: { type: 'box', qtyPerPack: 10, packName: 'Pack of 10' },
    price: { perPack: 1450 },
    stock: { packs: 65 },
    minStockUnits: 20,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80'
  },
  {
    name: 'Whisper Ultra Clean Wings 30s',
    brand: 'P&G',
    category: 'personal-care',
    description: 'Super absorbent sanitary pads with side wings for female cycle safety.',
    baseUnit: 'piece',
    packaging: { type: 'box', qtyPerPack: 30, packName: 'Pack of 30' },
    price: { perPack: 890 },
    stock: { packs: 70 },
    minStockUnits: 10,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80'
  },
  {
    name: 'Dettol Sanitizer Gel 50ml',
    brand: 'Reckitt',
    category: 'personal-care',
    description: 'Rinse-free antiseptic hand gel killing 99.9% of bacteria.',
    baseUnit: 'ml',
    packaging: { type: 'bottle', qtyPerPack: 50, packName: '50ml Bottle' },
    price: { perPack: 220 },
    stock: { packs: 100 },
    minStockUnits: 250,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80'
  },

  // 10. Herbal & Specialized Lifestyle
  {
    name: 'Link Samahan 10 Sachets',
    brand: 'Link Natural',
    category: 'herbal',
    description: 'Ayurvedic hot herbal drink containing 14 Sri Lankan herbs for flu and cold relief.',
    baseUnit: 'piece',
    packaging: { type: 'box', qtyPerPack: 10, packName: 'Pack of 10' },
    price: { perPack: 250 },
    stock: { packs: 300 },
    minStockUnits: 50,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&q=80'
  },
  {
    name: 'Frontline Spot On for Dogs',
    brand: 'Merial',
    category: 'otc',
    description: 'Topical drops treating and protecting dogs from tick and flea infestations.',
    baseUnit: 'piece',
    packaging: { type: 'box', qtyPerPack: 3, packName: 'Box of 3 Pipettes' },
    price: { perPack: 3500 },
    stock: { packs: 20 },
    minStockUnits: 5,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&q=80'
  },
  {
    name: 'Lantus SoloStar Insulin Pen',
    brand: 'Sanofi',
    category: 'otc',
    description: 'Long-acting insulin glargine injection device. Store at 2-8°C.',
    baseUnit: 'piece',
    packaging: { type: 'unit', qtyPerPack: 1, packName: '3ml Prefilled Pen' },
    price: { perPack: 2900 },
    stock: { packs: 15 },
    minStockUnits: 3,
    requiresPrescription: true,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80'
  },
  {
    name: 'Whey Protein Powder 500g',
    brand: 'Optimum Nutrition',
    category: 'vitamins',
    description: 'Ultra-filtered gold standard whey isolate to assist post-workout recovery.',
    baseUnit: 'gram',
    packaging: { type: 'unit', qtyPerPack: 500, packName: '500g Tub' },
    price: { perPack: 6200 },
    stock: { packs: 20 },
    minStockUnits: 2000,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80'
  },

  // 11. Additional Common Prescription Drugs
  {
    name: 'Clopidogrel 75mg',
    brand: 'Sanofi',
    category: 'prescription',
    description: 'Antiplatelet medication used to reduce the risk of heart disease and stroke.',
    baseUnit: 'tablet',
    packaging: { type: 'card', qtyPerPack: 14, packName: 'Card of 14' },
    price: { perPack: 350 },
    stock: { packs: 90 },
    minStockUnits: 50,
    requiresPrescription: true,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80'
  },
  {
    name: 'Prednisolone 5mg',
    brand: 'SPC',
    category: 'prescription',
    description: 'Corticosteroid drug used to treat inflammatory and allergic conditions.',
    baseUnit: 'tablet',
    packaging: { type: 'card', qtyPerPack: 10, packName: 'Card of 10' },
    price: { perPack: 80 },
    stock: { packs: 150 },
    minStockUnits: 100,
    requiresPrescription: true,
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d304f3c6f?w=400&q=80'
  },
  {
    name: 'Aspirin Cardio 100mg',
    brand: 'Bayer',
    category: 'otc',
    description: 'Low-dose acetylsalicylic acid to prevent blood clots in cardiovascular risk patients.',
    baseUnit: 'tablet',
    packaging: { type: 'card', qtyPerPack: 30, packName: 'Card of 30' },
    price: { perPack: 240 },
    stock: { packs: 100 },
    minStockUnits: 90,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1584017912448-6a3f12a2ef4f?w=400&q=80'
  },
  {
    name: 'Salicylic Acid Ointment 5% 10g',
    brand: 'Generic',
    category: 'personal-care',
    description: 'Keratolytic topical treatment used for scaling skin, warts, and calluses.',
    baseUnit: 'gram',
    packaging: { type: 'tube', qtyPerPack: 10, packName: '10g Tube' },
    price: { perPack: 180 },
    stock: { packs: 80 },
    minStockUnits: 100,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&q=80'
  },
  {
    name: 'Multivitamin Infantile Drops 30ml',
    brand: 'Abbott',
    category: 'baby-care',
    description: 'Pediatric liquid vitamin drops containing A, D, C and essential minerals.',
    baseUnit: 'ml',
    packaging: { type: 'bottle', qtyPerPack: 30, packName: '30ml Bottle' },
    price: { perPack: 650 },
    stock: { packs: 75 },
    minStockUnits: 60,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=400&q=80'
  },
  {
    name: 'Tears Naturale Eye Drops 15ml',
    brand: 'Alcon',
    category: 'personal-care',
    description: 'Artificial tears formulation providing lubricating relief for dry eyes.',
    baseUnit: 'ml',
    packaging: { type: 'bottle', qtyPerPack: 15, packName: '15ml Bottle' },
    price: { perPack: 490 },
    stock: { packs: 85 },
    minStockUnits: 90,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&q=80'
  },
  {
    name: 'Joint Support Glucosamine 1000mg',
    brand: 'Nature Made',
    category: 'vitamins',
    description: 'Daily dietary supplements to help support joint comfort and flexibility.',
    baseUnit: 'capsule',
    packaging: { type: 'bottle', qtyPerPack: 60, packName: '60 Capsules' },
    price: { perPack: 1950 },
    stock: { packs: 40 },
    minStockUnits: 10,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&q=80'
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/jayathura-lifecare');
    console.log('Connected to MongoDB');

    // Clear existing medicines
    await Medicine.deleteMany({});
    console.log('Cleared existing medicines');

    // Insert new medicines
    await Medicine.insertMany(medicines);
    console.log(`Inserted ${medicines.length} medicines successfully`);

    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();

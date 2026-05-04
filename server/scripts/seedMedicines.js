const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const dns = require('dns');
const Medicine = require('../models/Medicine');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
if (MONGO_URI && MONGO_URI.startsWith('mongodb+srv://')) {
  const dnsServers = (process.env.MONGO_DNS_SERVERS || '1.1.1.1,8.8.8.8')
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers.length > 0) {
    dns.setServers(dnsServers);
    console.log('🌐 Using DNS servers for MongoDB SRV lookups:', dnsServers.join(', '));
  }
}

const medicines = [
  // OTC - Common
  {
    name: 'Panadol 500mg',
    brand: 'GSK',
    category: 'otc',
    description: 'Relief of pain and fever. For headaches, migraine, backache, rheumatic and muscle pain, toothache and period pain.',
    baseUnit: 'tablet',
    packaging: { type: 'card', qtyPerPack: 12, packName: 'Card of 12' },
    price: { perPack: 120, perUnit: 10 },
    stock: { packs: 100, units: 1200 },
    minStockUnits: 120,
    requiresPrescription: false,
    isCommon: true,
    image: 'https://www.panadol.com/content/dam/cf-consumer-healthcare/panadol/en_LK/products/Panadol-Tablet-New-Pack.png'
  },
  {
    name: 'Siddhalepa Balm 50g',
    brand: 'Siddhalepa',
    category: 'herbal',
    description: 'Ayurvedic herbal balm for relief of cold, flu, headache, swelling and muscle pain.',
    baseUnit: 'gram',
    packaging: { type: 'unit', qtyPerPack: 50, packName: '50g Pot' },
    price: { perPack: 250, perUnit: 5 },
    stock: { packs: 50, units: 2500 },
    minStockUnits: 500,
    requiresPrescription: false,
    isCommon: true,
    image: 'https://siddhalepa.com/wp-content/uploads/2019/08/Balm-50g.png'
  },
  {
    name: 'Eno Lemon 5g',
    brand: 'GSK',
    category: 'otc',
    description: 'Antacid powder for quick relief from acidity and heartburn.',
    baseUnit: 'piece',
    packaging: { type: 'sachet', qtyPerPack: 1, packName: '5g Sachet' },
    price: { perPack: 45, perUnit: 45 },
    stock: { packs: 200, units: 200 },
    minStockUnits: 50,
    requiresPrescription: false,
    isCommon: true,
    image: 'https://www.eno.com.sg/content/dam/cf-consumer-healthcare/eno/en_SG/products/lemon-sachet.png'
  },
  {
    name: 'Vicks VapoRub 25g',
    brand: 'P&G',
    category: 'otc',
    description: 'Relief from cold and cough symptoms.',
    baseUnit: 'gram',
    packaging: { type: 'unit', qtyPerPack: 25, packName: '25g Pot' },
    price: { perPack: 180, perUnit: 7.2 },
    stock: { packs: 60, units: 1500 },
    minStockUnits: 250,
    requiresPrescription: false,
    isCommon: true,
    image: 'https://m.media-amazon.com/images/I/71RImvY8L4L._AC_SL1500_.jpg'
  },
  {
    name: 'Jeewani (ORS) 4.5g',
    brand: 'SPC',
    category: 'otc',
    description: 'Oral Rehydration Salts for replacement of electrolytes.',
    baseUnit: 'piece',
    packaging: { type: 'sachet', qtyPerPack: 1, packName: 'Sachet' },
    price: { perPack: 20, perUnit: 20 },
    stock: { packs: 500, units: 500 },
    minStockUnits: 100,
    requiresPrescription: false,
    isCommon: true,
    image: 'https://spc.lk/wp-content/uploads/2021/04/jeewani.jpg'
  },

  // Prescription - Common
  {
    name: 'Amoxicillin 500mg',
    brand: 'Various',
    category: 'prescription',
    description: 'Antibiotic used to treat a wide variety of bacterial infections.',
    baseUnit: 'capsule',
    packaging: { type: 'card', qtyPerPack: 10, packName: 'Card of 10' },
    price: { perPack: 350, perUnit: 35 },
    stock: { packs: 80, units: 800 },
    minStockUnits: 50,
    requiresPrescription: true,
    image: 'https://5.imimg.com/data5/SELLER/Default/2021/4/VZ/XO/EY/126938996/amoxicillin-500mg-capsules-500x500.jpg'
  },
  {
    name: 'Metformin 500mg',
    brand: 'Various',
    category: 'prescription',
    description: 'Oral diabetes medicine that helps control blood sugar levels.',
    baseUnit: 'tablet',
    packaging: { type: 'card', qtyPerPack: 15, packName: 'Card of 15' },
    price: { perPack: 120, perUnit: 8 },
    stock: { packs: 120, units: 1800 },
    minStockUnits: 100,
    requiresPrescription: true,
    image: 'https://5.imimg.com/data5/ANDROID/Default/2021/2/VJ/IK/XW/49887702/product-jpeg-500x500.jpg'
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
    console.log(`Inserted ${medicines.length} medicines`);

    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();

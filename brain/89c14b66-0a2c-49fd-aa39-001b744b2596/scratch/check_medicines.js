const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });
const Medicine = require('../server/models/Medicine');

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jayathura-lifecare');
    const count = await Medicine.countDocuments();
    const otcCount = await Medicine.countDocuments({ 
      category: { $ne: 'prescription' }, 
      requiresPrescription: { $ne: true } 
    });
    const inStockOtcCount = await Medicine.countDocuments({ 
      category: { $ne: 'prescription' }, 
      requiresPrescription: { $ne: true }, 
      'stock.units': { $gt: 0 } 
    });
    const allMedicines = await Medicine.find({}).limit(5);
    
    console.log(JSON.stringify({ 
      total: count, 
      otc: otcCount, 
      inStockOtc: inStockOtcCount,
      sample: allMedicines.map(m => ({ name: m.name, category: m.category, requiresPrescription: m.requiresPrescription, stock: m.stock }))
    }, null, 2));
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();

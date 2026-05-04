// Final verification with correct schema
const dns = require('dns');
const mongoose = require('mongoose');
require('dotenv').config();

// Fix MongoDB SRV resolution
const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoUrl && mongoUrl.includes('mongodb+srv://')) {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}

const Medicine = require('../models/Medicine');

async function finalVerification() {
  try {
    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB\n');

    // Total count
    const totalMedicines = await Medicine.countDocuments();
    console.log(`📊 Total medicines in database: ${totalMedicines}\n`);

    // Check for duplicate names
    const duplicateNames = await Medicine.aggregate([
      {
        $group: {
          _id: { $toLower: '$name' },
          count: { $sum: 1 },
          brands: { $push: '$brand' }
        }
      },
      { $match: { count: { $gt: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log(`🔍 Medicines with duplicate names: ${duplicateNames.length}`);
    if (duplicateNames.length > 0) {
      duplicateNames.forEach((dup, idx) => {
        console.log(`   ${idx + 1}. "${dup._id}" (${dup.count} records) - brands: ${dup.brands.join(', ')}`);
      });
    } else {
      console.log('   ✅ No duplicate names found!');
    }

    // Categories breakdown
    console.log('\n📁 Medicines by Category:');
    const categories = await Medicine.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    categories.forEach((cat, idx) => {
      const percentage = ((cat.count / totalMedicines) * 100).toFixed(1);
      console.log(`   ${idx + 1}. ${cat._id}: ${cat.count} medicines (${percentage}%)`);
    });

    // Medicines without categories
    const noCat = await Medicine.countDocuments({ $or: [{ category: null }, { category: undefined }] });
    console.log(`\n⚠️  Medicines without categories: ${noCat}`);

    // Medicines with brand
    const withBrand = await Medicine.countDocuments({ brand: { $exists: true, $ne: null, $ne: '' } });
    console.log(`✅ Medicines with brand: ${withBrand}`);

    // Stock summary
    const stockStats = await Medicine.aggregate([
      {
        $group: {
          _id: null,
          totalPacks: { $sum: '$stock.packs' },
          totalUnits: { $sum: '$stock.units' },
          avgPrice: { $avg: '$price.perPack' }
        }
      }
    ]);

    if (stockStats.length > 0) {
      const stats = stockStats[0];
      console.log(`\n💰 Stock Summary:`);
      console.log(`   Total packs: ${stats.totalPacks}`);
      console.log(`   Total units: ${stats.totalUnits}`);
      console.log(`   Average price per pack: Rs. ${stats.avgPrice.toFixed(2)}`);
    }

    // Low stock items
    const lowStock = await Medicine.countDocuments({ $expr: { $lte: ['$stock.units', '$minStockUnits'] } });
    console.log(`\n⚠️  Medicines with low stock: ${lowStock}`);

    console.log(`\n✅ Database verification complete!`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

finalVerification();

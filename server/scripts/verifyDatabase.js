// Final verification of medicines database
const dns = require('dns');
const mongoose = require('mongoose');
require('dotenv').config();

// Fix MongoDB SRV resolution
const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoUrl && mongoUrl.includes('mongodb+srv://')) {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}

const Medicine = require('../models/Medicine');

async function verifyDatabase() {
  try {
    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB\n');

    // Total count
    const totalMedicines = await Medicine.countDocuments();
    console.log(`📊 Total medicines in database: ${totalMedicines}`);

    // Check medicines with codes
    const withCodes = await Medicine.countDocuments({ code: { $exists: true, $ne: null, $ne: '' } });
    console.log(`✅ Medicines with valid codes: ${withCodes}`);

    // Check medicines without codes
    const noCodes = await Medicine.countDocuments({ $or: [{ code: null }, { code: undefined }, { code: '' }] });
    console.log(`❌ Medicines without codes: ${noCodes}`);

    // Check medicines with categories
    const withCategories = await Medicine.countDocuments({ category: { $exists: true, $ne: null, $ne: '' } });
    console.log(`✅ Medicines with valid categories: ${withCategories}`);

    // Check medicines without categories
    const noCategories = await Medicine.countDocuments({ $or: [{ category: null }, { category: undefined }, { category: '' }] });
    console.log(`❌ Medicines without categories: ${noCategories}`);

    // Check for any remaining duplicates by name
    const duplicateNames = await Medicine.aggregate([
      {
        $group: {
          _id: { $toLower: '$name' },
          count: { $sum: 1 }
        }
      },
      { $match: { count: { $gt: 1 } } }
    ]);
    console.log(`\n🔍 Remaining duplicate names: ${duplicateNames.length}`);

    // Top 10 categories
    const categories = await Medicine.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    console.log(`\n📁 Top 10 Categories:`);
    categories.forEach((cat, idx) => {
      console.log(`   ${idx + 1}. ${cat._id}: ${cat.count} medicines`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Verification complete');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyDatabase();

// Detailed report of duplicate medicines
const dns = require('dns');
const mongoose = require('mongoose');
require('dotenv').config();

// Fix MongoDB SRV resolution
const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoUrl && mongoUrl.includes('mongodb+srv://')) {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}

const Medicine = require('../models/Medicine');

async function generateDetailedReport() {
  try {
    const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUrl) throw new Error('MONGO_URI not set in .env');

    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB\n');

    // Get all medicines with duplicate names
    const duplicateNames = await Medicine.aggregate([
      {
        $group: {
          _id: { $toLower: '$name' },
          count: { $sum: 1 },
          medicines: { 
            $push: { 
              id: '$_id', 
              name: '$name', 
              code: '$code',
              category: '$category',
              price: '$price',
              stock: '$stock',
              isActive: '$isActive',
              manufacturer: '$manufacturer',
              createdAt: '$createdAt'
            } 
          }
        }
      },
      { $match: { count: { $gt: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log(`📋 DETAILED DUPLICATE MEDICINE REPORT\n`);
    console.log(`Total duplicate groups: ${duplicateNames.length}\n`);

    const consolidationPlan = [];

    duplicateNames.forEach((group, index) => {
      console.log(`\n${index + 1}. "${group._id}" (${group.count} records)`);
      console.log('─'.repeat(80));

      group.medicines.forEach((med, idx) => {
        console.log(`\n   Record ${idx + 1}:`);
        console.log(`   ID: ${med.id}`);
        console.log(`   Code: ${med.code}`);
        console.log(`   Category: ${med.category}`);
        console.log(`   Active: ${med.isActive}`);
        console.log(`   Manufacturer: ${med.manufacturer || 'N/A'}`);
        console.log(`   Price: ${JSON.stringify(med.price)}`);
        console.log(`   Stock: ${JSON.stringify(med.stock)}`);
        console.log(`   Created: ${new Date(med.createdAt).toLocaleDateString()}`);
      });

      // Determine which to keep
      const activeRecords = group.medicines.filter(m => m.isActive);
      const toKeep = activeRecords.length > 0 
        ? activeRecords[0] 
        : group.medicines.sort((a, b) => 
            (b.stock?.units || 0 + b.stock?.packs || 0) - 
            (a.stock?.units || 0 + a.stock?.packs || 0)
          )[0];

      const toRemove = group.medicines.filter(m => m.id.toString() !== toKeep.id.toString());

      consolidationPlan.push({
        name: group._id,
        keep: toKeep,
        remove: toRemove
      });

      console.log(`\n   ✅ KEEP: ${toKeep.code} (${toKeep.isActive ? 'Active' : 'Inactive'})`);
      console.log(`   ❌ REMOVE: ${toRemove.map(m => m.code).join(', ')}`);
    });

    console.log(`\n\n${'='.repeat(80)}`);
    console.log(`CONSOLIDATION SUMMARY`);
    console.log(`${'='.repeat(80)}`);
    console.log(`Total duplicates to consolidate: ${consolidationPlan.length}`);
    console.log(`Total records to remove: ${consolidationPlan.reduce((sum, p) => sum + p.remove.length, 0)}`);
    console.log(`Total records to keep: ${consolidationPlan.length}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

generateDetailedReport();

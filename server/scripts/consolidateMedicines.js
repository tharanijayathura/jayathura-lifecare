// Consolidate and deduplicate medicines
const dns = require('dns');
const mongoose = require('mongoose');
require('dotenv').config();

// Fix MongoDB SRV resolution
const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoUrl && mongoUrl.includes('mongodb+srv://')) {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}

const Medicine = require('../models/Medicine');

async function consolidateMedicines() {
  try {
    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB\n');

    // Get all medicines with duplicate names
    const duplicateGroups = await Medicine.aggregate([
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

    console.log(`📋 CONSOLIDATION PLAN`);
    console.log(`Total duplicate groups to consolidate: ${duplicateGroups.length}\n`);

    let totalRemoved = 0;
    let totalConsolidated = 0;

    for (const group of duplicateGroups) {
      // Sort to find best record to keep
      const medicines = group.medicines.sort((a, b) => {
        // Prefer active records
        if (b.isActive !== a.isActive) return b.isActive - a.isActive;
        // Prefer higher stock
        const aStock = (a.stock?.units || 0) + (a.stock?.packs || 0);
        const bStock = (b.stock?.units || 0) + (b.stock?.packs || 0);
        return bStock - aStock;
      });

      const toKeep = medicines[0];
      const toRemove = medicines.slice(1);

      // Consolidate stock to the kept record
      let consolidatedStock = {
        units: toKeep.stock?.units || 0,
        packs: toKeep.stock?.packs || 0
      };

      toRemove.forEach(med => {
        consolidatedStock.units += (med.stock?.units || 0);
        consolidatedStock.packs += (med.stock?.packs || 0);
      });

      // Update kept record with consolidated stock
      await Medicine.updateOne(
        { _id: toKeep.id },
        { 
          $set: { 
            stock: consolidatedStock,
            updatedAt: new Date()
          } 
        }
      );

      // Remove duplicate records
      const removeIds = toRemove.map(m => m.id);
      await Medicine.deleteMany({ _id: { $in: removeIds } });

      console.log(`✅ "${group._id}"`);
      console.log(`   Kept: ${toKeep.code || 'NO_CODE'} | Stock consolidated: ${consolidatedStock.packs} packs, ${consolidatedStock.units} units`);
      console.log(`   Removed: ${toRemove.length} record(s) - ${toRemove.map(m => m.code || 'NO_CODE').join(', ')}`);
      console.log('');

      totalRemoved += toRemove.length;
      totalConsolidated++;
    }

    // Check for medicines without codes
    console.log('\n🔍 Checking for medicines without valid codes...');
    const noCodeMedicines = await Medicine.find({ $or: [{ code: null }, { code: undefined }, { code: '' }] });
    
    if (noCodeMedicines.length > 0) {
      console.log(`❌ Found ${noCodeMedicines.length} medicines without codes`);
      for (let i = 0; i < noCodeMedicines.length; i++) {
        const med = noCodeMedicines[i];
        // Generate code from name
        const nameCode = med.name.substring(0, 3).toUpperCase();
        const newCode = `${nameCode}-${String(i + 1).padStart(3, '0')}`;
        
        await Medicine.updateOne(
          { _id: med._id },
          { $set: { code: newCode } }
        );
        console.log(`   ✅ Generated code: ${newCode} for "${med.name}"`);
      }
    } else {
      console.log('✅ All medicines have valid codes');
    }

    // Validate categories
    console.log('\n🔍 Validating medicine categories...');
    const validCategories = [
      'antibiotics',
      'pain-relief',
      'cold-cough',
      'digestive',
      'vitamins-minerals',
      'skin-care',
      'anti-fungal',
      'anti-bacterial',
      'fever-cough',
      'eye-ear-care',
      'womens-health',
      'dental-care',
      'first-aid',
      'supplements'
    ];

    const invalidCategoryMedicines = await Medicine.find({ 
      $or: [
        { category: null },
        { category: undefined },
        { category: '' }
      ]
    });

    if (invalidCategoryMedicines.length > 0) {
      console.log(`❌ Found ${invalidCategoryMedicines.length} medicines with invalid categories`);
      for (const med of invalidCategoryMedicines) {
        // Assign based on medicine type keywords
        let assignedCategory = 'supplements';
        const lowerName = med.name.toLowerCase();
        
        if (lowerName.includes('antibiotic')) assignedCategory = 'antibiotics';
        else if (lowerName.includes('pain') || lowerName.includes('ibuprofen') || lowerName.includes('aspirin')) assignedCategory = 'pain-relief';
        else if (lowerName.includes('cold') || lowerName.includes('cough')) assignedCategory = 'cold-cough';
        else if (lowerName.includes('digestive') || lowerName.includes('acidity')) assignedCategory = 'digestive';
        else if (lowerName.includes('vitamin') || lowerName.includes('mineral')) assignedCategory = 'vitamins-minerals';
        
        await Medicine.updateOne(
          { _id: med._id },
          { $set: { category: assignedCategory } }
        );
        console.log(`   ✅ Assigned category: ${assignedCategory} to "${med.name}"`);
      }
    } else {
      console.log('✅ All medicines have valid categories');
    }

    // Final summary
    const totalMedicines = await Medicine.countDocuments();
    console.log(`\n\n${'='.repeat(80)}`);
    console.log(`CONSOLIDATION SUMMARY`);
    console.log(`${'='.repeat(80)}`);
    console.log(`✅ Consolidated: ${totalConsolidated} duplicate groups`);
    console.log(`✅ Removed: ${totalRemoved} duplicate records`);
    console.log(`✅ Total medicines in database: ${totalMedicines}`);
    console.log(`✅ Process complete!`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

consolidateMedicines();

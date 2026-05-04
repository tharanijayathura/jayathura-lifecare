// Consolidate and fix all medicine data
const dns = require('dns');
const mongoose = require('mongoose');
require('dotenv').config();

// Fix MongoDB SRV resolution
const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoUrl && mongoUrl.includes('mongodb+srv://')) {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}

const Medicine = require('../models/Medicine');

async function fixAllMedicines() {
  try {
    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB\n');

    // 1. Remove duplicates by name - keep first, remove rest
    console.log('Step 1: Removing duplicate medicines by name...');
    const duplicateGroups = await Medicine.aggregate([
      {
        $group: {
          _id: { $toLower: '$name' },
          count: { $sum: 1 },
          ids: { $push: '$_id' }
        }
      },
      { $match: { count: { $gt: 1 } } }
    ]);

    let removedCount = 0;
    for (const group of duplicateGroups) {
      // Keep first, remove rest
      const toRemove = group.ids.slice(1);
      await Medicine.deleteMany({ _id: { $in: toRemove } });
      removedCount += toRemove.length;
    }
    console.log(`✅ Removed ${removedCount} duplicate medicines\n`);

    // 2. Generate codes for medicines without codes
    console.log('Step 2: Generating codes for medicines without codes...');
    const medicinesWithoutCodes = await Medicine.find({ 
      $or: [{ code: null }, { code: undefined }, { code: { $eq: '' } }]
    });

    for (let i = 0; i < medicinesWithoutCodes.length; i++) {
      const med = medicinesWithoutCodes[i];
      // Generate code from name (first 3 letters + sequential number)
      const nameCode = med.name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
      const newCode = `${nameCode}-${String(i + 1).padStart(4, '0')}`;
      
      await Medicine.updateOne(
        { _id: med._id },
        { $set: { code: newCode, updatedAt: new Date() } }
      );
    }
    console.log(`✅ Generated codes for ${medicinesWithoutCodes.length} medicines\n`);

    // 3. Assign categories to medicines without categories
    console.log('Step 3: Assigning categories to medicines without categories...');
    const medicinesWithoutCategories = await Medicine.find({
      $or: [{ category: null }, { category: undefined }, { category: { $eq: '' } }]
    });

    const categoryKeywords = {
      'antibiotics': ['antibiotic', 'amoxicillin', 'azithromycin', 'ciprofloxacin'],
      'pain-relief': ['pain', 'ibuprofen', 'aspirin', 'paracetamol', 'tramadol'],
      'cold-cough': ['cold', 'cough', 'flu', 'sneeze', 'bisolvon'],
      'digestive': ['digestive', 'acidity', 'antacid', 'omeprazole', 'imodium'],
      'vitamins-minerals': ['vitamin', 'mineral', 'calcium', 'zinc', 'iron'],
      'skin-care': ['skin', 'lotion', 'cream', 'ointment', 'cleanser', 'eucerin'],
      'eye-care': ['eye', 'glasses', 'contact', 'vision'],
      'womens-health': ['women', 'contraceptive', 'menstrual', 'pregnancy'],
      'dental-care': ['dental', 'toothpaste', 'tooth', 'floss'],
      'first-aid': ['first aid', 'kit', 'bandage', 'gauze', 'plaster'],
      'supplements': ['supplement', 'powder', 'capsule', 'tablet']
    };

    for (const med of medicinesWithoutCategories) {
      const lowerName = med.name.toLowerCase();
      let assignedCategory = 'supplements'; // default

      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(kw => lowerName.includes(kw))) {
          assignedCategory = category;
          break;
        }
      }

      await Medicine.updateOne(
        { _id: med._id },
        { $set: { category: assignedCategory, updatedAt: new Date() } }
      );
    }
    console.log(`✅ Assigned categories to ${medicinesWithoutCategories.length} medicines\n`);

    // 4. Verify final state
    console.log('Step 4: Final verification...');
    const totalMedicines = await Medicine.countDocuments();
    const withCodes = await Medicine.countDocuments({ code: { $exists: true, $ne: null, $ne: '' } });
    const withCategories = await Medicine.countDocuments({ category: { $exists: true, $ne: null, $ne: '' } });
    const duplicateNames = await Medicine.aggregate([
      {
        $group: {
          _id: { $toLower: '$name' },
          count: { $sum: 1 }
        }
      },
      { $match: { count: { $gt: 1 } } },
      { $count: 'duplicates' }
    ]);

    const duplicateCount = duplicateNames.length > 0 ? duplicateNames[0].duplicates : 0;

    console.log(`\n${'='.repeat(80)}`);
    console.log(`FINAL SUMMARY`);
    console.log(`${'='.repeat(80)}`);
    console.log(`✅ Total medicines: ${totalMedicines}`);
    console.log(`✅ With valid codes: ${withCodes} (${((withCodes/totalMedicines)*100).toFixed(1)}%)`);
    console.log(`✅ With categories: ${withCategories} (${((withCategories/totalMedicines)*100).toFixed(1)}%)`);
    console.log(`✅ Duplicate names remaining: ${duplicateCount}`);
    console.log(`✅ Cleanup complete!`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

fixAllMedicines();

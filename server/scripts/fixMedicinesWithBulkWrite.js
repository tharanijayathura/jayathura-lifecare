// Fix medicines by bulkWrite
const dns = require('dns');
const mongoose = require('mongoose');
require('dotenv').config();

// Fix MongoDB SRV resolution
const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoUrl && mongoUrl.includes('mongodb+srv://')) {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}

const Medicine = require('../models/Medicine');

async function fixMedicinesWithBulkWrite() {
  try {
    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB\n');

    // Get all medicines
    const medicines = await Medicine.find({}).lean();
    console.log(`Found ${medicines.length} medicines to fix\n`);

    // Prepare bulk operations
    const operations = medicines.map((med, index) => ({
      updateOne: {
        filter: { _id: med._id },
        update: {
          $set: {
            code: `MED-${String(index + 1).padStart(4, '0')}`,
            updatedAt: new Date()
          }
        }
      }
    }));

    // Execute bulk write
    if (operations.length > 0) {
      const result = await Medicine.bulkWrite(operations);
      console.log(`✅ Updated ${result.modifiedCount} medicines with codes\n`);
    }

    // Verify
    const withCodes = await Medicine.countDocuments({ code: { $exists: true, $ne: null, $ne: '' } });
    const sample = await Medicine.findOne({ code: { $ne: null } });
    
    console.log(`Verification:`);
    console.log(`✅ Medicines with codes: ${withCodes}`);
    if (sample) {
      console.log(`✅ Sample: ${sample.name} -> ${sample.code}`);
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixMedicinesWithBulkWrite();

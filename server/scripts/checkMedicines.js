// Check actual medicine data
const dns = require('dns');
const mongoose = require('mongoose');
require('dotenv').config();

// Fix MongoDB SRV resolution
const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoUrl && mongoUrl.includes('mongodb+srv://')) {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}

const Medicine = require('../models/Medicine');

async function checkMedicines() {
  try {
    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB\n');

    // Get a few sample medicines
    const samples = await Medicine.find().limit(5);
    console.log('Sample medicines:');
    samples.forEach((med, idx) => {
      console.log(`\n${idx + 1}. Name: ${med.name}`);
      console.log(`   Code: ${med.code} (type: ${typeof med.code})`);
      console.log(`   Category: ${med.category}`);
      console.log(`   Active: ${med.isActive}`);
      console.log(`   Stock: ${JSON.stringify(med.stock)}`);
    });

    // Check code field type and values
    const withCode = await Medicine.findOne({ code: { $ne: null } });
    if (withCode) {
      console.log(`\n✅ Found medicine with code: ${withCode.name}`);
      console.log(`   Code value: "${withCode.code}"`);
      console.log(`   Code type: ${typeof withCode.code}`);
    } else {
      console.log('\n❌ No medicines with codes found');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkMedicines();

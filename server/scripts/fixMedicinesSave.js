const dns = require('dns');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Fix MongoDB SRV resolution
const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoUrl && mongoUrl.startsWith('mongodb+srv://') && process.env.MONGO_DNS_SERVERS) {
  const dnsServers = process.env.MONGO_DNS_SERVERS
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers.length > 0) {
    dns.setServers(dnsServers);
    console.log('🌐 Using DNS servers for MongoDB SRV lookups:', dnsServers.join(', '));
  }
}

const Medicine = require('../models/Medicine');

const FREQUENTLY_USED_KEYWORDS = [
  'panadol', 'siddhalepa', 'eno', 'vicks', 'cough syrup', 'multivitamin', 
  'vitamin c', 'ors', 'glucose', 'sanitizer', 'mask', 'thermometer', 
  'bandage', 'dettol', 'savlon', 'baby diaper', 'baby lotion'
];

async function fixMedicinesSave() {
  try {
    await mongoose.connect(mongoUrl || 'mongodb://localhost:27017/jayathura-lifecare');
    console.log('✅ Connected to MongoDB');

    const medicines = await Medicine.find({});
    console.log(`🔍 Found ${medicines.length} medicines in the database.`);

    let saveCount = 0;
    let commonCount = 0;

    for (const medicine of medicines) {
      // 1. Check if name matches any frequently used keywords
      const name = (medicine.name || '').toLowerCase();
      const isCommon = FREQUENTLY_USED_KEYWORDS.some(keyword => name.includes(keyword));
      
      if (isCommon && !medicine.isCommon) {
        medicine.isCommon = true;
        commonCount++;
      }

      // 2. Trigger pre-save hook by calling save()
      await medicine.save();
      saveCount++;
      console.log(`💾 Saved & updated: "${medicine.name}" (Code: ${medicine.code}, isCommon: ${medicine.isCommon})`);
    }

    console.log(`\n🎉 Process complete!`);
    console.log(`✅ Triggered save hooks for ${saveCount} medicines.`);
    console.log(`✅ Marked ${commonCount} new medicines as common.`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database fix:', error);
    process.exit(1);
  }
}

fixMedicinesSave();

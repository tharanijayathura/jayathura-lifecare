const mongoose = require('mongoose');
const Medicine = require('../models/Medicine');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const FREQUENTLY_USED_KEYWORDS = [
  'panadol', 'siddhalepa', 'eno', 'vicks', 'cough syrup', 'multivitamin', 
  'vitamin c', 'ors', 'glucose', 'sanitizer', 'mask', 'thermometer', 
  'bandage', 'dettol', 'savlon', 'baby diaper', 'baby lotion'
];

async function markCommonMedicines() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    let count = 0;
    const medicines = await Medicine.find({});
    
    for (const medicine of medicines) {
      const name = (medicine.name || '').toLowerCase();
      const isCommon = FREQUENTLY_USED_KEYWORDS.some(keyword => name.includes(keyword));
      
      if (isCommon) {
        medicine.isCommon = true;
        await medicine.save();
        count++;
        console.log(`Marked as common: ${medicine.name}`);
      }
    }

    console.log(`Finished! Marked ${count} medicines as common.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

markCommonMedicines();

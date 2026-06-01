const dns = require('dns');
const mongoose = require('mongoose');
require('dotenv').config();

const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoUrl && mongoUrl.includes('mongodb+srv://')) {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}

const Medicine = require('../models/Medicine');

async function refine() {
  try {
    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB\n');

    // Panadol 500mg -> use the clear Panadol packaging photo from Wikimedia
    await Medicine.updateOne(
      { code: 'PAN-0001' }, 
      { image: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Panadol_500_mg.jpg' }
    );
    console.log('✅ Refined PAN-0001 to Wikimedia product image');

    // Salicylic Acid Ointment -> use the clear product photo instead of the shop logo
    await Medicine.updateOne(
      { code: 'SAL-0049' }, 
      { image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&q=80' }
    );
    console.log('✅ Refined SAL-0049 to clean product image');

    await mongoose.connection.close();
    console.log('\n🎉 Finished refining.');
  } catch (error) {
    console.error(error);
  }
}

refine();

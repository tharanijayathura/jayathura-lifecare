const dns = require('dns');
const mongoose = require('mongoose');
require('dotenv').config();

const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoUrl && mongoUrl.includes('mongodb+srv://')) {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}

const Medicine = require('../models/Medicine');

async function printDbImages() {
  try {
    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
    const medicines = await Medicine.find().sort({ name: 1 });
    console.log(`Checking ${medicines.length} medicines:`);
    medicines.forEach(m => {
      console.log(`- Code: ${m.code || 'N/A'}, Name: ${m.name}, Image: ${m.image || 'N/A'}`);
    });
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

printDbImages();

// Direct MongoDB check without schema
const dns = require('dns');
const mongoose = require('mongoose');
require('dotenv').config();

// Fix MongoDB SRV resolution
const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoUrl && mongoUrl.includes('mongodb+srv://')) {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}

async function checkRawMongoDB() {
  try {
    const client = await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const medicinesCollection = db.collection('medicines');

    // Get sample documents
    const samples = await medicinesCollection.find({}).limit(3).toArray();
    console.log('Raw sample documents:');
    samples.forEach((doc, idx) => {
      console.log(`\n${idx + 1}. Name: ${doc.name}`);
      console.log(`   Code: ${doc.code} (${doc.code ? 'EXISTS' : 'MISSING'})`);
      console.log(`   Category: ${doc.category}`);
    });

    // Count medicines with code field
    const withCodeField = await medicinesCollection.countDocuments({ code: { $exists: true } });
    console.log(`\n\nDirect MongoDB count - medicines with code field: ${withCodeField}`);

    // Get all fields for one medicine
    const oneMed = await medicinesCollection.findOne({});
    console.log(`\nSample document fields: ${JSON.stringify(Object.keys(oneMed), null, 2)}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkRawMongoDB();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
const User = require('./models/User');
const Medicine = require('./models/Medicine');

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to database.');

  // 1. Reset mwgtharani@gmail.com password to Tharani@123
  const deliveryEmail = 'mwgtharani@gmail.com';
  const newHash = await bcrypt.hash('Tharani@123', 10);
  
  const deliveryUser = await User.findOne({ email: deliveryEmail });
  if (deliveryUser) {
    deliveryUser.password = newHash;
    deliveryUser.isApproved = true;
    deliveryUser.isActive = true;
    await deliveryUser.save();
    console.log(`✅ Set password for delivery user (${deliveryEmail}) to "Tharani@123".`);
  } else {
    console.log(`⚠️ Delivery user ${deliveryEmail} not found in DB!`);
  }

  // 2. Query some OTC and prescription medicines for our E2E tests
  const otcMeds = await Medicine.find({ requiresPrescription: { $ne: true }, category: { $ne: 'prescription' }, 'stock.units': { $gt: 5 } }).limit(3);
  const rxMeds = await Medicine.find({ requiresPrescription: true, 'stock.units': { $gt: 5 } }).limit(3);

  console.log('\n--- OTC MEDICINES ---');
  otcMeds.forEach(m => console.log(`ID: ${m._id} | Name: ${m.name} | Price/Pack: ${m.price.perPack} | Stock units: ${m.stock.units}`));

  console.log('\n--- RX MEDICINES ---');
  rxMeds.forEach(m => console.log(`ID: ${m._id} | Name: ${m.name} | Price/Pack: ${m.price.perPack} | Stock units: ${m.stock.units}`));

  await mongoose.connection.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

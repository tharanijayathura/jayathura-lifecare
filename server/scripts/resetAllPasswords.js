// server/scripts/resetAllPasswords.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');
const User = require('../models/User');
require('dotenv').config();

async function resetAll() {
  try {
    const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUrl) {
      throw new Error('MONGO_URI not set in .env');
    }

    if (mongoUrl.startsWith('mongodb+srv://') && process.env.MONGO_DNS_SERVERS) {
      const dnsServers = process.env.MONGO_DNS_SERVERS
        .split(',')
        .map((server) => server.trim())
        .filter(Boolean);

      if (dnsServers.length > 0) {
        dns.setServers(dnsServers);
        console.log('🌐 Using DNS servers for MongoDB SRV lookups:', dnsServers.join(', '));
      }
    }

    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 15000 });
    console.log('✅ Connected to MongoDB');

    // Find all users who are not super admin (role !== 'admin')
    const users = await User.find({ role: { $ne: 'admin' } });
    console.log(`Found ${users.length} users to update (excluding admins)...`);

    const newPassword = 'Tharani@123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    let updatedCount = 0;
    for (const user of users) {
      user.password = hashedPassword;
      await user.save();
      updatedCount++;
    }

    console.log(`✅ Successfully updated passwords for ${updatedCount} users to "${newPassword}"!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

resetAll();

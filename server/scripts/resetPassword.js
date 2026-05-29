// server/scripts/resetPassword.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');
const User = require('../models/User');
require('dotenv').config();

async function resetPassword() {
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
    console.log('✅ Connected to MongoDB\n');

    // Get email and new password from command line
    const email = process.argv[2];
    const newPassword = process.argv[3];

    if (!email || !newPassword) {
      console.log('Usage: node scripts/resetPassword.js <email> <newPassword>');
      console.log('Example: node scripts/resetPassword.js vmsdatacheck@gmail.com Tharani@123');
      process.exit(1);
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      console.log(`❌ User not found: ${normalizedEmail}`);
      process.exit(1);
    }

    console.log(`✅ User found: ${user.name} (${user.email})`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Current password hash: ${user.password.substring(0, 20)}...\n`);

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    user.password = hashedPassword;
    await user.save();

    console.log('✅ Password updated successfully!');
    console.log(`   New password hash: ${user.password.substring(0, 20)}...\n`);

    // Verify the new password
    const verify = await bcrypt.compare(newPassword, user.password);
    console.log(`🔐 Verification: ${verify ? '✅ Password matches' : '❌ Password mismatch'}\n`);

    console.log('📝 You can now login with:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${newPassword}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

resetPassword();


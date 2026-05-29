const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function updatePassword() {
  try {
    const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUrl) {
      throw new Error('MONGO_URI not set in .env');
    }

    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 15000 });
    console.log('✅ Connected to MongoDB\n');

    const email = process.argv[2];
    const newPassword = process.argv[3];

    if (!email || !newPassword) {
      console.error('❌ Usage: node updatePassword.js <email> <newPassword>');
      process.exit(1);
    }

    console.log('=== UPDATING PASSWORD ===');
    console.log(`Email: ${email}`);
    console.log(`New Password: ${newPassword.substring(0, 3)}***\n`);

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.log('❌ USER NOT FOUND');
      process.exit(1);
    }

    console.log('✅ User found:', user.name);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log('✅ Password updated successfully!\n');
    console.log('User can now login with:');
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${newPassword}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

updatePassword();

// server/scripts/inspectUser.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function inspect() {
  try {
    const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUrl) throw new Error('MONGO_URI not set in .env');

    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
    console.log('Connected to MongoDB');

    const email = process.argv[2] || process.env.INSPECT_EMAIL;
    const testPassword = process.argv[3] || process.env.ADMIN_PASSWORD || process.env.SUPER_ADMIN_PASSWORD;

    if (!email) {
      console.error('Usage: node scripts/inspectUser.js <email> [passwordToTest]');
      process.exit(1);
    }

    const user = await User.findOne({ email: email.toLowerCase() }).lean();
    if (!user) {
      console.log('User not found for email:', email);
      process.exit(0);
    }

    const { _id, email: uemail, name, role, isSuperAdmin, isApproved, isActive, createdAt, updatedAt } = user;
    console.log('User found:', { _id, uemail, name, role, isSuperAdmin, isApproved, isActive, createdAt, updatedAt });

    if (testPassword) {
      const match = await bcrypt.compare(testPassword, user.password || '');
      console.log('Password matches provided test password?', match);
    } else {
      console.log('No test password provided. To test, re-run with the password as second argument.');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error inspecting user:', err);
    process.exit(1);
  }
}

inspect();

// server/scripts/seedUsers.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const users = [
  {
    name: 'Super Admin',
    email: 'jayathuralifecare@gmail.com',
    password: process.env.ADMIN_PASSWORD || 'AdminPass123!',
    role: 'admin',
    phone: '0700000000',
    isSuperAdmin: true
  }
];

async function seed() {
  try {
    const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUrl) {
      throw new Error('MONGO_URI not set in .env');
    }

    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB for seeding');

    for (const u of users) {
      const existing = await User.findOne({ email: u.email.toLowerCase() });
      if (existing) {
        console.log(`⏭️  User already exists: ${u.email}`);
        continue;
      }

      const hashed = await bcrypt.hash(u.password, 10);
      const userData = {
        name: u.name,
        email: u.email.toLowerCase(),
        password: hashed,
        role: u.role,
        phone: u.phone,
        isSuperAdmin: u.isSuperAdmin || false,
        isApproved: true, // Super admin is auto-approved
      };

      const user = new User(userData);
      await user.save();
      console.log(`✅ Created ${u.isSuperAdmin ? 'SUPER ADMIN' : u.role}:`, u.email);
    }

    console.log('✅ Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();


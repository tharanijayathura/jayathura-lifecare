// server/scripts/upsertSuperAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function upsert() {
  try {
    const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUrl) throw new Error('MONGO_URI not set in .env');

    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
    console.log('Connected to MongoDB');

    const id = '696c2062c511b74175d11023';
    const email = 'jayathuralifecare@gmail.com';
    const passwordPlain = process.env.SUPER_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || 'SuperAdmin@123';

    const hashed = await bcrypt.hash(passwordPlain, 10);

    // Try to find by id or email
    const existingById = await User.findById(id);
    if (existingById) {
      existingById.email = email.toLowerCase();
      existingById.role = 'admin';
      existingById.isSuperAdmin = true;
      existingById.isApproved = true;
      existingById.isActive = true;
      existingById.password = hashed;
      await existingById.save();
      console.log('Updated existing user by id to SUPER ADMIN:', email);
      process.exit(0);
    }

    const existingByEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingByEmail) {
      existingByEmail.role = 'admin';
      existingByEmail.isSuperAdmin = true;
      existingByEmail.isApproved = true;
      existingByEmail.isActive = true;
      existingByEmail.password = hashed;
      await existingByEmail.save();
      console.log('Updated existing user by email to SUPER ADMIN:', email);
      process.exit(0);
    }

    // Create new user with provided id
    const userData = {
      _id: mongoose.Types.ObjectId(id),
      name: 'Super Admin',
      email: email.toLowerCase(),
      password: hashed,
      role: 'admin',
      phone: '0700000000',
      isSuperAdmin: true,
      isApproved: true,
      isActive: true,
    };

    const user = new User(userData);
    await user.save();
    console.log('Created SUPER ADMIN:', email);
    console.log('Password:', passwordPlain);
    process.exit(0);
  } catch (err) {
    console.error('Error upserting super admin:', err);
    process.exit(1);
  }
}

upsert();

// server/scripts/checkLogin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function checkLogin() {
  try {
    const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUrl) {
      throw new Error('MONGO_URI not set in .env');
    }

    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 15000 });
    console.log('✅ Connected to MongoDB\n');

    // Get email from command line or use default
    const email = process.argv[2] || 'jayathuralifecare@gmail.com';
    const password = process.argv[3] || 'AdminPass123!';

    console.log('=== CHECKING LOGIN ===');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password.substring(0, 3)}***\n`);

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      console.log('❌ USER NOT FOUND');
      console.log(`No user found with email: ${normalizedEmail}`);
      console.log('\n📝 Available users in database:');
      const allUsers = await User.find().select('name email role isApproved isActive');
      allUsers.forEach(u => {
        console.log(`  - ${u.email} (${u.role}) - Approved: ${u.isApproved}, Active: ${u.isActive}`);
      });
      process.exit(1);
    }

    console.log('✅ USER FOUND:');
    console.log(`  Name: ${user.name}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  isApproved: ${user.isApproved}`);
    console.log(`  isActive: ${user.isActive}`);
    console.log(`  isSuperAdmin: ${user.isSuperAdmin || false}\n`);

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(`🔐 Password Match: ${passwordMatch ? '✅ YES' : '❌ NO'}`);

    // Check login conditions
    console.log('\n=== LOGIN CHECKS ===');
    
    if (!passwordMatch) {
      console.log('❌ LOGIN FAILED: Password does not match');
      process.exit(1);
    }

    if (!user.isActive) {
      console.log('❌ LOGIN FAILED: Account is deactivated');
      console.log('   Message: "Account is deactivated. Please contact administrator."');
      process.exit(1);
    }

    if (user.role !== 'patient' && !user.isApproved) {
      console.log('❌ LOGIN FAILED: Account is pending approval');
      console.log('   Message: "Your account is pending approval. Please wait for administrator approval."');
      console.log('\n💡 Solution:');
      console.log('   1. Login as super admin');
      console.log('   2. Go to Admin Portal → User Approvals');
      console.log('   3. Approve this user');
      process.exit(1);
    }

    console.log('✅ ALL CHECKS PASSED - User can login!');
    console.log('\n📝 Login will succeed with these credentials');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkLogin();


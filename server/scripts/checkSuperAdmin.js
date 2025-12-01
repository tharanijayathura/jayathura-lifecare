// server/scripts/checkSuperAdmin.js
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function checkSuperAdmin() {
  try {
    const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUrl) {
      console.log('❌ MONGO_URI not set in .env');
      process.exit(1);
    }

    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB');

    const superAdmin = await User.findOne({ 
      email: 'jayathuralifecare@gmail.com' 
    });

    if (superAdmin) {
      console.log('\n✅ Super Admin account EXISTS:');
      console.log('   Email:', superAdmin.email);
      console.log('   Name:', superAdmin.name);
      console.log('   Role:', superAdmin.role);
      console.log('   isSuperAdmin:', superAdmin.isSuperAdmin);
      console.log('   isApproved:', superAdmin.isApproved);
      console.log('   isActive:', superAdmin.isActive);
      console.log('\n📝 Login credentials:');
      console.log('   Email: jayathuralifecare@gmail.com');
      console.log('   Password: AdminPass123! (or check ADMIN_PASSWORD in .env)');
    } else {
      console.log('\n❌ Super Admin account NOT FOUND');
      console.log('\n📝 To create it, run:');
      console.log('   npm run seed');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkSuperAdmin();


// server/scripts/listAllUsers.js
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function listUsers() {
  try {
    const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUrl) {
      throw new Error('MONGO_URI not set in .env');
    }

    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 15000 });
    console.log('✅ Connected to MongoDB\n');

    const users = await User.find().select('name email role isApproved isActive phone createdAt');
    
    console.log(`=== ALL USERS (${users.length}) ===\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Approved: ${user.isApproved}`);
      console.log(`   Active: ${user.isActive}`);
      console.log(`   Phone: ${user.phone || 'N/A'}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('');
    });

    // Search for specific email
    const searchEmail = process.argv[2];
    if (searchEmail) {
      const normalized = searchEmail.toLowerCase().trim();
      const found = users.find(u => u.email.toLowerCase() === normalized);
      if (found) {
        console.log(`\n✅ Found user: ${found.name} (${found.email})`);
      } else {
        console.log(`\n❌ User not found: ${searchEmail}`);
        console.log('Similar emails:');
        users.forEach(u => {
          if (u.email.toLowerCase().includes(normalized.substring(0, 5))) {
            console.log(`  - ${u.email}`);
          }
        });
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

listUsers();


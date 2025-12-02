// server/scripts/checkUsersDirect.js
const mongoose = require('mongoose');
require('dotenv').config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    
    console.log(`=== USERS IN DATABASE: ${users.length} ===\n`);
    
    if (users.length === 0) {
      console.log('⚠️  No users found in the users collection');
      console.log('\nThis means:');
      console.log('1. The user was created in a different database');
      console.log('2. The user was deleted');
      console.log('3. You need to register/create the user again');
    } else {
      users.forEach((u, i) => {
        console.log(`${i + 1}. ${u.name || 'No name'}`);
        console.log(`   Email: ${u.email}`);
        console.log(`   Role: ${u.role}`);
        console.log(`   ID: ${u._id}`);
        console.log(`   isApproved: ${u.isApproved}`);
        console.log(`   isActive: ${u.isActive}`);
        console.log('');
      });

      // Check for specific email
      const searchEmail = process.argv[2];
      if (searchEmail) {
        const normalized = searchEmail.toLowerCase().trim();
        const found = users.find(u => u.email && u.email.toLowerCase() === normalized);
        if (found) {
          console.log(`\n✅ FOUND: ${found.name} (${found.email})`);
          console.log(`   Role: ${found.role}`);
          console.log(`   Password hash: ${found.password ? found.password.substring(0, 30) + '...' : 'No password'}`);
        } else {
          console.log(`\n❌ NOT FOUND: ${searchEmail}`);
        }
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkUsers();


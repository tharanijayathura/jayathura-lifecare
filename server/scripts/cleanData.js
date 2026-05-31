// server/scripts/cleanData.js
const mongoose = require('mongoose');
const dns = require('dns');
const User = require('../models/User');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const Prescription = require('../models/Prescription');
const RefillPlan = require('../models/RefillPlan');
const Chat = require('../models/Chat');
require('dotenv').config();

async function cleanData() {
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
      }
    }

    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 15000 });
    console.log('✅ Connected to MongoDB');

    const allowedEmails = [
      'jayathuralifecare@gmail.com',
      'tharanijayathura1@gmail.com',
      'vmsdatacheck@gmail.com',
      'mwgtharani@gmail.com'
    ];

    console.log('🧹 Cleaning Users...');
    const deletedUsers = await User.deleteMany({ email: { $nin: allowedEmails } });
    console.log(`   Deleted ${deletedUsers.deletedCount} users. kept: ${allowedEmails.join(', ')}`);

    console.log('🧹 Cleaning Orders...');
    const deletedOrders = await Order.deleteMany({});
    console.log(`   Deleted ${deletedOrders.deletedCount} orders.`);

    console.log('🧹 Cleaning Invoices...');
    const deletedInvoices = await Invoice.deleteMany({});
    console.log(`   Deleted ${deletedInvoices.deletedCount} invoices.`);

    console.log('🧹 Cleaning Prescriptions...');
    const deletedPrescriptions = await Prescription.deleteMany({});
    console.log(`   Deleted ${deletedPrescriptions.deletedCount} prescriptions.`);

    console.log('🧹 Cleaning Refill Plans...');
    const deletedRefillPlans = await RefillPlan.deleteMany({});
    console.log(`   Deleted ${deletedRefillPlans.deletedCount} refill plans.`);

    console.log('🧹 Cleaning Chat Logs...');
    const deletedChats = await Chat.deleteMany({});
    console.log(`   Deleted ${deletedChats.deletedCount} chat logs.`);

    console.log('\n✨ Database cleanup complete! Ready for a fresh demo.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

cleanData();

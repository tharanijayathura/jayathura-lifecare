const mongoose = require('mongoose');
const path = require('path');
const dns = require('dns');
require('dotenv').config();
const User = require('./models/User');
const Order = require('./models/Order');
const Prescription = require('./models/Prescription');
const RefillPlan = require('./models/RefillPlan');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
if (MONGO_URI && MONGO_URI.startsWith('mongodb+srv://')) {
  const dnsServers = (process.env.MONGO_DNS_SERVERS || '1.1.1.1,8.8.8.8')
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers.length > 0) {
    dns.setServers(dnsServers);
    console.log('🌐 Using DNS servers for MongoDB SRV lookups:', dnsServers.join(', '));
  }
}

async function check() {
  try {
    await mongoose.connect(MONGO_URI);
    const userId = "692db2db1b021455acc2680b";
    
    const user = await User.findById(userId).select('-password');
    const ordersCount = await Order.countDocuments({ patientId: userId });
    const prescriptionsCount = await Prescription.countDocuments({ patientId: userId });
    
    let refillPlansCount = 0;
    try {
      refillPlansCount = await RefillPlan.countDocuments({ 
        patientId: userId, 
        isActive: true 
      });
    } catch (e) {
      console.log("RefillPlan model might not exist or error:", e.message);
    }

    const responseData = {
      user: user,
      stats: {
        totalOrders: ordersCount,
        totalPrescriptions: prescriptionsCount,
        activeRefillPlans: refillPlansCount
      }
    };
    
    console.log(JSON.stringify(responseData, null, 2));
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();

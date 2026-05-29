const dns = require('dns');
const mongoose = require('mongoose');
require('dotenv').config();

const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoUrl && mongoUrl.includes('mongodb+srv://')) {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}

const User = require('../models/User');
const Order = require('../models/Order');

async function testAlerts() {
  try {
    console.log('Connecting to:', mongoUrl);
    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
    console.log('Connected!');

    console.log('Querying chronic patients...');
    const chronicPatients = await User.find({ flaggedAsChronic: true, role: 'patient' });
    console.log(`Found ${chronicPatients.length} chronic patients.`);

    const alerts = [];
    const now = new Date();

    for (const patient of chronicPatients) {
      console.log(`Checking patient: ${patient.name}`);
      const orders = await Order.find({
        patientId: patient._id,
        status: 'delivered',
        type: { $in: ['prescription', 'mixed'] }
      }).sort({ deliveredAt: -1, updatedAt: -1 });

      console.log(`Found ${orders.length} delivered prescription/mixed orders.`);

      for (const order of orders) {
        const duration = order.supplyDuration || 7;
        const deliveryDate = order.deliveredAt || order.updatedAt || order.createdAt;
        
        const runOutDate = new Date(deliveryDate);
        runOutDate.setDate(runOutDate.getDate() + duration);

        const diffTime = runOutDate.getTime() - now.getTime();
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        console.log(`Order #${order.orderId || order._id}: duration=${duration}, deliveryDate=${deliveryDate}, runOutDate=${runOutDate}, daysRemaining=${daysRemaining}`);

        if (daysRemaining <= 1 && daysRemaining >= -14) {
          const medsList = (order.items || []).map(i => i.medicineName).join(', ');
          
          let alertStatus = '';
          if (daysRemaining === 1) {
            alertStatus = 'Running out tomorrow';
          } else if (daysRemaining === 0) {
            alertStatus = 'Runs out today';
          } else {
            alertStatus = `Expired ${Math.abs(daysRemaining)} days ago`;
          }

          alerts.push({
            patientName: patient.name,
            alertStatus,
            medicines: medsList
          });
        }
      }
    }

    console.log('Alerts:', alerts);
    await mongoose.connection.close();
  } catch (error) {
    console.error('Test error:', error);
  }
}

testAlerts();

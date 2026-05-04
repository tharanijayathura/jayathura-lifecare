const mongoose = require('mongoose');
const path = require('path');
const dns = require('dns');
require('dotenv').config();
const User = require('./models/User');

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
    const user = await User.findOne({ email: 'vmsdatacheck@gmail.com' });
    console.log(JSON.stringify(user, null, 2));
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();

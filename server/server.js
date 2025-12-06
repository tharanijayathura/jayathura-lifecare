// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/groceries', require('./routes/groceries'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/pharmacists', require('./routes/pharmacists'));

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Note: Medicine routes are now handled by /api/medicines route

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Jayathura LifeCare API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/api/health', async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStates = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  let dbStatus = dbStates[dbState] || 'Unknown';
  let dbHealthy = dbState === 1;

  // Try a simple query to verify connection is actually working
  if (dbState === 1) {
    try {
      await mongoose.connection.db.admin().ping();
      dbStatus = 'Connected & Healthy';
    } catch (err) {
      dbStatus = 'Connected but Unhealthy';
      dbHealthy = false;
    }
  }

  res.json({ 
    status: dbHealthy ? 'OK' : 'Degraded',
    database: {
      state: dbStatus,
      readyState: dbState,
      healthy: dbHealthy
    },
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Database connection
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
if (MONGO_URI) {
  // Clean the URI - remove port number if it's a mongodb+srv URI
  let cleanedUri = MONGO_URI.trim();
  const originalUri = cleanedUri;
  
  // Check for placeholder
  if (cleanedUri.includes('<CLUSTER-URL>')) {
    console.log('❌ ERROR: MONGO_URI contains <CLUSTER-URL> placeholder!');
    console.log('   Please replace <CLUSTER-URL> with: cluster0.odyxp5v.mongodb.net');
    console.log('   And add @ symbol after password');
    console.log('   Correct format: mongodb+srv://user:pass@cluster0.odyxp5v.mongodb.net/database');
    console.log('   Your current URI:', cleanedUri.substring(0, 100) + '...');
  }
  
  // Replace placeholder if it exists
  if (cleanedUri.includes('<CLUSTER-URL>')) {
    console.log('🔧 Auto-fixing <CLUSTER-URL> placeholder...');
    // Replace placeholder and add @ if missing
    if (cleanedUri.includes('mongodb+srv://')) {
      // Pattern: mongodb+srv://user:pass<CLUSTER-URL>/db
      // Need to add @ before cluster URL
      cleanedUri = cleanedUri.replace('mongodb+srv://', 'mongodb+srv://');
      cleanedUri = cleanedUri.replace('<CLUSTER-URL>', '@cluster0.odyxp5v.mongodb.net');
      // If @ is already there, fix it
      cleanedUri = cleanedUri.replace('@@', '@');
      console.log('✅ Auto-fixed placeholder');
      console.log('⚠️  Please update your .env file manually for permanent fix');
    }
  }
  
  // Debug: Show the URI (masked for security)
  const maskedUri = cleanedUri.replace(/:([^:@]+)@/, ':***@');
  console.log('🔍 Checking MongoDB URI:', maskedUri.substring(0, 80) + '...');
  
  // If it's a mongodb+srv URI, remove any port numbers
  if (cleanedUri.startsWith('mongodb+srv://')) {
    // Use a more comprehensive approach to remove port numbers
    // Pattern: mongodb+srv://[user:pass@]host[:port]/database[?options]
    
    try {
      // Parse the URI manually to handle all cases
      const protocol = 'mongodb+srv://';
      const afterProtocol = cleanedUri.substring(protocol.length);
      
      // Find @ to separate credentials from host
      const atIndex = afterProtocol.indexOf('@');
      let credentials = '';
      let hostAndPath = afterProtocol;
      
      if (atIndex > 0) {
        credentials = afterProtocol.substring(0, atIndex + 1); // Include @
        hostAndPath = afterProtocol.substring(atIndex + 1);
      }
      
      // Find where host ends (/, ?, or end of string)
      let hostEndIndex = hostAndPath.length;
      const slashIndex = hostAndPath.indexOf('/');
      const queryIndex = hostAndPath.indexOf('?');
      
      if (slashIndex >= 0) hostEndIndex = Math.min(hostEndIndex, slashIndex);
      if (queryIndex >= 0) hostEndIndex = Math.min(hostEndIndex, queryIndex);
      
      const hostPart = hostAndPath.substring(0, hostEndIndex);
      const pathPart = hostAndPath.substring(hostEndIndex);
      
      // Remove port from host (check if last segment after : is a number)
      let cleanHost = hostPart;
      const lastColonIndex = hostPart.lastIndexOf(':');
      if (lastColonIndex > 0) {
        const afterColon = hostPart.substring(lastColonIndex + 1);
        // If what comes after the last colon is all digits, it's a port
        if (/^\d+$/.test(afterColon)) {
          cleanHost = hostPart.substring(0, lastColonIndex);
        }
      }
      
      // Reconstruct the URI
      cleanedUri = protocol + credentials + cleanHost + pathPart;
      
      // Remove any port-related query parameters
      cleanedUri = cleanedUri.replace(/[?&]port=\d+/gi, '');
      cleanedUri = cleanedUri.replace(/\?&/, '?');
      cleanedUri = cleanedUri.replace(/\?\?/, '?');
      cleanedUri = cleanedUri.replace(/\?$/, ''); // Remove trailing ?
      
    } catch (parseError) {
      console.log('⚠️  Error parsing URI, using regex fallback');
      // Fallback: simple regex replacement
      cleanedUri = cleanedUri.replace(/:\d+(\/|\?|$)/g, '$1');
    }
    
    if (originalUri !== cleanedUri) {
      console.log('🔧 Cleaned MongoDB URI (removed port number)');
      console.log('   Original (first 70):', originalUri.substring(0, 70) + '...');
      console.log('   Cleaned (first 70): ', cleanedUri.substring(0, 70) + '...');
    } else {
      console.log('✅ MongoDB URI appears clean (no port number detected)');
    }
    
    // Final check: verify no port numbers remain
    const portPattern = /:\d+(\/|\?|$)/;
    if (portPattern.test(cleanedUri)) {
      console.log('⚠️  WARNING: Port number still detected in cleaned URI!');
      console.log('   Attempting additional cleanup...');
      cleanedUri = cleanedUri.replace(/:\d+(\/|\?|$)/g, '$1');
      console.log('   Final cleaned URI (first 70):', cleanedUri.substring(0, 70) + '...');
    }
  }
  
  // Final validation and aggressive cleaning before connecting
  if (cleanedUri.startsWith('mongodb+srv://')) {
    // One more aggressive pass - remove ANY :number pattern in the host part
    const parts = cleanedUri.split('@');
    if (parts.length === 2) {
      const [credentials, hostAndPath] = parts;
      const hostPart = hostAndPath.split('/')[0].split('?')[0];
      const pathPart = hostAndPath.substring(hostPart.length);
      
      // Remove any :number from the end of host
      const cleanHost = hostPart.replace(/:\d+$/, '');
      
      if (hostPart !== cleanHost) {
        console.log('🔧 Additional cleanup: Removed port from host');
        cleanedUri = credentials + '@' + cleanHost + pathPart;
      }
    }
    
    // Final check - if still has port, use regex as last resort
    if (/:\d+(\/|\?|$)/.test(cleanedUri)) {
      console.log('⚠️  Final cleanup pass using regex');
      cleanedUri = cleanedUri.replace(/:\d+(\/|\?|$)/g, '$1');
    }
    
    // Verify the cleaned URI one more time
    const hostAfterAt = cleanedUri.split('@')[1];
    if (hostAfterAt) {
      const hostOnly = hostAfterAt.split('/')[0].split('?')[0];
      if (/:\d+$/.test(hostOnly)) {
        console.log('⚠️  Still detecting port in host, forcing removal...');
        const cleanHostOnly = hostOnly.replace(/:\d+$/, '');
        cleanedUri = cleanedUri.replace(hostOnly, cleanHostOnly);
      }
    }
    
    console.log('📋 Final URI to use (masked):', cleanedUri.replace(/:([^:@]+)@/, ':***@').substring(0, 80) + '...');
  }
  
  // MongoDB connection options for better reliability
  const mongooseOptions = {
    serverSelectionTimeoutMS: 30000, // Increased to 30 seconds
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    maxPoolSize: 10, // Maintain up to 10 socket connections
    minPoolSize: 2, // Maintain at least 2 socket connections
    retryWrites: true,
    retryReads: true,
    // Handle replica set issues
    readPreference: 'primaryPreferred', // Fallback to secondary if primary unavailable
  };

  // Connect with error handling and retry logic
  (async () => {
    let retryCount = 0;
    const maxRetries = 3;
    
    const connectWithRetry = async () => {
      try {
        await mongoose.connect(cleanedUri, mongooseOptions);
        console.log('✅ MongoDB connected successfully');
        const dbName = mongoose.connection.db.databaseName;
        console.log('📊 Database:', dbName);
        
        // Check if database name matches expected
        if (dbName !== 'jayathurapharmacy-project') {
          console.log('⚠️  WARNING: Connected to database "' + dbName + '"');
          console.log('   Expected: "jayathurapharmacy-project"');
          console.log('   Check your MONGO_URI in .env file');
          console.log('   Current URI database:', cleanedUri.split('/').pop()?.split('?')[0] || 'unknown');
        }
      } catch (err) {
        retryCount++;
        console.log(`❌ MongoDB connection error (Attempt ${retryCount}/${maxRetries}):`, err.message);
        console.log('💡 Error code:', err.code);
        
        if (err.name === 'MongoServerSelectionError' || err.message.includes('ReplicaSetNoPrimary')) {
          console.log('⚠️  MongoDB Atlas replica set issue detected.');
          console.log('   This is usually temporary. The connection will retry automatically.');
          if (retryCount < maxRetries) {
            console.log(`   Retrying in 5 seconds... (${retryCount}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            return connectWithRetry();
          } else {
            console.log('   Max retries reached. Please check:');
            console.log('   1. MongoDB Atlas cluster is running');
            console.log('   2. Network Access IP is whitelisted (0.0.0.0/0 for all)');
            console.log('   3. Database user has correct permissions');
          }
        } else if (err.message.includes('port number')) {
          console.log('⚠️  mongodb+srv URIs cannot have port numbers.');
          console.log('   The URI cleaning may have failed.');
          console.log('   Original URI (first 70):', originalUri.substring(0, 70) + '...');
          console.log('   Cleaned URI (first 70):', cleanedUri.substring(0, 70) + '...');
          console.log('   Please manually check your .env file and remove any :port');
          console.log('   Correct format: mongodb+srv://user:pass@cluster.mongodb.net/database');
        } else if (err.code === 'ENOTFOUND') {
          console.log('⚠️  DNS resolution failed. Check:');
          console.log('   1. Cluster URL is correct in MongoDB Atlas');
          console.log('   2. Network Access IP is whitelisted');
          console.log('   3. Connection string has no spaces/line breaks');
        }
      }
    };

    await connectWithRetry();
  })();

  // Handle connection events
  mongoose.connection.on('connected', () => {
    console.log('✅ Mongoose connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err.message);
    // Don't crash the app, just log the error
  });

  mongoose.connection.on('disconnected', () => {
    console.log('⚠️  Mongoose disconnected from MongoDB');
    console.log('   Attempting to reconnect...');
  });

  // Handle process termination
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  });
} else {
  console.log('⚠️  MongoDB URI not set, using mock data');
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🔑 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`💊 Medicines API: http://localhost:${PORT}/api/medicines`);
});
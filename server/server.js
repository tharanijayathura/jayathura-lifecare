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

// Mock data routes for testing
app.get('/api/medicines', (req, res) => {
  const mockMedicines = [
    {
      id: 1,
      name: 'Paracetamol',
      brand: 'Panadol',
      category: 'otc',
      price: 25.00,
      stock: 100,
      description: 'Pain reliever and fever reducer'
    },
    {
      id: 2,
      name: 'Vitamin C',
      brand: 'Cee',
      category: 'otc',
      price: 15.00,
      stock: 50,
      description: 'Immune system support'
    },
    {
      id: 3,
      name: 'Amoxicillin',
      brand: 'Amoxil',
      category: 'prescription',
      price: 45.00,
      stock: 30,
      description: 'Antibiotic for bacterial infections'
    }
  ];
  res.json(mockMedicines);
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Jayathura LifeCare API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Database connection (optional for now)
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => console.log('❌ MongoDB connection error:', err));
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
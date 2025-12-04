// server/routes/groceries.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Grocery = require('../models/Grocery');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/groceries';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'grocery-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// GET /api/groceries - Get all groceries (public)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const groceries = await Grocery.find(query)
      .select('-stockAlert')
      .sort({ createdAt: -1 });
    
    res.json(groceries);
  } catch (error) {
    console.error('Get groceries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/groceries/admin - Get all groceries for admin (with stock alerts)
router.get('/admin', adminMiddleware, async (req, res) => {
  try {
    const { includeInactive } = req.query;
    const query = {};
    
    // Only show active groceries by default, unless includeInactive is true
    if (includeInactive !== 'true') {
      query.$or = [
        { isActive: true },
        { isActive: { $exists: false } } // For backward compatibility with old records
      ];
    }
    
    const groceries = await Grocery.find(query)
      .populate('stockAlert.alertedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(groceries);
  } catch (error) {
    console.error('Get groceries (admin) error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/groceries/:id - Get single grocery
router.get('/:id', async (req, res) => {
  try {
    const grocery = await Grocery.findById(req.params.id);
    if (!grocery) {
      return res.status(404).json({ message: 'Grocery not found' });
    }
    res.json(grocery);
  } catch (error) {
    console.error('Get grocery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/groceries - Create new grocery (admin only)
router.post('/', adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, stock, minStock, unit } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }
    
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/groceries/${req.file.filename}`;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }
    
    const grocery = new Grocery({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      minStock: parseInt(minStock) || 10,
      unit: unit || 'item',
      image: imageUrl
    });
    
    await grocery.save();
    res.status(201).json(grocery);
  } catch (error) {
    console.error('Create grocery error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/groceries/:id - Update grocery (admin only)
router.put('/:id', adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, stock, minStock, unit } = req.body;
    
    const grocery = await Grocery.findById(req.params.id);
    if (!grocery) {
      return res.status(404).json({ message: 'Grocery not found' });
    }
    
    // Update fields
    if (name) grocery.name = name;
    if (description !== undefined) grocery.description = description;
    if (price) grocery.price = parseFloat(price);
    if (stock !== undefined) grocery.stock = parseInt(stock);
    if (minStock !== undefined) grocery.minStock = parseInt(minStock);
    if (unit) grocery.unit = unit;
    
    // Handle image update
    if (req.file) {
      // Delete old image if exists
      if (grocery.image && grocery.image.startsWith('/uploads/')) {
        const oldPath = grocery.image.substring(1);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      grocery.image = `/uploads/groceries/${req.file.filename}`;
    } else if (req.body.image !== undefined) {
      // If empty string is sent, remove the image
      if (req.body.image === '' || req.body.image === null) {
        // Delete old image file if exists
        if (grocery.image && grocery.image.startsWith('/uploads/')) {
          const oldPath = grocery.image.substring(1);
          if (fs.existsSync(oldPath)) {
            try {
              fs.unlinkSync(oldPath);
            } catch (err) {
              console.error('Error deleting old image:', err);
            }
          }
        }
        grocery.image = '';
      } else {
        grocery.image = req.body.image;
      }
    }
    
    await grocery.save();
    res.json(grocery);
  } catch (error) {
    console.error('Update grocery error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/groceries/:id - Delete grocery (admin only)
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const grocery = await Grocery.findById(req.params.id);
    if (!grocery) {
      return res.status(404).json({ message: 'Grocery not found' });
    }
    
    // Soft delete using updateOne to avoid validation issues
    // This bypasses validation which is safe since we're only updating isActive
    await Grocery.updateOne(
      { _id: req.params.id },
      { $set: { isActive: false } },
      { runValidators: false }
    );
    
    res.json({ message: 'Grocery deleted successfully' });
  } catch (error) {
    console.error('Delete grocery error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/groceries/:id/alert - Pharmacist can alert admin about low stock
router.post('/:id/alert', authMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;
    const grocery = await Grocery.findById(req.params.id);
    
    if (!grocery) {
      return res.status(404).json({ message: 'Grocery not found' });
    }
    
    // Only pharmacists and admins can alert
    if (req.user.role !== 'pharmacist' && req.user.role !== 'admin' && !req.user.isSuperAdmin) {
      return res.status(403).json({ message: 'Only pharmacists and admins can create alerts' });
    }
    
    grocery.stockAlert = {
      isAlerted: true,
      alertedBy: req.user._id,
      alertedAt: new Date(),
      alertReason: reason || 'Stock is low or out of stock'
    };
    
    await grocery.save();
    res.json({ message: 'Alert created successfully', grocery });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/groceries/:id/clear-alert - Admin can clear alert
router.post('/:id/clear-alert', adminMiddleware, async (req, res) => {
  try {
    const grocery = await Grocery.findById(req.params.id);
    if (!grocery) {
      return res.status(404).json({ message: 'Grocery not found' });
    }
    
    grocery.stockAlert = {
      isAlerted: false,
      alertedBy: null,
      alertedAt: null,
      alertReason: ''
    };
    
    await grocery.save();
    res.json({ message: 'Alert cleared successfully', grocery });
  } catch (error) {
    console.error('Clear alert error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


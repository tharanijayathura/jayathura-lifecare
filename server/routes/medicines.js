// server/routes/medicines.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Medicine = require('../models/Medicine');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/medicines';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'medicine-' + uniqueSuffix + path.extname(file.originalname));
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

// GET /api/medicines - Get all medicines (public, but filtered for patients)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const medicines = await Medicine.find(query)
      .select('-stockAlert -stock.units -minStockUnits')
      .sort({ createdAt: -1 });
    
    // For public API, only show if stock is available
    const availableMedicines = medicines.map(med => {
      const medObj = med.toObject();
      // Only show stock in packs for public, hide internal calculations
      return {
        ...medObj,
        stock: med.stock.packs,
        price: med.price.perPack,
        available: med.stock.packs > 0
      };
    });
    
    res.json(availableMedicines);
  } catch (error) {
    console.error('Get medicines error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/medicines/admin - Get all medicines for admin (with stock alerts)
router.get('/admin', adminMiddleware, async (req, res) => {
  try {
    const { category, includeInactive } = req.query;
    const query = {};
    
    // Only show active medicines by default, unless includeInactive is true
    if (includeInactive !== 'true') {
      query.$or = [
        { isActive: true },
        { isActive: { $exists: false } } // For backward compatibility with old records
      ];
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const medicines = await Medicine.find(query)
      .populate('stockAlert.alertedBy', 'name email')
      .sort({ createdAt: -1 });
    
    // Include virtuals in response
    const medicinesWithVirtuals = medicines.map(med => {
      const medObj = med.toObject();
      return {
        ...medObj,
        isLowStock: med.isLowStock,
        isOutOfStock: med.isOutOfStock,
        stockValue: med.stockValue,
        packDisplay: med.getPackDisplay()
      };
    });
    
    res.json(medicinesWithVirtuals);
  } catch (error) {
    console.error('Get medicines (admin) error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/medicines/:id - Get single medicine
router.get('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json(medicine);
  } catch (error) {
    console.error('Get medicine error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/medicines - Create new medicine (admin only)
router.post('/', adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { 
      name, 
      brand, 
      category, 
      description, 
      baseUnit,
      packagingType,
      packagingQtyPerPack,
      packagingPackName,
      pricePerPack,
      stockPacks,
      minStockUnits,
      requiresPrescription 
    } = req.body;
    
    // Also try to parse from JSON strings if sent that way (backward compatibility)
    let packaging, price, stock;
    try {
      packaging = typeof req.body.packaging === 'string' ? JSON.parse(req.body.packaging) : req.body.packaging;
      price = typeof req.body.price === 'string' ? JSON.parse(req.body.price) : req.body.price;
      stock = typeof req.body.stock === 'string' ? JSON.parse(req.body.stock) : req.body.stock;
    } catch (e) {
      // Ignore parse errors, use individual fields
    }
    
    // Use individual fields or parsed objects
    const qtyPerPack = parseInt(packaging?.qtyPerPack || packagingQtyPerPack || 1);
    const perPack = parseFloat(price?.perPack || pricePerPack);
    const stockPacksValue = parseInt(stock?.packs || stockPacks || 0);
    
    if (!name || !category) {
      return res.status(400).json({ message: 'Name and category are required' });
    }
    
    if (!perPack || isNaN(perPack)) {
      return res.status(400).json({ message: 'Price per pack is required and must be a valid number' });
    }
    
    if (!baseUnit) {
      return res.status(400).json({ message: 'Base unit is required (tablet, capsule, ml, gram, piece)' });
    }
    
    if (qtyPerPack < 1) {
      return res.status(400).json({ message: 'Quantity per pack must be at least 1' });
    }
    
    // Calculate per unit price
    const perUnit = parseFloat((perPack / qtyPerPack).toFixed(2));
    
    // Calculate total units
    const totalUnits = stockPacksValue * qtyPerPack;
    
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/medicines/${req.file.filename}`;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }
    
    const packagingTypeValue = packaging?.type || packagingType || 'unit';
    const packNameValue = packaging?.packName || packagingPackName || `1 ${packagingTypeValue} (${qtyPerPack} ${baseUnit}${qtyPerPack > 1 ? 's' : ''})`;
    
    const medicine = new Medicine({
      name,
      brand,
      category,
      description,
      baseUnit: baseUnit || 'tablet',
      packaging: {
        type: packagingTypeValue,
        qtyPerPack: qtyPerPack,
        packName: packNameValue
      },
      price: {
        perPack: perPack,
        perUnit: perUnit
      },
      stock: {
        packs: stockPacksValue,
        units: totalUnits
      },
      minStockUnits: parseInt(minStockUnits || 10),
      image: imageUrl,
      requiresPrescription: requiresPrescription === 'true' || requiresPrescription === true
    });
    
    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    console.error('Create medicine error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/medicines/:id - Update medicine (admin only)
router.put('/:id', adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { 
      name, 
      brand, 
      category, 
      description, 
      baseUnit,
      packagingType,
      packagingQtyPerPack,
      packagingPackName,
      pricePerPack,
      stockPacks,
      minStockUnits,
      requiresPrescription 
    } = req.body;
    
    // Also try to parse from JSON strings if sent that way (backward compatibility)
    let packaging, price, stock;
    try {
      packaging = typeof req.body.packaging === 'string' ? JSON.parse(req.body.packaging) : req.body.packaging;
      price = typeof req.body.price === 'string' ? JSON.parse(req.body.price) : req.body.price;
      stock = typeof req.body.stock === 'string' ? JSON.parse(req.body.stock) : req.body.stock;
    } catch (e) {
      // Ignore parse errors, use individual fields
    }
    
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    // Update basic fields
    if (name) medicine.name = name;
    if (brand !== undefined) medicine.brand = brand;
    if (category) medicine.category = category;
    if (description !== undefined) medicine.description = description;
    if (baseUnit) medicine.baseUnit = baseUnit;
    if (minStockUnits !== undefined) medicine.minStockUnits = parseInt(minStockUnits);
    if (requiresPrescription !== undefined) {
      medicine.requiresPrescription = requiresPrescription === 'true' || requiresPrescription === true;
    }
    
    // Update packaging
    if (packagingType || packaging?.type) {
      medicine.packaging.type = packagingType || packaging.type;
    }
    if (packagingQtyPerPack || packaging?.qtyPerPack) {
      medicine.packaging.qtyPerPack = parseInt(packagingQtyPerPack || packaging.qtyPerPack);
    }
    if (packagingPackName !== undefined || packaging?.packName) {
      medicine.packaging.packName = packagingPackName || packaging.packName;
    }
    
    // Update price
    if (pricePerPack !== undefined || price?.perPack !== undefined) {
      medicine.price.perPack = parseFloat(pricePerPack || price.perPack);
      // Recalculate per unit
      if (medicine.packaging.qtyPerPack > 0) {
        medicine.price.perUnit = parseFloat((medicine.price.perPack / medicine.packaging.qtyPerPack).toFixed(2));
      }
    }
    
    // Update stock
    if (stockPacks !== undefined || stock?.packs !== undefined) {
      medicine.stock.packs = parseInt(stockPacks || stock.packs);
      // Recalculate units
      medicine.stock.units = medicine.stock.packs * medicine.packaging.qtyPerPack;
    }
    
    // Handle image update
    if (req.file) {
      // Delete old image if exists
      if (medicine.image && medicine.image.startsWith('/uploads/')) {
        const oldPath = medicine.image.substring(1);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      medicine.image = `/uploads/medicines/${req.file.filename}`;
    } else if (req.body.image !== undefined) {
      // If empty string is sent, remove the image
      if (req.body.image === '' || req.body.image === null) {
        // Delete old image file if exists
        if (medicine.image && medicine.image.startsWith('/uploads/')) {
          const oldPath = medicine.image.substring(1);
          if (fs.existsSync(oldPath)) {
            try {
              fs.unlinkSync(oldPath);
            } catch (err) {
              console.error('Error deleting old image:', err);
            }
          }
        }
        medicine.image = '';
      } else {
        medicine.image = req.body.image;
      }
    }
    
    await medicine.save();
    res.json(medicine);
  } catch (error) {
    console.error('Update medicine error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/medicines/all - Delete all medicines (admin only)
router.delete('/all', adminMiddleware, async (req, res) => {
  try {
    const result = await Medicine.deleteMany({});
    res.json({ 
      message: `Successfully deleted ${result.deletedCount} medicines`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Delete all medicines error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/medicines/:id - Delete medicine (admin only)
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    // Soft delete using updateOne to avoid validation issues
    // This bypasses validation which is safe since we're only updating isActive
    await Medicine.updateOne(
      { _id: req.params.id },
      { $set: { isActive: false } },
      { runValidators: false }
    );
    
    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    console.error('Delete medicine error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/medicines/:id/alert - Pharmacist can alert admin about low stock
router.post('/:id/alert', authMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;
    const medicine = await Medicine.findById(req.params.id);
    
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    // Only pharmacists and admins can alert
    if (req.user.role !== 'pharmacist' && req.user.role !== 'admin' && !req.user.isSuperAdmin) {
      return res.status(403).json({ message: 'Only pharmacists and admins can create alerts' });
    }
    
    medicine.stockAlert = {
      isAlerted: true,
      alertedBy: req.user._id,
      alertedAt: new Date(),
      alertReason: reason || `Stock is low: ${medicine.stock.units} ${medicine.baseUnit}s remaining (min: ${medicine.minStockUnits})`
    };
    
    await medicine.save();
    res.json({ message: 'Alert created successfully', medicine });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/medicines/:id/clear-alert - Admin can clear alert
router.post('/:id/clear-alert', adminMiddleware, async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    medicine.stockAlert = {
      isAlerted: false,
      alertedBy: null,
      alertedAt: null,
      alertReason: ''
    };
    
    await medicine.save();
    res.json({ message: 'Alert cleared successfully', medicine });
  } catch (error) {
    console.error('Clear alert error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


// server/routes/patients.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Prescription = require('../models/Prescription');
const Medicine = require('../models/Medicine');
const Invoice = require('../models/Invoice');
const RefillPlan = require('../models/RefillPlan');
const Chat = require('../models/Chat');
const { authMiddleware } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Configure multer for prescription uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/prescriptions';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'prescription-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// 1. register(patientData) - Create account
// Note: This is already handled in /api/auth/register, but we can add a patient-specific endpoint
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email: normalizedEmail,
      password: hashed,
      role: 'patient',
      phone,
      address,
      isApproved: true // Patients are auto-approved
    });

    await user.save();

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: 'Registration successful!'
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. login(credentials) - Authenticate user
// Note: This is already handled in /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail, role: 'patient' });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 3. viewPatientProfile() - View dashboard
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.user._id).select('-password');
    const ordersCount = await Order.countDocuments({ patientId: req.user._id });
    const pendingOrders = await Order.countDocuments({ 
      patientId: req.user._id, 
      status: { $in: ['pending', 'confirmed', 'processing'] } 
    });
    const prescriptionsCount = await Prescription.countDocuments({ patientId: req.user._id });
    const refillPlansCount = await RefillPlan.countDocuments({ 
      patientId: req.user._id, 
      isActive: true 
    });

    res.json({
      profile: user,
      stats: {
        totalOrders: ordersCount,
        pendingOrders: pendingOrders,
        totalPrescriptions: prescriptionsCount,
        activeRefillPlans: refillPlansCount
      }
    });
  } catch (error) {
    console.error('View profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 4. uploadPrescription(patientId, imageFile) - Submit prescription
router.post('/prescription/upload', authMiddleware, upload.single('imageFile'), async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Prescription image is required' });
    }

    const imageUrl = `/uploads/prescriptions/${req.file.filename}`;
    const prescription = new Prescription({
      patientId: req.user._id,
      imageUrl: imageUrl,
      status: 'pending',
      items: [] // Start with empty items, pharmacist will add medicines
    });

    await prescription.save();

    // Create a draft order for this prescription (so pharmacist can add items)
    const order = new Order({
      patientId: req.user._id,
      prescriptionId: prescription._id,
      type: 'prescription',
      status: 'draft',
      items: []
    });

    await order.save();

    res.status(201).json({
      prescription: prescription,
      order: order,
      message: 'Prescription uploaded successfully. Pharmacist will review and add medicines.'
    });
  } catch (error) {
    console.error('Upload prescription error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get prescription orders for patient
router.get('/prescription-orders', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const orders = await Order.find({ 
      patientId: req.user._id,
      prescriptionId: { $exists: true, $ne: null }
    })
      .populate('prescriptionId', 'status imageUrl verifiedAt')
      .populate('items.medicineId', 'name price stock')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get prescription orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 5. viewOrderStatus(orderId) - Check progress
router.get('/order/:orderId/status', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const order = await Order.findOne({ 
      _id: req.params.orderId, 
      patientId: req.user._id 
    })
      .populate('items.medicineId', 'name price stock')
      .populate('assignedTo', 'name phone')
      .populate('prescriptionId', 'status imageUrl verifiedAt verifiedBy');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('View order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 6. browseOTCCatalog() - View OTC medicines (all non-prescription medicines)
router.get('/medicines/otc', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Exclude prescription category and medicines that require prescription
    const medicines = await Medicine.find({ 
      category: { $ne: 'prescription' }, // Exclude prescription category
      requiresPrescription: { $ne: true }, // Also exclude if requiresPrescription is true
      isActive: true,
      'stock.units': { $gt: 0 }
    })
      .select('name brand category price packaging stock image description')
      .sort({ name: 1 });

    // Format response for frontend
    const formattedMedicines = medicines.map(med => ({
      id: med._id,
      name: med.name,
      brand: med.brand,
      category: med.category,
      description: med.description,
      price: med.price.perPack,
      stock: med.stock.packs,
      image: med.image,
      packaging: med.packaging,
      requiresPrescription: false
    }));

    res.json(formattedMedicines);
  } catch (error) {
    console.error('Browse OTC catalog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 7. searchMedicines(keyword) - Find medicines (excluding prescription medicines)
router.get('/medicines/search', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ message: 'Search keyword is required' });
    }

    // Exclude prescription category and medicines that require prescription
    const medicines = await Medicine.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ],
      category: { $ne: 'prescription' }, // Exclude prescription category
      requiresPrescription: { $ne: true }, // Also exclude if requiresPrescription is true
      isActive: true,
      'stock.units': { $gt: 0 }
    })
      .select('name brand category price packaging stock image description')
      .limit(50);

    // Format response for frontend
    const formattedMedicines = medicines.map(med => ({
      id: med._id,
      name: med.name,
      brand: med.brand,
      category: med.category,
      description: med.description,
      price: med.price.perPack,
      stock: med.stock.packs,
      image: med.image,
      packaging: med.packaging,
      requiresPrescription: false
    }));

    res.json(formattedMedicines);
  } catch (error) {
    console.error('Search medicines error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 8. addToCart(orderId, medicineId, quantity) - Add OTC items (can add to prescription orders too)
router.post('/cart/add', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { orderId, medicineId, quantity } = req.body;

    if (!medicineId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Medicine ID and valid quantity are required' });
    }

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Check if it's a prescription medicine - patients can't add prescription medicines directly
    if (medicine.category === 'prescription' || medicine.requiresPrescription) {
      return res.status(400).json({ 
        message: 'Prescription medicines can only be added by pharmacists. Please upload your prescription.' 
      });
    }

    if (medicine.stock.units < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let order;
    if (orderId) {
      order = await Order.findOne({ _id: orderId, patientId: req.user._id });
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // If order has prescription, change type to 'mixed'
      if (order.prescriptionId && order.type === 'prescription') {
        order.type = 'mixed';
      }
    } else {
      // Create new draft order
      order = new Order({
        patientId: req.user._id,
        type: 'otc',
        status: 'draft',
        items: []
      });
    }

    // Check if medicine already in cart
    const existingItem = order.items.find(
      item => item.medicineId && item.medicineId.toString() === medicineId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = medicine.price.perPack;
    } else {
      order.items.push({
        medicineId: medicineId,
        medicineName: medicine.name,
        quantity: quantity,
        price: medicine.price.perPack,
        isAvailable: true,
        isPrescription: false // Mark as OTC item
      });
    }

    await order.save();
    await order.populate('items.medicineId', 'name price');

    res.json({
      message: 'Item added to cart successfully',
      order: order
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 9. removeItem(orderItemId) - Remove items (can remove from prescription orders too)
router.delete('/order/:orderId/item/:itemId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { orderId, itemId } = req.params;
    const order = await Order.findOne({ _id: orderId, patientId: req.user._id });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order can be edited
    if (order.status !== 'draft' && order.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Cannot remove items from confirmed orders. Please contact support.' 
      });
    }

    const itemToRemove = order.items.find(
      item => item._id.toString() === itemId
    );

    if (!itemToRemove) {
      return res.status(404).json({ message: 'Item not found in order' });
    }

    // Don't allow removing prescription items (only pharmacist can do that)
    if (itemToRemove.isPrescription) {
      return res.status(403).json({ 
        message: 'Cannot remove prescription medicines. Please contact pharmacist.' 
      });
    }

    // Remove the item
    order.items = order.items.filter(
      item => item._id.toString() !== itemId
    );

    // Recalculate totals
    if (order.items.length > 0) {
      let subtotal = 0;
      order.items.forEach(item => {
        const price = item.price || 0;
        subtotal += price * item.quantity;
      });
      order.totalAmount = subtotal;
      order.deliveryFee = subtotal > 1000 ? 0 : 200;
      order.finalAmount = subtotal + order.deliveryFee;
    } else {
      order.totalAmount = 0;
      order.deliveryFee = 0;
      order.finalAmount = 0;
    }

    await order.save();
    await order.populate('items.medicineId', 'name price');

    res.json({
      message: 'Item removed successfully',
      order: order
    });
  } catch (error) {
    console.error('Remove item error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 10. viewAutoGeneratedBill(orderId) - Review invoice (allows item removal)
router.get('/order/:orderId/bill', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const orderId = req.params.orderId;
    console.log('Fetching bill for order:', orderId, 'Patient:', req.user._id);

    // Validate orderId format
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    const order = await Order.findOne({ 
      _id: orderId, 
      patientId: req.user._id 
    })
      .populate({
        path: 'items.medicineId',
        select: 'name price stock',
        model: 'Medicine'
      })
      .populate({
        path: 'prescriptionId',
        select: 'status imageUrl',
        model: 'Prescription'
      });

    if (!order) {
      console.log('Order not found:', orderId);
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log('Order found:', order._id, 'Status:', order.status, 'Items:', order.items.length);

    // Calculate bill if not already calculated
    if (!order.finalAmount && order.items.length > 0) {
      let subtotal = 0;
      order.items.forEach(item => {
        // Handle both populated and non-populated medicineId
        const medicinePrice = item.medicineId?.price?.perPack || item.medicineId?.price || 0;
        const price = item.price || medicinePrice || 0;
        const quantity = item.quantity || 0;
        subtotal += price * quantity;
      });

      const deliveryFee = subtotal > 1000 ? 0 : 200;
      const finalAmount = subtotal + deliveryFee;

      order.totalAmount = subtotal;
      order.deliveryFee = deliveryFee;
      order.finalAmount = finalAmount;
      await order.save();
    }

    // Find or create invoice (optional - don't fail if invoice creation fails)
    let invoice = null;
    try {
      invoice = await Invoice.findOne({ orderId: order._id });
      
      if (!invoice && order.finalAmount) {
        invoice = new Invoice({
          orderId: order._id,
          patientId: order.patientId,
          items: order.items.map(item => ({
            medicineId: item.medicineId,
            medicineName: item.medicineName || item.medicineId?.name || 'Unknown',
            quantity: item.quantity || 0,
            price: item.price || 0,
            subtotal: (item.price || 0) * (item.quantity || 0)
          })),
          subtotal: order.totalAmount || 0,
          deliveryFee: order.deliveryFee || 0,
          totalAmount: order.finalAmount || 0,
          paymentMethod: order.paymentMethod || 'online',
          paymentStatus: order.paymentStatus || 'pending'
        });
        await invoice.save();
      }
    } catch (invoiceError) {
      // Log invoice error but don't fail the request
      console.error('Invoice creation error (non-fatal):', invoiceError);
      // Continue without invoice - order data is still returned
    }

    console.log('Bill calculated successfully. Final amount:', order.finalAmount);
    
    res.json({
      order: order,
      invoice: invoice,
      canEdit: order.status === 'draft' || order.status === 'pending', // Can edit if not confirmed
      patientAddress: req.user.address || {}
    });
  } catch (error) {
    console.error('View bill error:', error);
    console.error('Error stack:', error.stack);
    console.error('Order ID:', req.params.orderId);
    console.error('Patient ID:', req.user._id);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Send order to pharmacist (after adding optional items)
router.post('/order/:orderId/send-to-pharmacist', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const order = await Order.findOne({ 
      _id: req.params.orderId, 
      patientId: req.user._id 
    })
      .populate('prescriptionId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!order.prescriptionId) {
      return res.status(400).json({ message: 'This is not a prescription order' });
    }

    if (order.status !== 'draft') {
      return res.status(400).json({ message: 'Order has already been sent to pharmacist' });
    }

    // Change status to pending so pharmacist can see it
    // Note: Delivery address is NOT required at this stage
    // It will be required later when patient confirms the final order after pharmacist generates bill
    order.status = 'pending';
    await order.save();

    res.json({
      message: 'Order sent to pharmacist successfully. Pharmacist will review your prescription and add medicines.',
      order: order
    });
  } catch (error) {
    console.error('Send to pharmacist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 11. confirmOrder(orderId) - Approve order with address
router.put('/order/:orderId/confirm', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { deliveryAddress, paymentMethod, requestAudioInstructions } = req.body;
    const order = await Order.findOne({ 
      _id: req.params.orderId, 
      patientId: req.user._id 
    })
      .populate('items.medicineId', 'name price stock');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.items.length === 0) {
      return res.status(400).json({ message: 'Cannot confirm empty order' });
    }

    // Allow confirmation if order is in draft or pending status
    // 'draft' = just created, patient can confirm directly
    // 'pending' = pharmacist has reviewed and generated bill, ready for patient confirmation
    // If already confirmed, just return success (idempotent operation)
    if (order.status === 'confirmed') {
      console.log('Order already confirmed, returning existing order:', order._id);
      return res.json({
        message: 'Order is already confirmed',
        order: order,
        alreadyConfirmed: true
      });
    }
    
    if (order.status !== 'draft' && order.status !== 'pending') {
      return res.status(400).json({ 
        message: `Order cannot be confirmed in current status: ${order.status}. Order must be in 'draft' or 'pending' status.` 
      });
    }
    
    console.log('Confirming order:', {
      orderId: order._id,
      currentStatus: order.status,
      itemsCount: order.items.length,
      finalAmount: order.finalAmount
    });

    // Validate delivery address
    if (!deliveryAddress) {
      return res.status(400).json({ message: 'Delivery address is required' });
    }
    
    if (!deliveryAddress.street || !deliveryAddress.street.trim()) {
      return res.status(400).json({ message: 'Street address is required' });
    }
    
    if (!deliveryAddress.city || !deliveryAddress.city.trim()) {
      return res.status(400).json({ message: 'City is required' });
    }

    // Recalculate bill before confirming
    let subtotal = 0;
    order.items.forEach(item => {
      // Handle both populated and non-populated medicineId
      const medicinePrice = item.medicineId?.price?.perPack || item.medicineId?.price || 0;
      const price = item.price || medicinePrice || 0;
      const quantity = item.quantity || 0;
      subtotal += price * quantity;
    });

    const deliveryFee = subtotal > 1000 ? 0 : 200;
    const finalAmount = subtotal + deliveryFee;

    // Update order with cleaned address
    order.deliveryAddress = {
      street: deliveryAddress.street.trim(),
      city: deliveryAddress.city.trim(),
      postalCode: deliveryAddress.postalCode?.trim() || ''
    };
    order.totalAmount = subtotal;
    order.deliveryFee = deliveryFee;
    order.finalAmount = finalAmount;
    order.paymentMethod = paymentMethod || 'online';
    order.paymentStatus = paymentMethod === 'cod' ? 'pending' : 'pending';
    order.status = 'confirmed';
    
    // Handle audio instruction request
    if (requestAudioInstructions) {
      order.audioInstructions = {
        requested: true,
        requestedAt: new Date()
      };
    }

    // Update stock for confirmed orders
    for (let item of order.items) {
      // Handle both populated and non-populated medicineId
      const medicineId = item.medicineId?._id || item.medicineId;
      if (!medicineId) {
        console.warn('Item missing medicineId:', item);
        continue;
      }
      
      const medicine = await Medicine.findById(medicineId);
      if (medicine) {
        // Ensure stock object exists
        if (!medicine.stock) {
          medicine.stock = { units: 0, packs: 0 };
        }
        
        if (medicine.stock.units < item.quantity) {
          return res.status(400).json({ 
            message: `${medicine.name || 'Medicine'} is out of stock. Please remove it or reduce quantity.` 
          });
        }
        
        medicine.stock.units -= item.quantity;
        if (medicine.packaging && medicine.packaging.qtyPerPack > 0) {
          medicine.stock.packs = Math.floor(medicine.stock.units / medicine.packaging.qtyPerPack);
        }
        await medicine.save();
      } else {
        console.warn('Medicine not found for ID:', medicineId);
      }
    }

    await order.save();

    // Create/update invoice (non-fatal - don't fail if invoice creation fails)
    let invoice = null;
    try {
      invoice = await Invoice.findOne({ orderId: order._id });
      if (!invoice) {
        // Handle both populated and non-populated medicineId
        invoice = new Invoice({
          orderId: order._id,
          patientId: order.patientId,
          items: order.items.map(item => {
            const medicineId = item.medicineId?._id || item.medicineId;
            const medicineName = item.medicineName || item.medicineId?.name || 'Unknown';
            const price = item.price || 0;
            const quantity = item.quantity || 0;
            
            return {
              medicineId: medicineId,
              medicineName: medicineName,
              quantity: quantity,
              price: price,
              subtotal: price * quantity
            };
          }),
          subtotal: subtotal,
          deliveryFee: deliveryFee,
          totalAmount: finalAmount,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus
        });
        await invoice.save();
      }
    } catch (invoiceError) {
      // Log invoice error but don't fail the request
      console.error('Invoice creation error (non-fatal):', invoiceError);
      // Continue without invoice - order is still confirmed
    }

    res.json({
      message: 'Order confirmed successfully',
      order: order,
      invoice: invoice
    });
  } catch (error) {
    console.error('Confirm order error:', error);
    console.error('Error stack:', error.stack);
    console.error('Order ID:', req.params.orderId);
    console.error('Patient ID:', req.user._id);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// 12. initiatePayment(invoiceId) - Pay online
router.post('/payment/initiate', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { invoiceId } = req.body;
    const invoice = await Invoice.findOne({ 
      invoiceId: invoiceId,
      patientId: req.user._id 
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Update payment status (in real app, integrate with payment gateway)
    invoice.paymentStatus = 'paid';
    invoice.paidAt = new Date();
    await invoice.save();

    // Update order payment status
    const order = await Order.findById(invoice.orderId);
    if (order) {
      order.paymentStatus = 'paid';
      await order.save();
    }

    res.json({ 
      message: 'Payment initiated successfully',
      invoice: invoice 
    });
  } catch (error) {
    console.error('Initiate payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 13. chooseCashOnDelivery(orderId) - Select COD
router.put('/order/:orderId/cod', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const order = await Order.findOne({ 
      _id: req.params.orderId, 
      patientId: req.user._id 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentMethod = 'cod';
    order.paymentStatus = 'pending';
    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Choose COD error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 14. requestAudioInstructions(orderId) - Request audio
router.post('/order/:orderId/audio-request', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const order = await Order.findOne({ 
      _id: req.params.orderId, 
      patientId: req.user._id 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create a chat message requesting audio instructions
    let chat = await Chat.findOne({ patientId: req.user._id });
    if (!chat) {
      chat = new Chat({
        patientId: req.user._id,
        messages: [],
        status: 'active'
      });
    }

    chat.messages.push({
      senderId: req.user._id,
      senderName: req.user.name,
      senderRole: 'patient',
      message: `Please provide audio instructions for order ${order.orderId}`,
      isBot: false,
      timestamp: new Date()
    });

    await chat.save();

    res.json({ 
      message: 'Audio instruction request sent to pharmacist',
      chat: chat 
    });
  } catch (error) {
    console.error('Request audio instructions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 15. trackDelivery(orderId) - Monitor delivery
router.get('/order/:orderId/track', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const order = await Order.findOne({ 
      _id: req.params.orderId, 
      patientId: req.user._id 
    })
      .populate('assignedTo', 'name phone')
      .populate('items.medicineId', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      orderId: order.orderId,
      status: order.status,
      deliveryStatus: order.deliveryStatus,
      estimatedDelivery: order.estimatedDelivery,
      assignedTo: order.assignedTo,
      items: order.items
    });
  } catch (error) {
    console.error('Track delivery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 16. chatWithPharmacist(patientId, message) - Communicate
router.post('/chat/message', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    let chat = await Chat.findOne({ patientId: req.user._id });
    if (!chat) {
      chat = new Chat({
        patientId: req.user._id,
        messages: [],
        status: 'active'
      });
    }

    chat.messages.push({
      senderId: req.user._id,
      senderName: req.user.name,
      senderRole: 'patient',
      message: message,
      isBot: false,
      timestamp: new Date()
    });

    chat.lastMessageAt = new Date();
    chat.unreadCount.pharmacist += 1;
    await chat.save();

    res.json({ success: true, chat });
  } catch (error) {
    console.error('Chat with pharmacist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 17. submitFeedback(orderId, rating, comments) - Give feedback
router.post('/order/:orderId/feedback', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { rating, comments } = req.body;
    const order = await Order.findOne({ 
      _id: req.params.orderId, 
      patientId: req.user._id 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Add feedback to order (you may want to create a separate Feedback model)
    order.feedback = {
      rating: rating,
      comments: comments,
      submittedAt: new Date()
    };

    await order.save();

    res.json({ 
      message: 'Feedback submitted successfully',
      order: order 
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 18. createOrder(patientId) - Start OTC order
router.post('/order/create', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const order = new Order({
      patientId: req.user._id,
      type: 'otc',
      status: 'draft',
      items: []
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 19. viewRefillDraft(refillPlanId) - Review refill
router.get('/refill/:refillPlanId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const refillPlan = await RefillPlan.findOne({ 
      _id: req.params.refillPlanId,
      patientId: req.user._id 
    })
      .populate('medicineId', 'name price stock');

    if (!refillPlan) {
      return res.status(404).json({ message: 'Refill plan not found' });
    }

    // Check if there's a draft order for this refill
    const draftOrder = await Order.findOne({
      refillPlanId: refillPlan._id,
      status: 'draft',
      patientId: req.user._id
    });

    res.json({
      refillPlan: refillPlan,
      draftOrder: draftOrder
    });
  } catch (error) {
    console.error('View refill draft error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 20. confirmRefillOrder(refillPlanId) - Approve refill
router.post('/refill/:refillPlanId/confirm', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const refillPlan = await RefillPlan.findOne({ 
      _id: req.params.refillPlanId,
      patientId: req.user._id 
    });

    if (!refillPlan) {
      return res.status(404).json({ message: 'Refill plan not found' });
    }

    // Create order from refill plan
    const order = new Order({
      patientId: req.user._id,
      type: 'refill',
      refillPlanId: refillPlan._id,
      items: [{
        medicineId: refillPlan.medicineId,
        medicineName: refillPlan.medicineName,
        quantity: refillPlan.quantity,
        price: 0, // Will be calculated
        isAvailable: true
      }],
      status: 'pending',
      isRefill: true
    });

    await order.save();

    // Update refill plan
    refillPlan.lastRefilledAt = new Date();
    refillPlan.refillCount += 1;
    refillPlan.nextRefillDate = new Date(
      Date.now() + refillPlan.intervalDays * 24 * 60 * 60 * 1000
    );
    await refillPlan.save();

    res.json(order);
  } catch (error) {
    console.error('Confirm refill order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 21. handleUnavailableMedicine(orderId, medicineId, action) - Handle out-of-stock
router.put('/order/:orderId/unavailable/:medicineId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { action } = req.body; // 'remove', 'wait', 'alternative'
    const order = await Order.findOne({ 
      _id: req.params.orderId, 
      patientId: req.user._id 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const item = order.items.find(
      item => item.medicineId.toString() === req.params.medicineId
    );

    if (!item) {
      return res.status(404).json({ message: 'Medicine not found in order' });
    }

    if (action === 'remove') {
      order.items = order.items.filter(
        item => item.medicineId.toString() !== req.params.medicineId
      );
    } else if (action === 'wait') {
      item.isAvailable = false;
    }

    await order.save();
    res.json(order);
  } catch (error) {
    console.error('Handle unavailable medicine error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 22. receiveOutOfStockNotification(orderId, message) - Get stock alerts
// This is typically handled server-side, but we can provide an endpoint to fetch notifications
router.get('/notifications/out-of-stock', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Find orders with unavailable items
    const orders = await Order.find({
      patientId: req.user._id,
      'items.isAvailable': false,
      status: { $in: ['pending', 'confirmed'] }
    })
      .populate('items.medicineId', 'name')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get out of stock notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 23. viewOrdersHistory() - View past orders
router.get('/orders/history', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const orders = await Order.find({ patientId: req.user._id })
      .populate('items.medicineId', 'name price')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(orders);
  } catch (error) {
    console.error('View orders history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 24. viewInvoices() - View bills
router.get('/invoices', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const invoices = await Invoice.find({ patientId: req.user._id })
      .populate('orderId', 'orderId status')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(invoices);
  } catch (error) {
    console.error('View invoices error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 25. updateProfile(patientData) - Update information
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, phone, address } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 26. logout() - End session
// Note: Logout is typically handled client-side by removing the token
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // But we can log the logout event or invalidate tokens if using a token blacklist
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 27. profile - Get profile (alternative endpoint)
router.get('/profile/detailed', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.user._id).select('-password');
    const ordersCount = await Order.countDocuments({ patientId: req.user._id });
    const prescriptionsCount = await Prescription.countDocuments({ patientId: req.user._id });
    const refillPlansCount = await RefillPlan.countDocuments({ 
      patientId: req.user._id, 
      isActive: true 
    });

    res.json({
      user: user,
      stats: {
        totalOrders: ordersCount,
        totalPrescriptions: prescriptionsCount,
        activeRefillPlans: refillPlansCount
      }
    });
  } catch (error) {
    console.error('Get detailed profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


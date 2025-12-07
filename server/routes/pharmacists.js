// server/routes/pharmacists.js
const express = require('express');
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

// Configure multer for audio file uploads
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/audio';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'audio-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const audioUpload = multer({
  storage: audioStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  }
});

// Helper function to check if user is pharmacist
const pharmacistMiddleware = async (req, res, next) => {
  if (req.user.role !== 'pharmacist' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Pharmacist access required' });
  }
  next();
};

// 27. getPendingPrescriptions() - Fetch unverified prescriptions (both draft and pending orders)
router.get('/prescriptions/pending', authMiddleware, pharmacistMiddleware, async (req, res) => {
  try {
    // First, get all pending prescriptions (not verified or rejected)
    const prescriptions = await Prescription.find({ 
      status: 'pending' // Only show pending prescriptions (not verified or rejected)
    })
      .populate('patientId', 'name email phone')
      .sort({ createdAt: -1 });

    // Then find orders for these prescriptions
    const prescriptionIds = prescriptions.map(p => p._id);
    const orders = await Order.find({ 
      prescriptionId: { $in: prescriptionIds },
      status: { $in: ['draft', 'pending'] } // Show both draft and pending
    })
      .populate('patientId', 'name email phone')
      .sort({ createdAt: -1 });

    console.log('Found prescriptions:', prescriptions.length);
    console.log('Found orders:', orders.length);

    // Add order status info to each prescription for frontend
    const prescriptionsWithOrderInfo = prescriptions.map(prescription => {
      const relatedOrder = orders.find(o => {
        if (!o.prescriptionId) return false;
        // Handle both ObjectId and string comparisons
        const orderPrescriptionId = o.prescriptionId._id || o.prescriptionId;
        return orderPrescriptionId.toString() === prescription._id.toString();
      });
      return {
        ...prescription.toObject(),
        orderStatus: relatedOrder?.status || 'draft', // Default to draft if no order found
        orderId: relatedOrder?._id || null
      };
    });

    console.log('Returning prescriptions:', prescriptionsWithOrderInfo.length);

    res.json(prescriptionsWithOrderInfo);
  } catch (error) {
    console.error('Get pending prescriptions error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 28. getPrescriptionDetails(prescriptionId) - View prescription and associated order
router.get('/prescription/:prescriptionId', authMiddleware, pharmacistMiddleware, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.prescriptionId)
      .populate('patientId', 'name email phone address')
      .populate('items.medicineId', 'name price stock');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Find the order associated with this prescription
    const order = await Order.findOne({ 
      prescriptionId: prescription._id,
      status: { $in: ['draft', 'pending'] }
    })
      .populate('items.medicineId', 'name price stock')
      .populate('patientId', 'name email phone address');

    res.json({
      prescription: prescription,
      order: order || null // Order might not exist yet if pharmacist hasn't added items
    });
  } catch (error) {
    console.error('Get prescription details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 29. addPrescriptionItemToOrder(prescriptionId, medicineId, quantity, dosage, frequency) - Add verified medicines
router.post('/prescription/:prescriptionId/add-item', authMiddleware, pharmacistMiddleware, async (req, res) => {
  try {
    const { medicineId, quantity, dosage, frequency, instructions } = req.body;
    
    if (!medicineId || !quantity) {
      return res.status(400).json({ message: 'Medicine ID and quantity are required' });
    }

    const prescription = await Prescription.findById(req.params.prescriptionId);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    if (prescription.status !== 'pending' && prescription.status !== 'verified') {
      return res.status(400).json({ message: 'Prescription is not in a valid state for adding items' });
    }

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Check stock availability
    if (medicine.stock.units < quantity) {
      return res.status(400).json({ 
        message: `Insufficient stock. Available: ${medicine.stock.units} units, Requested: ${quantity}` 
      });
    }

    // Add to prescription items
    const existingPrescriptionItem = prescription.items.find(
      item => item.medicineId && item.medicineId.toString() === medicineId
    );

    if (existingPrescriptionItem) {
      existingPrescriptionItem.quantity += quantity;
      if (dosage) existingPrescriptionItem.dosage = dosage;
      if (frequency) existingPrescriptionItem.frequency = frequency;
    } else {
      prescription.items.push({
        medicineId: medicineId,
        medicineName: medicine.name,
        quantity: quantity,
        dosage: dosage || '',
        frequency: frequency || ''
      });
    }

    await prescription.save();

    // Find or create order for this prescription
    let order = await Order.findOne({ 
      prescriptionId: prescription._id,
      status: { $in: ['draft', 'pending'] }
    });
    
    if (!order) {
      order = new Order({
        patientId: prescription.patientId,
        prescriptionId: prescription._id,
        type: 'prescription',
        status: 'draft',
        items: []
      });
    }

    // Add item to order with prescription details
    const orderItem = order.items.find(
      item => item.medicineId && item.medicineId.toString() === medicineId
    );

    if (orderItem) {
      orderItem.quantity += quantity;
      orderItem.price = medicine.price.perPack;
    } else {
      order.items.push({
        medicineId: medicineId,
        medicineName: medicine.name,
        quantity: quantity,
        price: medicine.price.perPack,
        isAvailable: medicine.stock.units >= quantity,
        isPrescription: true, // Mark as prescription medicine
        dosage: dosage || '',
        frequency: frequency || '',
        instructions: instructions || ''
      });
    }

    // Update order type to 'mixed' if it already has OTC items
    const hasOTCItems = order.items.some(item => !item.isPrescription);
    if (hasOTCItems && order.type === 'prescription') {
      order.type = 'mixed';
    }

    await order.save();
    await order.populate('items.medicineId', 'name price stock');

    res.json({ 
      message: 'Medicine added to order successfully',
      prescription: await Prescription.findById(prescription._id).populate('items.medicineId'),
      order: order 
    });
  } catch (error) {
    console.error('Add prescription item to order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 30. markPrescriptionVerified(prescriptionId) - Approve prescription and generate bill
router.put('/prescription/:prescriptionId/verify', authMiddleware, pharmacistMiddleware, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.prescriptionId)
      .populate('items.medicineId', 'name price stock');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    prescription.status = 'verified';
    prescription.verifiedBy = req.user._id;
    prescription.verifiedAt = new Date();

    await prescription.save();

    // Find or create order for this prescription
    let order = await Order.findOne({ 
      prescriptionId: prescription._id,
      status: { $in: ['draft', 'pending'] }
    })
      .populate('items.medicineId', 'name price stock');

    if (!order) {
      order = new Order({
        patientId: prescription.patientId,
        prescriptionId: prescription._id,
        type: prescription.items.length > 0 ? 'prescription' : 'prescription',
        status: 'pending',
        items: []
      });
    }

    // Calculate bill if order has items
    if (order.items.length > 0) {
      let subtotal = 0;
      order.items.forEach(item => {
        const price = item.price || (item.medicineId && item.medicineId.price?.perPack) || 0;
        subtotal += price * item.quantity;
      });

      const deliveryFee = subtotal > 1000 ? 0 : 200;
      const finalAmount = subtotal + deliveryFee;

      order.totalAmount = subtotal;
      order.deliveryFee = deliveryFee;
      order.finalAmount = finalAmount;
    }
    
    // Always set status to 'pending' after verification so patient can confirm
    order.status = 'pending'; // Ready for patient review

    await order.save();

    res.json({ 
      message: 'Prescription verified and bill generated',
      prescription: prescription,
      order: order 
    });
  } catch (error) {
    console.error('Mark prescription verified error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 31. markPrescriptionRejected(prescriptionId, reason) - Reject prescription
router.put('/prescription/:prescriptionId/reject', authMiddleware, pharmacistMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;
    const prescription = await Prescription.findById(req.params.prescriptionId);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    prescription.status = 'rejected';
    prescription.verifiedBy = req.user._id;
    prescription.verifiedAt = new Date();
    prescription.rejectionReason = reason || 'Prescription rejected by pharmacist';

    await prescription.save();

    res.json(prescription);
  } catch (error) {
    console.error('Mark prescription rejected error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 32. addOTCToOrder(orderId, medicineId, quantity) - Add OTC items
router.post('/order/:orderId/add-otc', authMiddleware, pharmacistMiddleware, async (req, res) => {
  try {
    const { medicineId, quantity } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    if (medicine.stock.units < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

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
        isAvailable: true
      });
    }

    await order.save();
    await order.populate('items.medicineId', 'name price');

    res.json(order);
  } catch (error) {
    console.error('Add OTC to order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove prescription item from order (pharmacist can remove prescription items)
router.delete('/order/:orderId/prescription-item/:itemId', authMiddleware, pharmacistMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('prescriptionId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!order.prescriptionId) {
      return res.status(400).json({ message: 'This is not a prescription order' });
    }

    const itemToRemove = order.items.find(
      item => item._id.toString() === req.params.itemId && item.isPrescription
    );

    if (!itemToRemove) {
      return res.status(404).json({ message: 'Prescription item not found' });
    }

    // Remove from order
    order.items = order.items.filter(
      item => item._id.toString() !== req.params.itemId
    );

    // Remove from prescription items too
    const prescription = await Prescription.findById(order.prescriptionId);
    if (prescription) {
      prescription.items = prescription.items.filter(
        item => item.medicineId && item.medicineId.toString() !== itemToRemove.medicineId.toString()
      );
      await prescription.save();
    }

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

    res.json({
      message: 'Prescription item removed successfully',
      order: await Order.findById(order._id).populate('items.medicineId', 'name price')
    });
  } catch (error) {
    console.error('Remove prescription item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 33. generateAutoBill(orderId) - Create invoice
router.post('/order/:orderId/generate-bill', authMiddleware, pharmacistMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('items.medicineId', 'name price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Calculate totals
    let subtotal = 0;
    order.items.forEach(item => {
      const price = item.price || (item.medicineId && item.medicineId.price?.perPack) || 0;
      subtotal += price * item.quantity;
      item.price = price;
    });

    const deliveryFee = subtotal > 1000 ? 0 : 200; // Free delivery above 1000
    const totalAmount = subtotal + deliveryFee;

    order.totalAmount = subtotal;
    order.deliveryFee = deliveryFee;
    order.finalAmount = totalAmount;
    order.status = 'pending';

    await order.save();

    // Create invoice
    let invoice = await Invoice.findOne({ orderId: order._id });
    if (!invoice) {
      invoice = new Invoice({
        orderId: order._id,
        patientId: order.patientId,
        items: order.items.map(item => ({
          medicineId: item.medicineId,
          medicineName: item.medicineName,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity
        })),
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        totalAmount: totalAmount,
        paymentMethod: order.paymentMethod || 'online',
        paymentStatus: order.paymentStatus || 'pending'
      });
      await invoice.save();
    } else {
      // Update existing invoice
      invoice.items = order.items.map(item => ({
        medicineId: item.medicineId,
        medicineName: item.medicineName,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      }));
      invoice.subtotal = subtotal;
      invoice.deliveryFee = deliveryFee;
      invoice.totalAmount = totalAmount;
      await invoice.save();
    }

    res.json({ order, invoice });
  } catch (error) {
    console.error('Generate auto bill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 34. checkStock(medicineId) - View inventory
router.get('/medicine/:medicineId/stock', authMiddleware, pharmacistMiddleware, async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.medicineId);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.json({
      medicineId: medicine._id,
      name: medicine.name,
      stock: {
        packs: medicine.stock.packs,
        units: medicine.stock.units,
        baseUnit: medicine.baseUnit
      },
      minStockUnits: medicine.minStockUnits,
      isLowStock: medicine.stock.units <= medicine.minStockUnits,
      isOutOfStock: medicine.stock.units <= 0,
      price: medicine.price
    });
  } catch (error) {
    console.error('Check stock error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 35. markStockOut(medicineId) - Flag unavailable
router.put('/medicine/:medicineId/stock-out', authMiddleware, pharmacistMiddleware, async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.medicineId);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Mark stock as out
    medicine.stock.packs = 0;
    medicine.stock.units = 0;
    medicine.stockAlert = {
      isAlerted: true,
      alertedBy: req.user._id,
      alertedAt: new Date(),
      alertReason: 'Marked as out of stock by pharmacist'
    };

    await medicine.save();

    // Update all pending orders with this medicine
    await Order.updateMany(
      {
        'items.medicineId': medicine._id,
        status: { $in: ['draft', 'pending', 'confirmed'] }
      },
      {
        $set: { 'items.$[elem].isAvailable': false }
      },
      {
        arrayFilters: [{ 'elem.medicineId': medicine._id }]
      }
    );

    res.json({ 
      message: 'Medicine marked as out of stock',
      medicine: medicine 
    });
  } catch (error) {
    console.error('Mark stock out error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 36. suggestAlternativeMedicine(originalId, alternativeId) - Suggest substitutes
router.post('/medicine/:originalId/suggest-alternative', authMiddleware, pharmacistMiddleware, async (req, res) => {
  try {
    const { alternativeId, orderId } = req.body;
    const originalMedicine = await Medicine.findById(req.params.originalId);
    const alternativeMedicine = await Medicine.findById(alternativeId);

    if (!originalMedicine || !alternativeMedicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // If orderId is provided, update the order
    if (orderId) {
      const order = await Order.findById(orderId);
      if (order) {
        const item = order.items.find(
          item => item.medicineId && item.medicineId.toString() === req.params.originalId
        );
        if (item) {
          item.medicineId = alternativeId;
          item.medicineName = alternativeMedicine.name;
          item.price = alternativeMedicine.price.perPack;
          item.isAvailable = alternativeMedicine.stock.units >= item.quantity;
          await order.save();
        }
      }
    }

    res.json({
      message: 'Alternative medicine suggested',
      original: originalMedicine.name,
      alternative: alternativeMedicine.name,
      orderId: orderId
    });
  } catch (error) {
    console.error('Suggest alternative medicine error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get orders requesting audio instructions
router.get('/orders/audio-requests', authMiddleware, pharmacistMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      'audioInstructions.requested': true,
      'audioInstructions.url': { $exists: false }
    })
      .populate('patientId', 'name email phone')
      .populate('items.medicineId', 'name')
      .sort({ 'audioInstructions.requestedAt': -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get audio requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 37. provideAudioInstructions(orderId, audioFile) - Upload audio
router.post('/order/:orderId/audio', authMiddleware, pharmacistMiddleware, audioUpload.single('audioFile'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Audio file is required' });
    }

    const audioUrl = `/uploads/audio/${req.file.filename}`;

    // Store audio URL in order with metadata
    order.audioInstructions = {
      url: audioUrl,
      requested: order.audioInstructions?.requested || false,
      requestedAt: order.audioInstructions?.requestedAt || new Date(),
      providedBy: req.user._id,
      providedAt: new Date()
    };
    await order.save();

    // Also send a chat message with the audio
    let chat = await Chat.findOne({ patientId: order.patientId });
    if (!chat) {
      chat = new Chat({
        patientId: order.patientId,
        pharmacistId: req.user._id,
        messages: [],
        status: 'active'
      });
    }

    chat.messages.push({
      senderId: req.user._id,
      senderName: req.user.name,
      senderRole: 'pharmacist',
      message: `Audio instructions for order ${order.orderId}`,
      audioUrl: audioUrl,
      isBot: false,
      timestamp: new Date()
    });

    chat.lastMessageAt = new Date();
    chat.unreadCount.patient += 1;
    await chat.save();

    res.json({
      message: 'Audio instructions uploaded successfully',
      audioUrl: audioUrl,
      order: order
    });
  } catch (error) {
    console.error('Provide audio instructions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 38. flagChronicPatient(patientId) - Mark chronic patient
router.put('/patient/:patientId/flag-chronic', authMiddleware, pharmacistMiddleware, async (req, res) => {
  try {
    const { conditions } = req.body; // Array of chronic conditions
    const patient = await User.findById(req.params.patientId);

    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ message: 'Patient not found' });
    }

    patient.flaggedAsChronic = true;
    if (conditions && Array.isArray(conditions)) {
      patient.chronicConditions = conditions;
    }

    await patient.save();

    res.json({
      message: 'Patient flagged as chronic',
      patient: {
        id: patient._id,
        name: patient.name,
        flaggedAsChronic: patient.flaggedAsChronic,
        chronicConditions: patient.chronicConditions
      }
    });
  } catch (error) {
    console.error('Flag chronic patient error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 39. createRefillPlan(patientId, medicineId, intervalDays) - Setup refills
router.post('/refill-plan/create', authMiddleware, pharmacistMiddleware, async (req, res) => {
  try {
    const { patientId, medicineId, quantity, intervalDays } = req.body;

    if (!patientId || !medicineId || !quantity || !intervalDays) {
      return res.status(400).json({ 
        message: 'Patient ID, medicine ID, quantity, and interval days are required' 
      });
    }

    const patient = await User.findById(patientId);
    const medicine = await Medicine.findById(medicineId);

    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    const nextRefillDate = new Date();
    nextRefillDate.setDate(nextRefillDate.getDate() + intervalDays);

    const refillPlan = new RefillPlan({
      patientId: patientId,
      medicineId: medicineId,
      medicineName: medicine.name,
      quantity: quantity,
      intervalDays: intervalDays,
      nextRefillDate: nextRefillDate,
      isActive: true,
      createdBy: req.user._id
    });

    await refillPlan.save();

    res.status(201).json(refillPlan);
  } catch (error) {
    console.error('Create refill plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 40. reviewRefillDraft(refillPlanId) - Check refill order
router.get('/refill-plan/:refillPlanId', authMiddleware, pharmacistMiddleware, async (req, res) => {
  try {
    const refillPlan = await RefillPlan.findById(req.params.refillPlanId)
      .populate('patientId', 'name email phone')
      .populate('medicineId', 'name price stock')
      .populate('createdBy', 'name');

    if (!refillPlan) {
      return res.status(404).json({ message: 'Refill plan not found' });
    }

    // Check if there's a draft order for this refill
    const draftOrder = await Order.findOne({
      refillPlanId: refillPlan._id,
      status: 'draft'
    })
      .populate('items.medicineId', 'name price stock');

    res.json({
      refillPlan: refillPlan,
      draftOrder: draftOrder
    });
  } catch (error) {
    console.error('Review refill draft error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 41. assignToDelivery(orderId, deliveryPersonId) - Assign delivery
router.put('/order/:orderId/assign-delivery', authMiddleware, pharmacistMiddleware, async (req, res) => {
  try {
    const { deliveryPersonId } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'ready' && order.status !== 'confirmed') {
      return res.status(400).json({ 
        message: 'Order must be ready or confirmed before assigning delivery' 
      });
    }

    // Verify delivery person exists and has correct role
    const deliveryPerson = await User.findById(deliveryPersonId);
    if (!deliveryPerson || deliveryPerson.role !== 'delivery') {
      return res.status(404).json({ message: 'Delivery person not found' });
    }

    order.assignedTo = deliveryPersonId;
    order.status = 'out_for_delivery';
    order.deliveryStatus = 'assigned';

    // Set estimated delivery (e.g., 2 hours from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setHours(estimatedDelivery.getHours() + 2);
    order.estimatedDelivery = estimatedDelivery;

    await order.save();

    res.json({
      message: 'Order assigned to delivery',
      order: await Order.findById(order._id).populate('assignedTo', 'name phone')
    });
  } catch (error) {
    console.error('Assign to delivery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


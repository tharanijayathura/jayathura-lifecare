const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const auth = require('../middleware/auth');

// Create OTC order - Function 18: createOrder
router.post('/otc', auth, async (req, res) => {
  try {
    const { items } = req.body;
    
    // Check medicine availability
    for (let item of items) {
      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine || medicine.stock < item.quantity) {
        return res.status(400).json({ 
          error: `${medicine.name} is out of stock or insufficient quantity` 
        });
      }
    }

    const order = new Order({
      patientId: req.user.id,
      type: 'otc',
      items,
      status: 'draft'
    });

    await order.save();
    await order.populate('items.medicineId', 'name price');
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate bill - Function 33: generateAutoBill
router.post('/:id/generate-bill', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.medicineId');
    
    let totalAmount = 0;
    order.items.forEach(item => {
      totalAmount += item.medicineId.price * item.quantity;
    });
    
    // Apply delivery fee (simplified)
    const deliveryFee = totalAmount > 1000 ? 0 : 200; // Free delivery above 1000
    const finalAmount = totalAmount + deliveryFee;
    
    order.totalAmount = totalAmount;
    order.deliveryFee = deliveryFee;
    order.finalAmount = finalAmount;
    order.status = 'pending';
    
    await order.save();
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Confirm order - Function 11: confirmOrder
router.put('/:id/confirm', auth, async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const order = await Order.findById(req.params.id);
    
    order.paymentMethod = paymentMethod;
    order.status = 'confirmed';
    order.paymentStatus = paymentMethod === 'cod' ? 'pending' : 'paid';
    
    // Update stock
    for (let item of order.items) {
      await Medicine.findByIdAndUpdate(
        item.medicineId,
        { $inc: { stock: -item.quantity } }
      );
    }
    
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order status - Function 5: viewOrderStatus
router.get('/:id/status', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('patientId', 'name email')
      .populate('assignedTo', 'name')
      .populate('items.medicineId', 'name');
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
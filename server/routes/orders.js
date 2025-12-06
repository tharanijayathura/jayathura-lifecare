const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const { authMiddleware } = require('../middleware/auth');

// Create OTC order - Function 18: createOrder
router.post('/otc', authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;
    
    // Check medicine availability
    for (let item of items) {
      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine) {
        return res.status(400).json({ 
          error: `Medicine not found` 
        });
      }
      if (!medicine.stock || medicine.stock.units < item.quantity) {
        return res.status(400).json({ 
          error: `${medicine.name} is out of stock or insufficient quantity` 
        });
      }
    }

    const order = new Order({
      patientId: req.user._id,
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
router.post('/:id/generate-bill', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.medicineId');
    
    let totalAmount = 0;
    order.items.forEach(item => {
      const price = item.price || (item.medicineId && item.medicineId.price?.perPack) || 0;
      totalAmount += price * item.quantity;
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
router.put('/:id/confirm', authMiddleware, async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const order = await Order.findById(req.params.id);
    
    order.paymentMethod = paymentMethod;
    order.status = 'confirmed';
    order.paymentStatus = paymentMethod === 'cod' ? 'pending' : 'paid';
    
    // Update stock (decrease units, which will be recalculated on save)
    for (let item of order.items) {
      const medicine = await Medicine.findById(item.medicineId);
      if (medicine) {
        // Decrease units
        medicine.stock.units -= item.quantity;
        // Recalculate packs
        if (medicine.packaging && medicine.packaging.qtyPerPack > 0) {
          medicine.stock.packs = Math.floor(medicine.stock.units / medicine.packaging.qtyPerPack);
        }
        await medicine.save();
      }
    }
    
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order status - Function 5: viewOrderStatus
router.get('/:id/status', authMiddleware, async (req, res) => {
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
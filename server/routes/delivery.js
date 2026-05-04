const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authMiddleware } = require('../middleware/auth');

// Middleware to ensure user is a delivery person
const deliveryMiddleware = (req, res, next) => {
  if (req.user.role !== 'delivery' && !req.user.isSuperAdmin) {
    return res.status(403).json({ message: 'Access denied. Delivery person role required.' });
  }
  next();
};

// Get all orders assigned to the delivery person
router.get('/orders', authMiddleware, deliveryMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ 
      assignedTo: req.user._id,
      status: { $in: ['ready', 'out_for_delivery', 'processing'] } 
    })
    .populate('patientId', 'name phone address')
    .sort({ updatedAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get delivery orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order delivery status
router.put('/order/:orderId/status', authMiddleware, deliveryMiddleware, async (req, res) => {
  try {
    const { status, message, location } = req.body;
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify assignment
    if (order.assignedTo.toString() !== req.user._id.toString() && !req.user.isSuperAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    // Update main status if it matches specific progression
    if (status === 'out_for_delivery' || status === 'delivered') {
      order.status = status;
    }

    // Add to tracking history
    order.trackingHistory.push({
      status: status || order.status,
      message: message || `Order status updated to ${status}`,
      location: location || 'Pharmacy Hub',
      timestamp: new Date()
    });

    await order.save();
    res.json({ message: 'Status updated successfully', order });
  } catch (error) {
    console.error('Update delivery status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

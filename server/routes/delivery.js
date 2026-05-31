const express = require('express');
const router = require('express').Router();
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
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
      if (status === 'delivered') {
        order.paymentStatus = 'paid';
        order.deliveredAt = new Date();
        // Also update invoice status if it exists
        try {
          await Invoice.findOneAndUpdate(
            { orderId: order._id },
            { paymentStatus: 'paid', paidAt: new Date() }
          );
        } catch (invoiceErr) {
          console.error('Failed to update invoice payment status:', invoiceErr);
        }
      }
    }
    if (message) {
      order.deliveryStatus = message;
    } else {
      order.deliveryStatus = status;
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

// Get delivery person profile
router.get('/profile', authMiddleware, deliveryMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get delivery profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update delivery person profile
router.put('/profile', authMiddleware, deliveryMiddleware, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (name) user.name = name;
    if (phone) user.phone = phone;
    await user.save();
    
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update delivery profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// server/routes/admin.js
const express = require('express');
const User = require('../models/User');
const { adminMiddleware, superAdminMiddleware } = require('../middleware/auth');
const router = express.Router();

// Get all pending users (users waiting for approval)
router.get('/pending-users', superAdminMiddleware, async (req, res) => {
  try {
    const pendingUsers = await User.find({ 
      isApproved: false,
      role: { $in: ['admin', 'pharmacist', 'delivery'] }
    }).select('-password').sort({ createdAt: -1 });

    res.json(pendingUsers);
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve a user
router.post('/approve/:userId', superAdminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isApproved) {
      return res.status(400).json({ message: 'User is already approved' });
    }

    user.isApproved = true;
    user.approvedBy = req.user._id;
    user.approvedAt = new Date();
    await user.save();

    console.log(`User ${user.email} (${user.role}) approved by ${req.user.email}`);

    res.json({ 
      message: 'User approved successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved
      }
    });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject a user (delete or deactivate)
router.post('/reject/:userId', superAdminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user instead of just deactivating
    await User.findByIdAndDelete(userId);

    console.log(`User ${user.email} (${user.role}) rejected and deleted by ${req.user.email}`);

    res.json({ message: 'User rejected and removed successfully' });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (for admin dashboard)
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


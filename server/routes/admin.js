// server/routes/admin.js
const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
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


// Get admin profile
router.get('/profile', adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update admin profile
router.put('/profile', adminMiddleware, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...(name && { name }), ...(phone && { phone }) },
      { new: true }
    ).select('-password');
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/analytics - Compile database metrics dynamically
router.get('/analytics', adminMiddleware, async (req, res) => {
  try {
    const { timePeriod = 'month' } = req.query;
    
    // Calculate start date based on timePeriod
    let startDate = new Date();
    if (timePeriod === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (timePeriod === 'threeMonths') {
      startDate.setDate(startDate.getDate() - 90);
    } else {
      // default is 'month' (30 days)
      startDate.setDate(startDate.getDate() - 30);
    }

    // 1. Total Revenue (Sum finalAmount of confirmed/processing/ready/out_for_delivery/delivered orders)
    const revenueRes = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ['confirmed', 'processing', 'ready', 'out_for_delivery', 'delivered'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$finalAmount' }
        }
      }
    ]);
    const totalRevenue = revenueRes.length > 0 ? revenueRes[0].total : 0;

    // 2. Total Orders (excluding draft)
    const totalOrders = await Order.countDocuments({
      createdAt: { $gte: startDate },
      status: { $ne: 'draft' }
    });

    // 3. Items Sold (Sum quantity in items of non-draft/non-cancelled orders)
    const itemsRes = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $nin: ['draft', 'cancelled'] }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: null,
          totalQty: { $sum: '$items.quantity' }
        }
      }
    ]);
    const totalSales = itemsRes.length > 0 ? itemsRes[0].totalQty : 0;

    // 4. Total Users
    const totalUsers = await User.countDocuments();
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalCouriers = await User.countDocuments({ role: 'delivery' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalMedicines = await Medicine.countDocuments();
    
    const Invoice = require('../models/Invoice');
    const RefillPlan = require('../models/RefillPlan');
    const totalInvoices = await Invoice.countDocuments();
    const totalRefills = await RefillPlan.countDocuments();

    const orderStatuses = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const statusCounts = {
      pending: 0,
      processing: 0,
      ready: 0,
      out_for_delivery: 0,
      delivered: 0,
      cancelled: 0
    };
    orderStatuses.forEach(s => {
      if (s._id) {
        statusCounts[s._id] = s.count;
      }
    });

    // 5. Active Pharmacists
    const activePharmacists = await User.countDocuments({
      role: 'pharmacist',
      isApproved: true
    });

    // 6. Prescriptions Processed
    const prescriptionsProcessed = await Order.countDocuments({
      createdAt: { $gte: startDate },
      type: 'prescription',
      status: { $in: ['confirmed', 'processing', 'ready', 'out_for_delivery', 'delivered'] }
    });

    // 7. Top Selling Products
    const topSelling = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $nin: ['draft', 'cancelled'] }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.medicineName',
          quantity: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { quantity: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          name: '$_id',
          quantity: 1,
          revenue: 1
        }
      }
    ]);

    // If empty top selling, add mock placeholders for design stability
    const cleanTopSelling = topSelling.length > 0 ? topSelling : [
      { name: 'No products sold yet', quantity: 0, revenue: 0 }
    ];

    // 8. Category Breakdown (Group by order type)
    const categoryRes = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $nin: ['draft', 'cancelled'] }
        }
      },
      {
        $group: {
          _id: '$type',
          sales: { $sum: 1 },
          revenue: { $sum: '$finalAmount' }
        }
      },
      {
        $project: {
          _id: 0,
          category: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 'otc'] }, then: 'OTC' },
                { case: { $eq: ['$_id', 'prescription'] }, then: 'Prescription' },
                { case: { $eq: ['$_id', 'refill'] }, then: 'Refill' },
                { case: { $eq: ['$_id', 'mixed'] }, then: 'Mixed' }
              ],
              default: 'Other'
            }
          },
          sales: 1,
          revenue: { $ifNull: ['$revenue', 0] }
        }
      }
    ]);

    // 9. Revenue by Category (Medicines vs Groceries)
    const revenueByCategoryRes = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ['confirmed', 'processing', 'ready', 'out_for_delivery', 'delivered'] }
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'medicines',
          localField: 'items.medicineId',
          foreignField: '_id',
          as: 'medDetails'
        }
      },
      {
        $project: {
          price: '$items.price',
          quantity: '$items.quantity',
          isMedicine: { $gt: [{ $size: '$medDetails' }, 0] }
        }
      },
      {
        $group: {
          _id: '$isMedicine',
          revenue: { $sum: { $multiply: ['$price', '$quantity'] } }
        }
      }
    ]);

    let medicinesRev = 0;
    let groceriesRev = 0;
    revenueByCategoryRes.forEach(r => {
      if (r._id === true) {
        medicinesRev += r.revenue;
      } else {
        groceriesRev += r.revenue;
      }
    });

    const totalCategoryRev = medicinesRev + groceriesRev || 1;
    const revenueByCategory = [
      { category: 'Medicines', revenue: medicinesRev, percentage: Math.round((medicinesRev / totalCategoryRev) * 100) },
      { category: 'Groceries', revenue: groceriesRev, percentage: Math.round((groceriesRev / totalCategoryRev) * 100) }
    ];

    // 10. User Growth Trend (Group by day)
    const userGrowthRes = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          newUsers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          period: '$_id',
          newUsers: 1
        }
      }
    ]);

    // Fill missing dates with 0 to keep the chart beautiful
    const userGrowth = [];
    const dateCursor = new Date(startDate);
    const today = new Date();
    while (dateCursor <= today) {
      const dateStr = dateCursor.toISOString().split('T')[0];
      const match = userGrowthRes.find(d => d.period === dateStr);
      userGrowth.push({
        period: dateStr.substring(5),
        newUsers: match ? match.newUsers : 0
      });
      dateCursor.setDate(dateCursor.getDate() + 1);
    }

    // 11. Revenue Trend (Group by day)
    const revenueTrendRes = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ['confirmed', 'processing', 'ready', 'out_for_delivery', 'delivered'] }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$finalAmount' }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          period: '$_id',
          revenue: 1
        }
      }
    ]);

    // Fill missing dates with 0 to keep the chart beautiful
    const revenueTrend = [];
    const revCursor = new Date(startDate);
    while (revCursor <= today) {
      const dateStr = revCursor.toISOString().split('T')[0];
      const match = revenueTrendRes.find(d => d.period === dateStr);
      revenueTrend.push({
        period: dateStr.substring(5),
        revenue: match ? match.revenue : 0
      });
      revCursor.setDate(revCursor.getDate() + 1);
    }

    res.json({
      totalSales,
      totalRevenue,
      totalUsers,
      totalPatients,
      totalCouriers,
      totalAdmins,
      totalMedicines,
      totalInvoices,
      totalRefills,
      statusCounts,
      activePharmacists,
      totalOrders,
      prescriptionsProcessed,
      topSelling: cleanTopSelling,
      categoryBreakdown: categoryRes.length > 0 ? categoryRes : [{ category: 'OTC', sales: 0, revenue: 0 }],
      userGrowth: userGrowth.slice(-15),
      revenueTrend: revenueTrend.slice(-15),
      revenueByCategory
    });

  } catch (error) {
    console.error('Get admin analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admin/users/:userId - Delete a user (admin only)
router.delete('/users/:userId', adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Prevent admin from deleting themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot remove your own admin account.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await User.findByIdAndDelete(userId);
    console.log(`User ${user.email} (${user.role}) was deleted by admin ${req.user.email}`);

    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;



// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Check MongoDB connection before querying
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  MongoDB not connected, but attempting to proceed...');
      // Still try to query, but handle errors gracefully
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    // Check if non-patient user is approved
    if (user.role !== 'patient' && !user.isApproved) {
      return res.status(403).json({
        message: 'Your account is pending approval. Please wait for administrator approval.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    // Distinguish between JWT errors and MongoDB errors
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      console.error('Auth middleware JWT error:', error.message);
      return res.status(401).json({ message: 'Invalid or expired token' });
    } else if (error.name === 'MongoServerSelectionError' || error.name === 'MongoNetworkError') {
      console.error('Auth middleware MongoDB connection error:', error.message);
      // Don't expose MongoDB errors to client, return generic error
      return res.status(503).json({ 
        message: 'Database connection issue. Please try again in a moment.' 
      });
    } else {
      console.error('Auth middleware error:', error.message || error);
      return res.status(401).json({ message: 'Authentication failed' });
    }
  }
};

// Middleware to check if user is admin or super admin
const adminMiddleware = async (req, res, next) => {
  try {
    await authMiddleware(req, res, () => {
      if (req.user.role !== 'admin' && !req.user.isSuperAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }
      next();
    });
  } catch (error) {
    return res.status(403).json({ message: 'Admin access required' });
  }
};

// Middleware to check if user is super admin
const superAdminMiddleware = async (req, res, next) => {
  try {
    await authMiddleware(req, res, () => {
      if (!req.user.isSuperAdmin) {
        return res.status(403).json({ message: 'Super admin access required' });
      }
      next();
    });
  } catch (error) {
    return res.status(403).json({ message: 'Super admin access required' });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  superAdminMiddleware
};


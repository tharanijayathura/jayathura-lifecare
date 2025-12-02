// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const ALLOWED_ROLES = ['patient', 'pharmacist', 'delivery', 'admin'];

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'patient', phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check existing user
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    
    // Patients are auto-approved, others need super admin approval
    const isApproved = role === 'patient';
    
    const user = new User({ 
      name, 
      email: normalizedEmail, 
      password: hashed, 
      role, 
      phone,
      isApproved 
    });
    await user.save();

    // Optional server log for visibility
    console.log('New user registered:', { 
      id: user._id.toString(), 
      email: user.email, 
      role: user.role,
      isApproved: user.isApproved 
    });

    // Return message based on approval status
    let message = 'Registration successful!';
    if (!isApproved) {
      message = 'Registration successful! Your account is pending approval by the administrator. You will be notified once approved.';
    }

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      phone: user.phone,
      message: message
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log(`Login attempt failed: User not found - ${normalizedEmail}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      console.log(`Login attempt failed: Wrong password - ${normalizedEmail}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if account is active
    if (!user.isActive) {
      console.log(`Login attempt failed: Account deactivated - ${normalizedEmail}`);
      return res.status(403).json({ 
        message: 'Account is deactivated. Please contact administrator.' 
      });
    }

    // Check if non-patient user is approved
    if (user.role !== 'patient' && !user.isApproved) {
      console.log(`Login attempt failed: Account not approved - ${normalizedEmail} (${user.role})`);
      return res.status(403).json({
        message: 'Your account is pending approval. Please wait for administrator approval.'
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '24h' }
    );

    console.log(`✅ Login successful: ${user.email} (${user.role})`);

    res.json({
      token,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      isSuperAdmin: user.isSuperAdmin,
      phone: user.phone
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
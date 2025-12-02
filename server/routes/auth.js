// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendPasswordResetEmail } = require('../utils/emailService');
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

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    
    // Always return success message for security (don't reveal if email exists)
    if (!user) {
      return res.json({ 
        message: 'If an account with that email exists, a verification code has been sent.' 
      });
    }

    // Generate 6-digit verification code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration (10 minutes from now)
    const resetExpires = new Date();
    resetExpires.setMinutes(resetExpires.getMinutes() + 10);

    // Save reset code to user
    user.passwordResetCode = resetCode;
    user.passwordResetExpires = resetExpires;
    await user.save();

    // Send email with verification code
    try {
      await sendPasswordResetEmail(user.email, resetCode);
      console.log(`✅ Password reset code sent to ${user.email}`);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Still return success to user, but log the error
      // The code is still saved in the database, so user can use it
    }

    // Always return success (for security - don't reveal if email exists)
    // The verification code is saved in the database regardless of email status
    // For security we don't return the reset code in the API response.
    // The code is saved in the database and emailed to the user.
    res.json({ message: 'If an account with that email exists, a verification code has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// POST /api/auth/verify-reset-code
router.post('/verify-reset-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ message: 'Email and verification code are required' });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if code matches
    if (user.passwordResetCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Check if code has expired
    if (!user.passwordResetExpires || new Date() > user.passwordResetExpires) {
      return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
    }

    // Code is valid
    res.json({ 
      message: 'Verification code is valid. You can now reset your password.',
      verified: true
    });
  } catch (error) {
    console.error('Verify reset code error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    
    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Email, verification code, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify code
    if (user.passwordResetCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Check if code has expired
    if (!user.passwordResetExpires || new Date() > user.passwordResetExpires) {
      return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset code
    user.password = hashedPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    console.log(`✅ Password reset successful for ${user.email}`);

    res.json({ 
      message: 'Password has been reset successfully. You can now login with your new password.' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
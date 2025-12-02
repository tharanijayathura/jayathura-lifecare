const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['patient', 'pharmacist', 'admin', 'delivery'], 
    required: true 
  },
  phone: String,
  address: {
    street: String,
    city: String,
    postalCode: String
  },
  isActive: { type: Boolean, default: true },
  isApproved: { 
    type: Boolean, 
    default: function() {
      // Patients are auto-approved, others need super admin approval
      return this.role === 'patient';
    }
  },
  isSuperAdmin: { type: Boolean, default: false },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: Date,
  chronicConditions: [String],
  flaggedAsChronic: { type: Boolean, default: false },
  passwordResetCode: String,
  passwordResetExpires: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
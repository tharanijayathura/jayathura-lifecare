const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
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
  chronicConditions: [String],
  flaggedAsChronic: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: String,
  category: { 
    type: String, 
    enum: ['prescription', 'otc', 'chronic'], 
    required: true 
  },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  minStock: { type: Number, default: 10 },
  image: String,
  requiresPrescription: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
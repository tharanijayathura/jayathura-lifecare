const mongoose = require('mongoose');

const grocerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  minStock: { type: Number, default: 10 },
  image: String, // URL or base64
  unit: { type: String, default: 'item' }, // item, kg, liter, etc.
  isActive: { type: Boolean, default: true },
  // Stock alert system
  stockAlert: {
    isAlerted: { type: Boolean, default: false },
    alertedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    alertedAt: Date,
    alertReason: String
  }
}, { timestamps: true });

// Virtual to check if stock is low
grocerySchema.virtual('isLowStock').get(function() {
  return this.stock <= this.minStock;
});

// Method to check if stock is critically low (0 or negative)
grocerySchema.virtual('isOutOfStock').get(function() {
  return this.stock <= 0;
});

module.exports = mongoose.model('Grocery', grocerySchema);


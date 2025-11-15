const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, required: true },
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['prescription', 'otc', 'refill'], 
    required: true 
  },
  prescriptionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Prescription' 
  },
  items: [{
    medicineId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Medicine' 
    },
    medicineName: String,
    quantity: Number,
    price: Number,
    isAvailable: { type: Boolean, default: true }
  }],
  status: { 
    type: String, 
    enum: ['draft', 'pending', 'confirmed', 'processing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'draft'
  },
  totalAmount: Number,
  deliveryFee: Number,
  finalAmount: Number,
  paymentMethod: { 
    type: String, 
    enum: ['online', 'cod'], 
    default: 'online' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending' 
  },
  deliveryAddress: {
    street: String,
    city: String,
    postalCode: String
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  deliveryStatus: String,
  estimatedDelivery: Date,
  isRefill: { type: Boolean, default: false },
  refillPlanId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'RefillPlan' 
  }
}, { timestamps: true });

// Generate order ID before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = `JLC${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
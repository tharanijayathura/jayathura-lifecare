const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true }, // Auto-generated in pre-save hook
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['prescription', 'otc', 'refill', 'mixed'], // mixed = prescription + OTC
    required: true 
  },
  prescriptionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Prescription' 
  },
  notes: { type: String },
  items: [{
    medicineId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Medicine' 
    },
    medicineName: String,
    quantity: Number,
    price: Number,
    isAvailable: { type: Boolean, default: true },
    isPrescription: { type: Boolean, default: false }, // Mark if from prescription
    dosage: String, // e.g., "500mg", "1 tablet"
    frequency: String, // e.g., "Twice daily", "After meals"
    instructions: String // Additional instructions
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
  },
  supplyDuration: { type: Number, default: 7 },
  deliveredAt: Date,
  lastNotifiedAt: Date,
  audioInstructions: {
    url: String,
    requested: { type: Boolean, default: false },
    requestedAt: Date,
    providedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    providedAt: Date
  },
  feedback: {
    rating: Number,
    comments: String,
    submittedAt: Date
  },
  trackingHistory: [{
    status: String,
    message: String,
    location: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Generate order ID before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    try {
      // Find the order with the highest orderId
      const lastOrder = await mongoose.model('Order')
        .findOne({ orderId: { $regex: /^JLC\d+$/ } })
        .sort({ orderId: -1 });

      let nextNum = 1;
      if (lastOrder && lastOrder.orderId) {
        const lastNum = parseInt(lastOrder.orderId.replace('JLC', ''), 10);
        if (!isNaN(lastNum)) {
          nextNum = lastNum + 1;
        }
      }

      // Safeguard loop to guarantee uniqueness
      let uniqueId = `JLC${String(nextNum).padStart(6, '0')}`;
      let exists = await mongoose.model('Order').findOne({ orderId: uniqueId });
      while (exists) {
        nextNum++;
        uniqueId = `JLC${String(nextNum).padStart(6, '0')}`;
        exists = await mongoose.model('Order').findOne({ orderId: uniqueId });
      }

      this.orderId = uniqueId;
    } catch (error) {
      // Fallback if sequence generation fails
      this.orderId = `JLC${String(Date.now()).slice(-6)}`;
    }
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
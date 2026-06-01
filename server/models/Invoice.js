const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceId: { type: String, unique: true, required: true },
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [{
    medicineId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Medicine' 
    },
    medicineName: String,
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['online', 'cod'], 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending' 
  },
  generatedAt: { type: Date, default: Date.now },
  paidAt: Date
}, { timestamps: true });

// Generate invoice ID before validation
invoiceSchema.pre('validate', async function(next) {
  if (!this.invoiceId) {
    try {
      // Find the invoice with the highest invoiceId
      const lastInvoice = await mongoose.model('Invoice')
        .findOne({ invoiceId: { $regex: /^INV\d+$/ } })
        .sort({ invoiceId: -1 });

      let nextNum = 1;
      if (lastInvoice && lastInvoice.invoiceId) {
        const lastNum = parseInt(lastInvoice.invoiceId.replace('INV', ''), 10);
        if (!isNaN(lastNum)) {
          nextNum = lastNum + 1;
        }
      }

      // Safeguard loop to guarantee uniqueness
      let uniqueId = `INV${String(nextNum).padStart(6, '0')}`;
      let exists = await mongoose.model('Invoice').findOne({ invoiceId: uniqueId });
      while (exists) {
        nextNum++;
        uniqueId = `INV${String(nextNum).padStart(6, '0')}`;
        exists = await mongoose.model('Invoice').findOne({ invoiceId: uniqueId });
      }

      this.invoiceId = uniqueId;
    } catch (error) {
      // Fallback: use timestamp-based ID if sequence fails
      this.invoiceId = `INV${Date.now().toString().slice(-8)}`;
    }
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);


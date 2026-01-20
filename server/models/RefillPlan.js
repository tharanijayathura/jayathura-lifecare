const mongoose = require('mongoose');

const refillPlanSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  medicineId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Medicine', 
    required: true 
  },
  medicineName: String,
  quantity: { type: Number, required: true },
  intervalDays: { type: Number, required: true }, // Days between refills
  nextRefillDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  lastRefilledAt: Date,
  refillCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('RefillPlan', refillPlanSchema);





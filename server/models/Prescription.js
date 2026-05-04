const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  imageUrl: { type: String, required: true },
  originalName: { type: String },
  fileName: { type: String },
  mimeType: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'], 
    default: 'pending' 
  },
  verifiedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  verifiedAt: Date,
  rejectionReason: String,
  activities: [{
    type: {
      type: String,
      enum: ['uploaded', 'reviewed', 'item-added', 'item-removed', 'verified', 'rejected', 'bill-generated'],
      required: true
    },
    note: String,
    actorId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    actorRole: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  items: [{
    medicineId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Medicine' 
    },
    medicineName: String,
    quantity: Number,
    dosage: String,
    frequency: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
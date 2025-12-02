// server/models/Chat.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: function() { return !this.isBot; } },
  senderName: { type: String, required: true },
  senderRole: { type: String, enum: ['patient', 'pharmacist', 'admin', 'bot'], required: true },
  message: { type: String, required: true },
  isBot: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pharmacistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional, if assigned
  messages: [messageSchema],
  status: {
    type: String,
    enum: ['active', 'closed', 'waiting'],
    default: 'active',
  },
  lastMessageAt: { type: Date, default: Date.now },
  unreadCount: {
    patient: { type: Number, default: 0 },
    pharmacist: { type: Number, default: 0 },
  },
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);


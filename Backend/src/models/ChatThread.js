const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatThreadSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmerName: { type: String, required: true },
  govId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  govName: { type: String, default: 'Procurement Officer' },
  subject: { type: String, required: true },
  category: {
    type: String,
    enum: ['Procurement', 'Payments', 'Logistics', 'Quality Dispute', 'General Enquiry'],
    default: 'General Enquiry'
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved'],
    default: 'Open'
  },
  lastMessage: { type: String, default: '' },
  lastMessageAt: { type: Date, default: Date.now },
  messages: [messageSchema]
}, { timestamps: true });

module.exports = mongoose.model('ChatThread', chatThreadSchema);

const mongoose = require('mongoose');
const crypto = require('crypto');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SlotBooking'
  },
  orderNumber: {
    type: String,
    default: ''
  },
  hubName: {
    type: String,
    default: 'Central Procurement Hub'
  },
  type: {
    type: String,
    enum: ['Slot Booking', 'Quality Verification', 'Weighment Completed', 'Payment Disbursed', 'Direct Bank Transfer'],
    required: true
  },
  amount: {
    type: Number,
    default: 0
  },
  crop: {
    type: String,
    default: 'Wheat'
  },
  quantityQuintals: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Failed'],
    default: 'Completed'
  },
  referenceNumber: {
    type: String,
    required: true,
    unique: true
  },
  previousHash: {
    type: String,
    default: '0000000000000000000000000000000000000000000000000000000000000000'
  },
  blockHash: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Static helper to create a verified block in the transparency ledger
transactionSchema.statics.createLedgerBlock = async function(txData) {
  const lastTx = await this.findOne().sort({ createdAt: -1 });
  const prevHash = lastTx ? lastTx.blockHash : '0000000000000000000000000000000000000000000000000000000000000000';
  
  const payload = `${prevHash}|${txData.userId}|${txData.type}|${txData.amount}|${txData.referenceNumber}|${Date.now()}`;
  const blockHash = crypto.createHash('sha256').update(payload).digest('hex');

  const record = new this({
    ...txData,
    previousHash: prevHash,
    blockHash: blockHash
  });

  return await record.save();
};

module.exports = mongoose.model('Transaction', transactionSchema);

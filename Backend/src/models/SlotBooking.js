const mongoose = require('mongoose');

const slotBookingSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hub',
    required: true
  },
  cropName: {
    type: String,
    required: true
  },
  variety: {
    type: String,
    default: 'Standard Grade'
  },
  estimatedQuantityQuintals: {
    type: Number,
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['Tractor-Trolley', 'Small Truck', 'Heavy Truck', 'Bullock Cart', 'Other'],
    default: 'Tractor-Trolley'
  },
  vehicleNumber: {
    type: String,
    default: 'PB-10-XX-0000'
  },
  bookingDate: {
    type: String, // YYYY-MM-DD
    required: true
  },
  timeSlot: {
    type: String, // e.g. "09:00 AM - 11:00 AM"
    required: true
  },
  status: {
    type: String,
    enum: [
      'Slot Booked',
      'In Queue',
      'Quality Check',
      'Weighing',
      'Payment Processing',
      'Completed',
      'Cancelled'
    ],
    default: 'Slot Booked'
  },
  queueToken: {
    type: String
  },
  // Quality Check Details
  qualityGrade: {
    type: String,
    enum: ['Pending', 'Grade A (FAQ)', 'Grade B', 'Grade C', 'Rejected'],
    default: 'Pending'
  },
  moisturePercentage: {
    type: Number,
    default: null
  },
  foreignMatterPercentage: {
    type: Number,
    default: null
  },
  qualityInspector: {
    type: String,
    default: ''
  },
  qualityCheckNotes: {
    type: String,
    default: ''
  },
  // Weighing Details
  grossWeightKg: {
    type: Number,
    default: null
  },
  tareWeightKg: {
    type: Number,
    default: null
  },
  netWeightQuintals: {
    type: Number,
    default: null
  },
  weighbridgeOperator: {
    type: String,
    default: ''
  },
  // Payment Details
  mspRatePerQuintal: {
    type: Number,
    default: 2275 // e.g. Wheat MSP
  },
  deductions: {
    type: Number,
    default: 0
  },
  totalAmountPayable: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['Unprocessed', 'Processing', 'Paid', 'Failed'],
    default: 'Unprocessed'
  },
  bankReferenceNumber: {
    type: String,
    default: ''
  },
  paidAt: {
    type: Date
  },
  // Transparency Ledger & Blockchain Hash
  blockHash: {
    type: String,
    default: ''
  },
  previousBlockHash: {
    type: String,
    default: '00000000000000000000000000000000'
  },
  // Timeline log
  timeline: [
    {
      status: { type: String },
      description: { type: String },
      updatedBy: { type: String },
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('SlotBooking', slotBookingSchema);

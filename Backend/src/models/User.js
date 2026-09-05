const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  aadhaar: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['farmer', 'government', 'admin'],
    default: 'farmer'
  },
  preferredLanguage: {
    type: String,
    default: 'en'
  },
  // Profile Details
  state: { type: String, default: 'Punjab' },
  district: { type: String, default: 'Ludhiana' },
  village: { type: String, default: '' },
  pincode: { type: String, default: '' },
  
  // Farmer specific details
  landAreaAcres: { type: Number, default: 5 },
  primaryCrops: [{ type: String }],
  kisanCreditCardNo: { type: String, default: '' },
  bankDetails: {
    accountNumber: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    bankName: { type: String, default: '' },
    holderName: { type: String, default: '' }
  },

  // Government / Institution specific details
  institutionName: { type: String, default: '' },
  designation: { type: String, default: '' },
  department: { type: String, default: '' },
  assignedHubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hub' },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);

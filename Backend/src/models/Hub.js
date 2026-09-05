const mongoose = require('mongoose');

const hubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  contactPhone: { type: String, default: '1800-180-1551' },
  officerInCharge: { type: String, default: 'Hub Procurement Officer' },
  totalDailyCapacityQuintals: { type: Number, default: 5000 },
  operatingHours: {
    start: { type: String, default: '08:00' },
    end: { type: String, default: '18:00' }
  },
  acceptedCrops: [{ type: String }],
  storageCapacityTotalQuintals: { type: Number, default: 50000 },
  currentStorageQuintals: { type: Number, default: 18500 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Hub', hubSchema);

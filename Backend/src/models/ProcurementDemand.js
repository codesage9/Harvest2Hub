const mongoose = require('mongoose');

const procurementDemandSchema = new mongoose.Schema({
  title: { type: String, required: true },
  cropName: { type: String, required: true },
  season: { type: String, default: 'Rabi 2026-27' },
  targetQuantityQuintals: { type: Number, required: true },
  procuredQuantityQuintals: { type: Number, default: 0 },
  mspPrice: { type: Number, required: true },
  hubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hub' },
  state: { type: String, default: 'All' },
  validUntil: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Completed', 'Paused'], default: 'Active' },
  guidelines: { type: String, default: 'Procurement as per Fair Average Quality (FAQ) standards.' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('ProcurementDemand', procurementDemandSchema);

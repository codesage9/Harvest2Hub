const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const SlotBooking = require('../models/SlotBooking');
const Transaction = require('../models/Transaction');
const ProcurementDemand = require('../models/ProcurementDemand');
const { verifyToken, requireRole } = require('../middleware/auth');

// GET /api/orders/all - For Gov / Admin overview
router.get('/all', verifyToken, async (req, res) => {
  try {
    const { status, crop, hubId, search } = req.query;
    const filter = {};

    if (status && status !== 'All') filter.status = status;
    if (crop && crop !== 'All') filter.cropName = crop;
    if (hubId) filter.hubId = hubId;

    let query = SlotBooking.find(filter)
      .populate('farmerId', 'name phone state district aadhaar bankDetails')
      .populate('hubId', 'name district state')
      .sort({ createdAt: -1 });

    const orders = await query;
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving procurement orders.' });
  }
});

// GET /api/orders/:orderId - Details of a particular order
router.get('/:orderId', verifyToken, async (req, res) => {
  try {
    const order = await SlotBooking.findById(req.params.orderId)
      .populate('farmerId', 'name phone state district aadhaar bankDetails')
      .populate('hubId', 'name district state address contactPhone operatingHours');

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Authorization check
    if (req.user.role === 'farmer' && order.farmerId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this order.' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order details.' });
  }
});

// PATCH /api/orders/:orderId/advance-status - Process order through stages
// Stages: Slot Booked -> In Queue -> Quality Check -> Weighing -> Payment Processing -> Completed
router.patch('/:orderId/advance-status', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const {
      newStatus,
      qualityGrade,
      moisturePercentage,
      foreignMatterPercentage,
      qualityCheckNotes,
      grossWeightKg,
      tareWeightKg,
      mspRatePerQuintal,
      bankReferenceNumber,
      notes
    } = req.body;

    const order = await SlotBooking.findById(orderId).populate('hubId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Role check: Only gov or admin can update quality, weighing, payment
    if (req.user.role === 'farmer' && !['Cancelled'].includes(newStatus)) {
      return res.status(403).json({ message: 'Only authorized Hub / Government officers can update order stages.' });
    }

    let description = notes || `Status advanced to ${newStatus}`;

    if (newStatus) {
      order.status = newStatus;
    }

    // Handle Quality Check stage
    if (qualityGrade) {
      order.qualityGrade = qualityGrade;
      order.moisturePercentage = moisturePercentage !== undefined ? Number(moisturePercentage) : order.moisturePercentage;
      order.foreignMatterPercentage = foreignMatterPercentage !== undefined ? Number(foreignMatterPercentage) : order.foreignMatterPercentage;
      order.qualityInspector = req.user.name;
      order.qualityCheckNotes = qualityCheckNotes || 'Inspected under Fair Average Quality norms';
      description = `Quality inspection completed. Grade awarded: ${qualityGrade}. Moisture: ${moisturePercentage || 12}%.`;
      
      // Add ledger transaction for Quality Certification
      const refNum = `TXN-QC-${Date.now().toString().slice(-8)}`;
      await Transaction.createLedgerBlock({
        userId: order.farmerId,
        orderId: order._id,
        orderNumber: order.orderNumber,
        hubName: order.hubId?.name || 'Hub',
        type: 'Quality Verification',
        crop: order.cropName,
        quantityQuintals: order.estimatedQuantityQuintals,
        status: 'Completed',
        referenceNumber: refNum
      });
    }

    // Handle Weighing stage
    if (grossWeightKg !== undefined && tareWeightKg !== undefined) {
      order.grossWeightKg = Number(grossWeightKg);
      order.tareWeightKg = Number(tareWeightKg);
      const netKg = order.grossWeightKg - order.tareWeightKg;
      const netQuintals = Math.max(0, Math.round((netKg / 100) * 100) / 100);
      order.netWeightQuintals = netQuintals;
      order.weighbridgeOperator = req.user.name;

      const rate = mspRatePerQuintal || order.mspRatePerQuintal || 2275;
      order.mspRatePerQuintal = rate;
      order.totalAmountPayable = Math.round(netQuintals * rate);

      description = `Gross Weight: ${grossWeightKg}kg, Tare: ${tareWeightKg}kg, Net Weight: ${netQuintals} Quintals. Total MSP Payout calculated: ₹${order.totalAmountPayable.toLocaleString('en-IN')}.`;

      // Add ledger transaction for Weighment
      const refNum = `TXN-WEIGH-${Date.now().toString().slice(-8)}`;
      await Transaction.createLedgerBlock({
        userId: order.farmerId,
        orderId: order._id,
        orderNumber: order.orderNumber,
        hubName: order.hubId?.name || 'Hub',
        type: 'Weighment Completed',
        crop: order.cropName,
        quantityQuintals: netQuintals,
        amount: order.totalAmountPayable,
        status: 'Completed',
        referenceNumber: refNum
      });
    }

    // Handle Payment stage
    if (newStatus === 'Completed' || newStatus === 'Payment Processing') {
      const bankRef = bankReferenceNumber || `DBT-SBI-${Math.floor(100000000 + Math.random() * 900000000)}`;
      order.paymentStatus = 'Paid';
      order.bankReferenceNumber = bankRef;
      order.paidAt = new Date();

      description = `Direct Benefit Transfer (DBT) released to registered farmer bank account. Ref: ${bankRef}. Transaction verified on transparency ledger.`;

      // Add ledger transaction for Payment Disbursed
      const refNum = `TXN-PAY-${Date.now().toString().slice(-8)}`;
      await Transaction.createLedgerBlock({
        userId: order.farmerId,
        orderId: order._id,
        orderNumber: order.orderNumber,
        hubName: order.hubId?.name || 'Hub',
        type: 'Direct Bank Transfer',
        crop: order.cropName,
        quantityQuintals: order.netWeightQuintals || order.estimatedQuantityQuintals,
        amount: order.totalAmountPayable,
        status: 'Completed',
        referenceNumber: refNum
      });
    }

    // Recalculate block hash for the order
    const hashData = `${order.orderNumber}|${order.status}|${order.netWeightQuintals}|${order.totalAmountPayable}|${Date.now()}`;
    const newHash = crypto.createHash('sha256').update(hashData).digest('hex');
    order.previousBlockHash = order.blockHash || '00000000000000000000000000000000';
    order.blockHash = newHash;

    // Append to timeline
    order.timeline.push({
      status: order.status,
      description,
      updatedBy: req.user.name,
      timestamp: new Date()
    });

    await order.save();

    res.json({
      success: true,
      message: `Order updated to ${order.status}!`,
      order
    });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ message: 'Error updating order status.' });
  }
});

// GET /api/orders/demands/all - Government procurement tenders/demands
router.get('/demands/all', verifyToken, async (req, res) => {
  try {
    const demands = await ProcurementDemand.find()
      .populate('hubId', 'name district state')
      .sort({ createdAt: -1 });
    res.json(demands);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching procurement demands.' });
  }
});

// POST /api/orders/demands/create - Create new procurement demand
router.post('/demands/create', verifyToken, requireRole('government', 'admin'), async (req, res) => {
  try {
    const { title, cropName, season, targetQuantityQuintals, mspPrice, hubId, validUntil, guidelines } = req.body;

    const newDemand = new ProcurementDemand({
      title,
      cropName,
      season: season || 'Rabi 2026-27',
      targetQuantityQuintals: Number(targetQuantityQuintals),
      mspPrice: Number(mspPrice),
      hubId,
      validUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      guidelines,
      createdBy: req.user.id
    });

    const saved = await newDemand.save();
    res.status(201).json({ success: true, demand: saved });
  } catch (err) {
    res.status(500).json({ message: 'Error creating procurement demand.' });
  }
});

module.exports = router;

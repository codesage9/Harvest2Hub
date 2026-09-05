const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const SlotBooking = require('../models/SlotBooking');
const Hub = require('../models/Hub');
const Transaction = require('../models/Transaction');
const { verifyToken, requireRole } = require('../middleware/auth');

// MSP Rates map (in INR per Quintal) as benchmark for 2026-27
const MSP_MAP = {
  'Wheat': 2275,
  'Paddy (Common)': 2183,
  'Paddy (Grade A)': 2203,
  'Mustard': 5650,
  'Gram (Chana)': 5440,
  'Maize': 2090,
  'Barley': 1850,
  'Soybean': 4600,
  'Cotton': 6620
};

// POST /api/slots/book - Farmer books a procurement slot
router.post('/book', verifyToken, async (req, res) => {
  try {
    const {
      hubId,
      cropName,
      variety,
      estimatedQuantityQuintals,
      vehicleType,
      vehicleNumber,
      bookingDate,
      timeSlot
    } = req.body;

    const farmerId = req.user.id;

    if (!hubId || !cropName || !estimatedQuantityQuintals || !bookingDate || !timeSlot) {
      return res.status(400).json({ message: 'Missing mandatory booking details.' });
    }

    const qty = Number(estimatedQuantityQuintals);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive number.' });
    }

    const hub = await Hub.findById(hubId);
    if (!hub) {
      return res.status(404).json({ message: 'Selected procurement hub not found.' });
    }

    // Capacity Check
    const existingBookings = await SlotBooking.find({
      hubId,
      bookingDate,
      status: { $ne: 'Cancelled' }
    });

    const totalBooked = existingBookings.reduce((sum, b) => sum + (b.estimatedQuantityQuintals || 0), 0);
    if (totalBooked + qty > (hub.totalDailyCapacityQuintals || 5000)) {
      return res.status(400).json({
        message: `Hub daily capacity exceeded for ${bookingDate}. Available capacity: ${(hub.totalDailyCapacityQuintals || 5000) - totalBooked} quintals.`
      });
    }

    // Generate Order Number & Queue Token
    const orderNumber = `H2H-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const queueToken = `Q-${Math.floor(10 + Math.random() * 90)}`;
    const mspRate = MSP_MAP[cropName] || 2200;
    const estTotalAmount = qty * mspRate;

    // Initial Block Hash for transparency
    const hashData = `${orderNumber}|${farmerId}|${hubId}|${cropName}|${qty}|${Date.now()}`;
    const initialHash = crypto.createHash('sha256').update(hashData).digest('hex');

    const newBooking = new SlotBooking({
      orderNumber,
      farmerId,
      hubId,
      cropName,
      variety: variety || 'Standard Grade',
      estimatedQuantityQuintals: qty,
      vehicleType: vehicleType || 'Tractor-Trolley',
      vehicleNumber: vehicleNumber || 'PB-10-AZ-1234',
      bookingDate,
      timeSlot,
      status: 'Slot Booked',
      queueToken,
      mspRatePerQuintal: mspRate,
      totalAmountPayable: estTotalAmount,
      blockHash: initialHash,
      timeline: [
        {
          status: 'Slot Booked',
          description: `Slot scheduled at ${hub.name} for ${timeSlot} on ${bookingDate}. Token ${queueToken} generated.`,
          updatedBy: req.user.name
        }
      ]
    });

    const savedBooking = await newBooking.save();

    // Create automatic Transaction Log Entry
    const refNum = `TXN-BOOK-${Date.now().toString().slice(-8)}`;
    await Transaction.createLedgerBlock({
      userId: farmerId,
      orderId: savedBooking._id,
      orderNumber: savedBooking.orderNumber,
      hubName: hub.name,
      type: 'Slot Booking',
      amount: estTotalAmount,
      crop: cropName,
      quantityQuintals: qty,
      status: 'Confirmed',
      referenceNumber: refNum
    });

    res.status(201).json({
      success: true,
      message: 'Procurement slot booked successfully!',
      booking: savedBooking
    });
  } catch (err) {
    console.error('Book slot error:', err);
    res.status(500).json({ message: 'Server error while booking slot.' });
  }
});

// GET /api/slots/all - All slots (Gov / Admin view)
router.get('/all', verifyToken, async (req, res) => {
  try {
    const { status, date, hubId } = req.query;
    const filter = {};
    if (status && status !== 'All') filter.status = status;
    if (date) filter.bookingDate = date;
    if (hubId) filter.hubId = hubId;

    const slots = await SlotBooking.find(filter)
      .populate('farmerId', 'name phone state district aadhaar bankDetails')
      .populate('hubId', 'name district state')
      .sort({ createdAt: -1 });

    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving slots.' });
  }
});

// GET /api/slots/:farmerId - Get slots by specific farmer
router.get('/:farmerId', verifyToken, async (req, res) => {
  try {
    const { farmerId } = req.params;

    // Security check: farmer can only see own slots unless gov/admin
    if (req.user.role === 'farmer' && req.user.id !== farmerId) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const slots = await SlotBooking.find({ farmerId })
      .populate('hubId', 'name district state address contactPhone')
      .sort({ createdAt: -1 });

    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching farmer slots.' });
  }
});

module.exports = router;

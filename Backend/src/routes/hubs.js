const express = require('express');
const router = express.Router();
const Hub = require('../models/Hub');
const SlotBooking = require('../models/SlotBooking');

// GET /api/hubs - List all active procurement hubs
router.get('/', async (req, res) => {
  try {
    const { state, crop } = req.query;
    const filter = { active: true };
    if (state && state !== 'All') filter.state = state;
    if (crop) filter.acceptedCrops = crop;

    const hubs = await Hub.find(filter).sort({ name: 1 });
    res.json(hubs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching hubs.' });
  }
});

// GET /api/hubs/:hubId - Get hub details and capacity
router.get('/:hubId', async (req, res) => {
  try {
    const hub = await Hub.findById(req.params.hubId);
    if (!hub) {
      return res.status(404).json({ message: 'Hub not found.' });
    }
    res.json(hub);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching hub.' });
  }
});

// GET /api/hubs/:hubId/availability - Check capacity for a specific date
router.get('/:hubId/availability', async (req, res) => {
  try {
    const { hubId } = req.params;
    const { date } = req.query; // YYYY-MM-DD

    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required.' });
    }

    const hub = await Hub.findById(hubId);
    if (!hub) {
      return res.status(404).json({ message: 'Hub not found.' });
    }

    // Find all bookings for this hub on this date that are not cancelled
    const bookings = await SlotBooking.find({
      hubId,
      bookingDate: date,
      status: { $ne: 'Cancelled' }
    });

    const bookedQuintals = bookings.reduce((sum, b) => sum + (b.estimatedQuantityQuintals || 0), 0);
    const dailyCapacity = hub.totalDailyCapacityQuintals || 5000;
    const remainingCapacity = Math.max(0, dailyCapacity - bookedQuintals);

    const timeSlots = [
      { slot: '08:00 AM - 10:00 AM', maxSlots: 20 },
      { slot: '10:00 AM - 12:00 PM', maxSlots: 25 },
      { slot: '12:00 PM - 02:00 PM', maxSlots: 20 },
      { slot: '02:00 PM - 04:00 PM', maxSlots: 25 },
      { slot: '04:00 PM - 06:00 PM', maxSlots: 20 }
    ];

    const slotBreakdown = timeSlots.map(ts => {
      const bookedCount = bookings.filter(b => b.timeSlot === ts.slot).length;
      return {
        slot: ts.slot,
        totalCapacity: ts.maxSlots,
        booked: bookedCount,
        available: Math.max(0, ts.maxSlots - bookedCount)
      };
    });

    res.json({
      hubId,
      date,
      dailyCapacityQuintals: dailyCapacity,
      bookedQuintals,
      remainingCapacityQuintals: remainingCapacity,
      utilizationPercentage: Math.min(100, Math.round((bookedQuintals / dailyCapacity) * 100)),
      slotBreakdown
    });
  } catch (err) {
    console.error('Hub availability error:', err);
    res.status(500).json({ message: 'Error checking hub availability.' });
  }
});

module.exports = router;

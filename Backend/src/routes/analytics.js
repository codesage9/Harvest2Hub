const express = require('express');
const router = express.Router();
const SlotBooking = require('../models/SlotBooking');
const Hub = require('../models/Hub');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const ProcurementDemand = require('../models/ProcurementDemand');
const { verifyToken } = require('../middleware/auth');

// GET /api/analytics/overview
router.get('/overview', verifyToken, async (req, res) => {
  try {
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalHubs = await Hub.countDocuments({ active: true });
    const totalOrders = await SlotBooking.countDocuments();
    
    // Total Grain Procured (Net Weight in Quintals)
    const completedOrders = await SlotBooking.find({
      status: { $in: ['Payment Processing', 'Completed'] }
    });

    const totalProcuredQuintals = completedOrders.reduce((acc, o) => acc + (o.netWeightQuintals || o.estimatedQuantityQuintals || 0), 0);
    const totalDisbursedAmount = completedOrders.reduce((acc, o) => acc + (o.totalAmountPayable || 0), 0);

    // Orders by Status
    const bookedCount = await SlotBooking.countDocuments({ status: 'Slot Booked' });
    const inQueueCount = await SlotBooking.countDocuments({ status: 'In Queue' });
    const qcCount = await SlotBooking.countDocuments({ status: 'Quality Check' });
    const weighingCount = await SlotBooking.countDocuments({ status: 'Weighing' });
    const completedCount = completedOrders.length;

    // Crop Breakdown
    const cropStats = await SlotBooking.aggregate([
      {
        $group: {
          _id: '$cropName',
          totalQuintals: { $sum: '$estimatedQuantityQuintals' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalQuintals: -1 } }
    ]);

    // Hub Capacity Summary
    const hubs = await Hub.find({ active: true });
    const totalStorageCapacity = hubs.reduce((acc, h) => acc + (h.storageCapacityTotalQuintals || 0), 0);
    const currentStorageUsed = hubs.reduce((acc, h) => acc + (h.currentStorageQuintals || 0), 0);

    res.json({
      summary: {
        totalFarmers,
        totalHubs,
        totalOrders,
        totalProcuredQuintals,
        totalDisbursedAmount,
        totalStorageCapacity,
        currentStorageUsed,
        storageUtilizationPercent: Math.round((currentStorageUsed / (totalStorageCapacity || 1)) * 100)
      },
      statusDistribution: {
        booked: bookedCount,
        inQueue: inQueueCount,
        qualityCheck: qcCount,
        weighing: weighingCount,
        completed: completedCount
      },
      cropBreakdown: cropStats,
      hubs: hubs.map(h => ({
        id: h._id,
        name: h.name,
        state: h.state,
        district: h.district,
        totalDailyCapacity: h.totalDailyCapacityQuintals,
        storageCapacity: h.storageCapacityTotalQuintals,
        currentStorage: h.currentStorageQuintals
      }))
    });
  } catch (err) {
    console.error('Analytics overview error:', err);
    res.status(500).json({ message: 'Error loading analytics.' });
  }
});

module.exports = router;

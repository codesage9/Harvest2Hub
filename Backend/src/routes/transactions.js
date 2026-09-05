const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { verifyToken } = require('../middleware/auth');

// GET /api/transactions/ledger/all - Public/Official Transparency Ledger
router.get('/ledger/all', async (req, res) => {
  try {
    const { limit = 50, type } = req.query;
    const filter = {};
    if (type && type !== 'All') filter.type = type;

    const ledger = await Transaction.find(filter)
      .populate('userId', 'name phone state district role')
      .populate('orderId', 'orderNumber cropName status netWeightQuintals')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json(ledger);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving transparency ledger.' });
  }
});

// GET /api/transactions/:userId - User specific transactions
router.get('/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Access check: User can only see own transactions unless gov/admin
    if (req.user.role === 'farmer' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const txs = await Transaction.find({ userId })
      .populate('orderId')
      .sort({ createdAt: -1 });

    res.json(txs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching transactions.' });
  }
});

module.exports = router;

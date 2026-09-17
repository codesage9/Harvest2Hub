const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const hubRoutes = require('./src/routes/hubs');
const slotRoutes = require('./src/routes/slots');
const orderRoutes = require('./src/routes/orders');
const communityRoutes = require('./src/routes/community');
const chatRoutes = require('./src/routes/chat');
const transactionRoutes = require('./src/routes/transactions');
const analyticsRoutes = require('./src/routes/analytics');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/harvest2hub';

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hubs', hubRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'Krishi-Setu',
    problemStatement: 'SIH 26032',
    timestamp: new Date().toISOString(),
    databaseState: mongoose.connection.readyState === 1 ? 'connected' : 'connecting'
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.send('Krishi-Setu API Backend is running! (SIH Problem Statement 26032)');
});

// Database Connection and Server Boot
async function startServer() {
  try {
    console.log('Connecting to MongoDB at:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB.');

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(` Krishi-Setu Backend running on http://localhost:${PORT}`);
      console.log(` Problem Statement: SIH 26032`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    // Still start Express server so health check & mock can run if needed
    app.listen(PORT, () => {
      console.log(`Krishi-Setu Server running on http://localhost:${PORT} (DB Connection Pending)`);
    });
  }
}

startServer();

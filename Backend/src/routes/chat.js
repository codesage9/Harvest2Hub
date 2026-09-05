const express = require('express');
const router = express.Router();
const ChatThread = require('../models/ChatThread');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// GET /api/chat/threads - List user's threads
router.get('/threads', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let filter = {};
    if (role === 'farmer') {
      filter = { farmerId: userId };
    } else {
      // Gov and admin can see all threads or assigned threads
      filter = {};
    }

    const threads = await ChatThread.find(filter)
      .populate('farmerId', 'name phone state district')
      .populate('govId', 'name institutionName designation')
      .sort({ lastMessageAt: -1 });

    res.json(threads);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving chat threads.' });
  }
});

// POST /api/chat/create-thread - Start a new enquiry thread
router.post('/create-thread', verifyToken, async (req, res) => {
  try {
    const { subject, category, initialMessage } = req.body;

    if (!subject || !initialMessage) {
      return res.status(400).json({ message: 'Subject and initial message are required.' });
    }

    const newThread = new ChatThread({
      farmerId: req.user.id,
      farmerName: req.user.name,
      subject,
      category: category || 'General Enquiry',
      lastMessage: initialMessage,
      lastMessageAt: new Date(),
      messages: [
        {
          senderId: req.user.id,
          senderName: req.user.name,
          senderRole: req.user.role,
          text: initialMessage,
          timestamp: new Date()
        }
      ]
    });

    const savedThread = await newThread.save();
    res.status(201).json({ success: true, thread: savedThread });
  } catch (err) {
    console.error('Create thread error:', err);
    res.status(500).json({ message: 'Error initiating enquiry thread.' });
  }
});

// GET /api/chat/:threadId - Get messages in a thread
router.get('/:threadId', verifyToken, async (req, res) => {
  try {
    const thread = await ChatThread.findById(req.params.threadId)
      .populate('farmerId', 'name phone state district bankDetails')
      .populate('govId', 'name institutionName designation department');

    if (!thread) {
      return res.status(404).json({ message: 'Enquiry thread not found.' });
    }

    res.json(thread);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving thread.' });
  }
});

// POST /api/chat/send - Send a message to a thread
router.post('/send', verifyToken, async (req, res) => {
  try {
    const { threadId, text } = req.body;

    if (!threadId || !text) {
      return res.status(400).json({ message: 'Thread ID and message text are required.' });
    }

    const thread = await ChatThread.findById(threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found.' });
    }

    const message = {
      senderId: req.user.id,
      senderName: req.user.name,
      senderRole: req.user.role,
      text,
      timestamp: new Date()
    };

    thread.messages.push(message);
    thread.lastMessage = text;
    thread.lastMessageAt = new Date();

    // If Gov officer is replying, set govId and govName
    if (req.user.role === 'government' || req.user.role === 'admin') {
      thread.govId = req.user.id;
      thread.govName = req.user.name;
    }

    await thread.save();

    res.json({
      success: true,
      message: 'Message sent successfully!',
      chatMessage: message,
      thread
    });
  } catch (err) {
    console.error('Chat send error:', err);
    res.status(500).json({ message: 'Error sending message.' });
  }
});

module.exports = router;

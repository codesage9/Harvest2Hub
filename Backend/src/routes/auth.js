const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, verifyToken } = require('../middleware/auth');

// In-memory OTP storage for mock verification: { phone: { otp, expiresAt } }
const otpStore = new Map();

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required.' });
    }

    // Generate mock 6-digit OTP (for demo, 123456 or random 6-digit)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(phone, {
      otp: otp,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    console.log(`[OTP SERVICE] Generated OTP for ${phone}: ${otp}`);

    res.json({
      success: true,
      message: 'OTP sent successfully (Mock service: use demo code or check response)',
      mockOtp: otp // Included for easy hackathon testing/grading
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: 'Server error while sending OTP.' });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone and OTP are required.' });
    }

    const record = otpStore.get(phone);
    // Allow '123456' as universal test OTP for quick testing
    if (otp === '123456' || (record && record.otp === otp && record.expiresAt > Date.now())) {
      otpStore.delete(phone);
      return res.json({ success: true, message: 'OTP verified successfully.' });
    }

    return res.status(400).json({ message: 'Invalid or expired OTP. (Default test code: 123456)' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ message: 'Server error while verifying OTP.' });
  }
});

// POST /api/auth/register
router.registerValidation = (data) => {
  const { name, phone, aadhaar, email, password, role } = data;
  if (!name || !phone || !aadhaar || !email || !password || !role) {
    return 'All mandatory fields (name, phone, Aadhaar, email, password, role) must be provided.';
  }
  return null;
};

router.post('/register', async (req, res) => {
  try {
    const {
      name,
      phone,
      aadhaar,
      email,
      password,
      role,
      state,
      district,
      landAreaAcres,
      institutionName,
      department,
      bankDetails
    } = req.body;

    const errorMsg = router.registerValidation(req.body);
    if (errorMsg) {
      return res.status(400).json({ message: errorMsg });
    }

    // Check existing
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone: phone }]
    });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or phone number already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      phone,
      aadhaar,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'farmer',
      state: state || 'Punjab',
      district: district || 'Ludhiana',
      landAreaAcres: landAreaAcres || 5,
      institutionName: institutionName || '',
      department: department || '',
      bankDetails: bankDetails || {
        accountNumber: 'XXXX-XXXX-1234',
        ifscCode: 'SBIN0001234',
        bankName: 'State Bank of India',
        holderName: name
      }
    });

    await newUser.save();

    // Generate token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, name: newUser.name, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        aadhaar: newUser.aadhaar,
        role: newUser.role,
        state: newUser.state,
        district: newUser.district,
        bankDetails: newUser.bankDetails
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials: User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials: Password incorrect.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        aadhaar: user.aadhaar,
        role: user.role,
        state: user.state,
        district: user.district,
        preferredLanguage: user.preferredLanguage,
        bankDetails: user.bankDetails,
        institutionName: user.institutionName,
        landAreaAcres: user.landAreaAcres
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
});

// GET /api/auth/me
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user profile.' });
  }
});

// GET /api/profile/:userId
router.get('/profile/:userId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile.' });
  }
});

// PUT /api/profile/:userId
router.put('/profile/:userId', verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this profile.' });
    }

    const allowedUpdates = [
      'name', 'phone', 'state', 'district', 'village', 'pincode',
      'landAreaAcres', 'primaryCrops', 'bankDetails', 'preferredLanguage',
      'institutionName', 'designation', 'department'
    ];

    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updates },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile.' });
  }
});

module.exports = router;

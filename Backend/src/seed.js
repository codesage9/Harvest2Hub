const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
require('dotenv').config();

const User = require('./models/User');
const Hub = require('./models/Hub');
const SlotBooking = require('./models/SlotBooking');
const ProcurementDemand = require('./models/ProcurementDemand');
const CommunityPost = require('./models/CommunityPost');
const ChatThread = require('./models/ChatThread');
const Transaction = require('./models/Transaction');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/harvest2hub';

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB at:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Connected!');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Hub.deleteMany({}),
      SlotBooking.deleteMany({}),
      ProcurementDemand.deleteMany({}),
      CommunityPost.deleteMany({}),
      ChatThread.deleteMany({}),
      Transaction.deleteMany({})
    ]);

    console.log('Old collections purged.');

    // 1. Create Hubs
    const hubs = await Hub.create([
      {
        name: 'Ludhiana Central Grain Silo & APMC Hub',
        code: 'HUB-PB-01',
        state: 'Punjab',
        district: 'Ludhiana',
        address: 'GT Road Procurement Complex, Ludhiana, Punjab - 141001',
        pincode: '141001',
        contactPhone: '0161-2401960',
        officerInCharge: 'Er. Harpreet Singh (Divisional Manager)',
        totalDailyCapacityQuintals: 6500,
        operatingHours: { start: '08:00', end: '18:00' },
        acceptedCrops: ['Wheat', 'Paddy (Common)', 'Paddy (Grade A)', 'Maize', 'Barley'],
        storageCapacityTotalQuintals: 60000,
        currentStorageQuintals: 24200
      },
      {
        name: 'Karnal Modern Automated Grain Terminal',
        code: 'HUB-HR-02',
        state: 'Haryana',
        district: 'Karnal',
        address: 'Sector 34 Agro Logistics Park, Karnal, Haryana - 132001',
        pincode: '132001',
        contactPhone: '0184-2254321',
        officerInCharge: 'Dr. Rameshwar Dayal (Quality Superintendent)',
        totalDailyCapacityQuintals: 5000,
        operatingHours: { start: '08:30', end: '18:30' },
        acceptedCrops: ['Wheat', 'Mustard', 'Paddy (Grade A)', 'Gram (Chana)'],
        storageCapacityTotalQuintals: 45000,
        currentStorageQuintals: 19800
      },
      {
        name: 'Indore Malwa Agro Warehousing & Procurement Hub',
        code: 'HUB-MP-03',
        state: 'Madhya Pradesh',
        district: 'Indore',
        address: 'Kshipra Mandi By-pass, Indore, MP - 452010',
        pincode: '452010',
        contactPhone: '0731-2856789',
        officerInCharge: 'Smt. Anjali Sharma (Senior Mandi Secretary)',
        totalDailyCapacityQuintals: 5500,
        operatingHours: { start: '08:00', end: '17:30' },
        acceptedCrops: ['Wheat', 'Soybean', 'Gram (Chana)', 'Maize'],
        storageCapacityTotalQuintals: 52000,
        currentStorageQuintals: 31000
      },
      {
        name: 'Nashik Onion & Coarse Grains Procurement Center',
        code: 'HUB-MH-04',
        state: 'Maharashtra',
        district: 'Nashik',
        address: 'Lasalgaon Mandi Yard Road, Nashik, Maharashtra - 422306',
        pincode: '422306',
        contactPhone: '02550-266123',
        officerInCharge: 'Shri Balasaheb Patil (Hub Director)',
        totalDailyCapacityQuintals: 4800,
        operatingHours: { start: '08:00', end: '18:00' },
        acceptedCrops: ['Soybean', 'Maize', 'Cotton', 'Wheat'],
        storageCapacityTotalQuintals: 40000,
        currentStorageQuintals: 16500
      }
    ]);
    console.log(`Created ${hubs.length} Hubs.`);

    // 2. Create Users
    const passwordHash = await bcrypt.hash('password123', 10);

    const farmerUser = await User.create({
      name: 'Gurdeep Singh Dhillon',
      phone: '9876543210',
      aadhaar: '5489-1234-8765',
      email: 'farmer@harvest2hub.gov.in',
      password: passwordHash,
      role: 'farmer',
      state: 'Punjab',
      district: 'Ludhiana',
      village: 'Samrala Kalan',
      pincode: '141114',
      landAreaAcres: 14.5,
      primaryCrops: ['Wheat', 'Paddy (Grade A)', 'Mustard'],
      kisanCreditCardNo: 'KCC-PB-99824',
      bankDetails: {
        accountNumber: '3049281900213',
        ifscCode: 'SBIN0001432',
        bankName: 'State Bank of India',
        holderName: 'Gurdeep Singh Dhillon'
      },
      preferredLanguage: 'en'
    });

    const farmerUser2 = await User.create({
      name: 'Rajesh Ramrao Deshmukh',
      phone: '9822012345',
      aadhaar: '6789-4321-9876',
      email: 'rajesh.farmer@harvest2hub.gov.in',
      password: passwordHash,
      role: 'farmer',
      state: 'Maharashtra',
      district: 'Nashik',
      village: 'Niphad',
      pincode: '422303',
      landAreaAcres: 9.0,
      primaryCrops: ['Soybean', 'Maize', 'Wheat'],
      kisanCreditCardNo: 'KCC-MH-44129',
      bankDetails: {
        accountNumber: '445566778899',
        ifscCode: 'BARB0LASALG',
        bankName: 'Bank of Baroda',
        holderName: 'Rajesh Ramrao Deshmukh'
      },
      preferredLanguage: 'hi'
    });

    const govUser = await User.create({
      name: 'Vikramaditya Verma (IAS)',
      phone: '9412345678',
      aadhaar: '1234-5678-9012',
      email: 'gov@harvest2hub.gov.in',
      password: passwordHash,
      role: 'government',
      state: 'Punjab',
      district: 'Ludhiana',
      institutionName: 'Food Corporation of India (FCI) & State Warehousing Corp',
      designation: 'Chief Procurement Nodal Officer',
      department: 'Department of Food & Public Distribution',
      assignedHubId: hubs[0]._id,
      preferredLanguage: 'en'
    });

    const adminUser = await User.create({
      name: 'SIH 26032 Administrator',
      phone: '9999988888',
      aadhaar: '9999-8888-7777',
      email: 'admin@harvest2hub.gov.in',
      password: passwordHash,
      role: 'admin',
      institutionName: 'Ministry of Agriculture & Farmers Welfare, GoI',
      designation: 'Central System Supervisor',
      department: 'Digital Agriculture Mission',
      preferredLanguage: 'en'
    });

    console.log('Created Demo Users (farmer, gov, admin).');

    // 3. Create Sample Bookings & Full Lifecycle Orders
    const sampleDateToday = new Date().toISOString().split('T')[0];
    const sampleDateTomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    // Order 1: Completed Full Cycle (Slot Booked -> In Queue -> Quality Check -> Weighing -> Payment -> Completed)
    const initialHash1 = crypto.createHash('sha256').update(`H2H-2026-001|${farmerUser._id}|${hubs[0]._id}|Wheat|150`).digest('hex');
    const finalHash1 = crypto.createHash('sha256').update(`H2H-2026-001|Completed|148.5|337837`).digest('hex');

    const order1 = await SlotBooking.create({
      orderNumber: 'H2H-2026-001',
      farmerId: farmerUser._id,
      hubId: hubs[0]._id,
      cropName: 'Wheat',
      variety: 'Sharbati A-1',
      estimatedQuantityQuintals: 150,
      vehicleType: 'Tractor-Trolley',
      vehicleNumber: 'PB-10-DF-4421',
      bookingDate: sampleDateToday,
      timeSlot: '08:00 AM - 10:00 AM',
      status: 'Completed',
      queueToken: 'Q-04',
      qualityGrade: 'Grade A (FAQ)',
      moisturePercentage: 11.2,
      foreignMatterPercentage: 0.4,
      qualityInspector: 'Dr. Gurmukh Sandhu',
      qualityCheckNotes: 'Excellent grain hardness, certified Fair Average Quality (FAQ) Grade A',
      grossWeightKg: 19850,
      tareWeightKg: 5000,
      netWeightQuintals: 148.5,
      weighbridgeOperator: 'Kuldeep Singh',
      mspRatePerQuintal: 2275,
      deductions: 0,
      totalAmountPayable: 337838,
      paymentStatus: 'Paid',
      bankReferenceNumber: 'DBT-SBI-994821094',
      paidAt: new Date(),
      blockHash: finalHash1,
      previousBlockHash: initialHash1,
      timeline: [
        { status: 'Slot Booked', description: 'Slot scheduled at Ludhiana Central Hub for 08:00 AM - 10:00 AM', updatedBy: 'Gurdeep Singh Dhillon', timestamp: new Date(Date.now() - 4 * 3600000) },
        { status: 'In Queue', description: 'Vehicle checked in at Hub Gate 1. Token Q-04 issued.', updatedBy: 'Security Station Gate 1', timestamp: new Date(Date.now() - 3 * 3600000) },
        { status: 'Quality Check', description: 'Moisture 11.2%, Foreign Matter 0.4%. Passed Grade A (FAQ).', updatedBy: 'Dr. Gurmukh Sandhu', timestamp: new Date(Date.now() - 2 * 3600000) },
        { status: 'Weighing', description: 'Net weight verified: 148.50 Quintals at weighbridge scale #2.', updatedBy: 'Kuldeep Singh', timestamp: new Date(Date.now() - 1 * 3600000) },
        { status: 'Completed', description: 'Payment disbursed via DBT to SBI A/c ending 0213. Transaction immutable ledger entry generated.', updatedBy: 'FCI Finance Portal', timestamp: new Date() }
      ]
    });

    // Order 2: In Quality Check Stage
    const order2 = await SlotBooking.create({
      orderNumber: 'H2H-2026-002',
      farmerId: farmerUser._id,
      hubId: hubs[0]._id,
      cropName: 'Mustard',
      variety: 'Pusa Bold',
      estimatedQuantityQuintals: 80,
      vehicleType: 'Small Truck',
      vehicleNumber: 'PB-10-AZ-8921',
      bookingDate: sampleDateToday,
      timeSlot: '10:00 AM - 12:00 PM',
      status: 'Quality Check',
      queueToken: 'Q-11',
      qualityGrade: 'Grade A (FAQ)',
      moisturePercentage: 7.8,
      mspRatePerQuintal: 5650,
      totalAmountPayable: 452000,
      blockHash: crypto.createHash('sha256').update('H2H-2026-002|QC').digest('hex'),
      timeline: [
        { status: 'Slot Booked', description: 'Slot scheduled at Ludhiana Central Hub.', updatedBy: 'Gurdeep Singh Dhillon', timestamp: new Date(Date.now() - 2 * 3600000) },
        { status: 'In Queue', description: 'Vehicle PB-10-AZ-8921 entered yard. Token Q-11.', updatedBy: 'Gate 2 Operator', timestamp: new Date(Date.now() - 1 * 3600000) },
        { status: 'Quality Check', description: 'Grain sampling undergoing moisture and oil-content testing.', updatedBy: 'Lab Officer 3', timestamp: new Date() }
      ]
    });

    // Order 3: Booked for Tomorrow
    const order3 = await SlotBooking.create({
      orderNumber: 'H2H-2026-003',
      farmerId: farmerUser._id,
      hubId: hubs[0]._id,
      cropName: 'Wheat',
      variety: 'PBW 343',
      estimatedQuantityQuintals: 120,
      vehicleType: 'Tractor-Trolley',
      vehicleNumber: 'PB-10-DF-4421',
      bookingDate: sampleDateTomorrow,
      timeSlot: '02:00 PM - 04:00 PM',
      status: 'Slot Booked',
      queueToken: 'Q-22',
      mspRatePerQuintal: 2275,
      totalAmountPayable: 273000,
      blockHash: crypto.createHash('sha256').update('H2H-2026-003|Booked').digest('hex'),
      timeline: [
        { status: 'Slot Booked', description: 'Slot booked for tomorrow afternoon. Waiting for dispatch.', updatedBy: 'Gurdeep Singh Dhillon', timestamp: new Date() }
      ]
    });

    // Order 4 for Maharashtra Farmer
    const order4 = await SlotBooking.create({
      orderNumber: 'H2H-2026-004',
      farmerId: farmerUser2._id,
      hubId: hubs[3]._id,
      cropName: 'Soybean',
      variety: 'JS 335',
      estimatedQuantityQuintals: 95,
      vehicleType: 'Tractor-Trolley',
      vehicleNumber: 'MH-15-AB-7711',
      bookingDate: sampleDateToday,
      timeSlot: '08:00 AM - 10:00 AM',
      status: 'Weighing',
      queueToken: 'Q-07',
      qualityGrade: 'Grade A (FAQ)',
      moisturePercentage: 10.5,
      mspRatePerQuintal: 4600,
      totalAmountPayable: 437000,
      blockHash: crypto.createHash('sha256').update('H2H-2026-004|Weighing').digest('hex'),
      timeline: [
        { status: 'Slot Booked', description: 'Slot scheduled at Nashik Hub.', updatedBy: 'Rajesh Ramrao Deshmukh', timestamp: new Date(Date.now() - 3 * 3600000) },
        { status: 'In Queue', description: 'Vehicle checked in.', updatedBy: 'Lasalgaon Yard Entry', timestamp: new Date(Date.now() - 2 * 3600000) },
        { status: 'Quality Check', description: 'Moisture 10.5%, Grade A verified.', updatedBy: 'Inspecting Officer Kulkarni', timestamp: new Date(Date.now() - 1 * 3600000) },
        { status: 'Weighing', description: 'Gross weighing underway.', updatedBy: 'Weighbridge 1', timestamp: new Date() }
      ]
    });

    console.log('Created Sample Orders with full status progression.');

    // 4. Create Ledger Transactions (Blockchain Transparency Trail)
    let prev = '0000000000000000000000000000000000000000000000000000000000000000';
    const tx1 = await Transaction.createLedgerBlock({
      userId: farmerUser._id,
      orderId: order1._id,
      orderNumber: order1.orderNumber,
      hubName: hubs[0].name,
      type: 'Slot Booking',
      amount: 341250,
      crop: 'Wheat',
      quantityQuintals: 150,
      status: 'Confirmed',
      referenceNumber: 'TXN-SLOT-889101'
    });

    const tx2 = await Transaction.createLedgerBlock({
      userId: farmerUser._id,
      orderId: order1._id,
      orderNumber: order1.orderNumber,
      hubName: hubs[0].name,
      type: 'Quality Verification',
      amount: 341250,
      crop: 'Wheat',
      quantityQuintals: 150,
      status: 'Completed',
      referenceNumber: 'TXN-QC-889102'
    });

    const tx3 = await Transaction.createLedgerBlock({
      userId: farmerUser._id,
      orderId: order1._id,
      orderNumber: order1.orderNumber,
      hubName: hubs[0].name,
      type: 'Weighment Completed',
      amount: 337838,
      crop: 'Wheat',
      quantityQuintals: 148.5,
      status: 'Completed',
      referenceNumber: 'TXN-WEIGH-889103'
    });

    const tx4 = await Transaction.createLedgerBlock({
      userId: farmerUser._id,
      orderId: order1._id,
      orderNumber: order1.orderNumber,
      hubName: hubs[0].name,
      type: 'Direct Bank Transfer',
      amount: 337838,
      crop: 'Wheat',
      quantityQuintals: 148.5,
      status: 'Completed',
      referenceNumber: 'DBT-SBI-994821094'
    });

    console.log('Created Transparency Ledger cryptographic entries.');

    // 5. Create Procurement Demands
    await ProcurementDemand.create([
      {
        title: 'National Wheat Procurement Drive 2026-27 (MSP ₹2,275/q)',
        cropName: 'Wheat',
        season: 'Rabi 2026-27',
        targetQuantityQuintals: 250000,
        procuredQuantityQuintals: 84200,
        mspPrice: 2275,
        hubId: hubs[0]._id,
        state: 'Punjab',
        validUntil: new Date(Date.now() + 60 * 86400000),
        status: 'Active',
        guidelines: 'Direct procurement at Minimum Support Price for FAQ grade wheat. Instant DBT disbursement within 48 hours.',
        createdBy: govUser._id
      },
      {
        title: 'Mustard Seed Strategic Buffer Procurement (MSP ₹5,650/q)',
        cropName: 'Mustard',
        season: 'Rabi 2026-27',
        targetQuantityQuintals: 100000,
        procuredQuantityQuintals: 41300,
        mspPrice: 5650,
        hubId: hubs[1]._id,
        state: 'Haryana',
        validUntil: new Date(Date.now() + 45 * 86400000),
        status: 'Active',
        guidelines: 'Moisture limit maximum 8.0%. Direct benefit transfer to farmer Aadhaar-linked accounts.',
        createdBy: govUser._id
      },
      {
        title: 'High-Protein Yellow Soybean Procurement (MSP ₹4,600/q)',
        cropName: 'Soybean',
        season: 'Kharif Residual 2026',
        targetQuantityQuintals: 120000,
        procuredQuantityQuintals: 65200,
        mspPrice: 4600,
        hubId: hubs[2]._id,
        state: 'Madhya Pradesh',
        validUntil: new Date(Date.now() + 30 * 86400000),
        status: 'Active',
        guidelines: 'Clean and sorted soybean with foreign matter under 1.5%.',
        createdBy: govUser._id
      }
    ]);
    console.log('Created Procurement Demands.');

    // 6. Create Community Posts
    await CommunityPost.create([
      {
        authorId: govUser._id,
        authorName: 'Vikramaditya Verma (Procurement Nodal)',
        authorRole: 'government',
        title: 'Official Advisory: Moisture Standards for Rabi Wheat Procurement 2026',
        content: 'Farmers are requested to ensure wheat moisture is dried below 12.0% before bringing produce to the hub. Moisture testing at the gate takes under 3 minutes using digital meters. Produce within FAQ limits qualifies for 100% full MSP payment on the same day.',
        category: 'Crop Advisory',
        tags: ['Wheat', 'Advisory', 'FAQ-Standards', 'MSP'],
        likes: [farmerUser._id, farmerUser2._id],
        comments: [
          {
            authorId: farmerUser._id,
            authorName: 'Gurdeep Singh Dhillon',
            authorRole: 'farmer',
            content: 'Thank you officer. We dried our crop on the concrete yard for 2 days, moisture came to 11.2% and passed smoothly this morning!',
            createdAt: new Date(Date.now() - 3600000)
          }
        ]
      },
      {
        authorId: farmerUser._id,
        authorName: 'Gurdeep Singh Dhillon',
        authorRole: 'farmer',
        title: 'Smooth experience with Slot Booking at Ludhiana Central Hub',
        content: 'Previously we had to stand in line with trolleys for 3 days on the GT Road. Today with Harvest2Hub, booked slot for 8 AM, entered with token Q-04, weighing completed by 10 AM, and payment receipt generated immediately. Highly recommend everyone to book slots 24h prior!',
        category: 'Hub Feedback',
        tags: ['SlotBooking', 'LudhianaHub', 'FastService'],
        likes: [farmerUser2._id, adminUser._id],
        comments: [
          {
            authorId: farmerUser2._id,
            authorName: 'Rajesh Ramrao Deshmukh',
            authorRole: 'farmer',
            content: 'Same here in Maharashtra at Lasalgaon! The slot time eliminated all the middlemen congestion.',
            createdAt: new Date(Date.now() - 1800000)
          }
        ]
      },
      {
        authorId: farmerUser2._id,
        authorName: 'Rajesh Ramrao Deshmukh',
        authorRole: 'farmer',
        title: 'Query regarding Soybean variety JS 335 MSP procurement eligibility',
        content: 'Is JS 335 certified under the current MSP round for Nashik APMC? Also what are the deduction slabs if moisture is between 10.5% and 11%?',
        category: 'MSP Query',
        tags: ['Soybean', 'MSP', 'Nashik'],
        likes: [farmerUser._id],
        comments: [
          {
            authorId: govUser._id,
            authorName: 'Vikramaditya Verma (Procurement Nodal)',
            authorRole: 'government',
            content: 'Yes Rajesh ji, JS 335 is completely eligible at full MSP ₹4,600/q. Moisture up to 11% has zero price deduction under the relaxed FAQ notification.',
            createdAt: new Date(Date.now() - 900000)
          }
        ]
      }
    ]);
    console.log('Created Community Posts & Comments.');

    // 7. Create Chat / Enquiry Threads
    await ChatThread.create([
      {
        farmerId: farmerUser._id,
        farmerName: 'Gurdeep Singh Dhillon',
        govId: govUser._id,
        govName: 'Vikramaditya Verma (Procurement Nodal)',
        subject: 'Inquiry regarding DBT payment reference for Order H2H-2026-001',
        category: 'Payments',
        status: 'Resolved',
        lastMessage: 'Payment has been credited to your SBI account. Bank UTR: DBT-SBI-994821094.',
        lastMessageAt: new Date(),
        messages: [
          {
            senderId: farmerUser._id,
            senderName: 'Gurdeep Singh Dhillon',
            senderRole: 'farmer',
            text: 'Respected officer, our 148.5 quintal wheat weighment was finished at 10 AM. When can we expect the bank SMS for the DBT transfer?',
            timestamp: new Date(Date.now() - 7200000)
          },
          {
            senderId: govUser._id,
            senderName: 'Vikramaditya Verma (Procurement Nodal)',
            senderRole: 'government',
            text: 'Namaste Gurdeep ji! The PFMS gateway has successfully disbursed ₹3,37,838 directly to your SBI Ludhiana account. Bank UTR is DBT-SBI-994821094. You can also view the digital receipt under Transaction Logs.',
            timestamp: new Date(Date.now() - 3600000)
          },
          {
            senderId: farmerUser._id,
            senderName: 'Gurdeep Singh Dhillon',
            senderRole: 'farmer',
            text: 'Received the bank SMS just now! Thank you for the swift support.',
            timestamp: new Date(Date.now() - 1800000)
          }
        ]
      },
      {
        farmerId: farmerUser2._id,
        farmerName: 'Rajesh Ramrao Deshmukh',
        govId: govUser._id,
        govName: 'Procurement Helpdesk',
        subject: 'Logistics query regarding tractor trolley parking at Nashik Hub',
        category: 'Logistics',
        status: 'In Progress',
        lastMessage: 'Designated parking lane C is available for all slot holders.',
        lastMessageAt: new Date(Date.now() - 1200000),
        messages: [
          {
            senderId: farmerUser2._id,
            senderName: 'Rajesh Ramrao Deshmukh',
            senderRole: 'farmer',
            text: 'Sir, we have two 40-quintal trolleys arriving together. Can they enter through Gate 2?',
            timestamp: new Date(Date.now() - 3600000)
          },
          {
            senderId: govUser._id,
            senderName: 'Procurement Helpdesk',
            senderRole: 'government',
            text: 'Yes Rajesh ji, please present both QR codes at Gate 2 and proceed to designated parking lane C.',
            timestamp: new Date(Date.now() - 1200000)
          }
        ]
      }
    ]);

    console.log('Created Enquiry / Chat threads.');
    console.log('\n=============================================');
    console.log(' SEEDING COMPLETE FOR HARVEST2HUB (SIH 26032)');
    console.log(' Demo Accounts:');
    console.log(' Farmer:     farmer@harvest2hub.gov.in / password123');
    console.log(' Government: gov@harvest2hub.gov.in    / password123');
    console.log(' Admin:      admin@harvest2hub.gov.in  / password123');
    console.log(' Test OTP:   123456');
    console.log('=============================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedDatabase();

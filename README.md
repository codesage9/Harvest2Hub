# 🌱 Krishi-Setu — Smart Agriculture Procurement & Slot Scheduling Platform
> **Smart India Hackathon (SIH) • Problem Statement ID: 26032**  
> *Theme: Agriculture, FoodTech & Rural Development*  
> *Organization / Ministry: Ministry of Agriculture & Farmers Welfare / Food Corporation of India (FCI)*

---

## 📌 Problem Statement Overview (SIH 26032)
During national crop harvesting seasons, Indian agricultural mandis and procurement hubs face critical challenges:
1. **Severe Traffic & Queuing Bottlenecks**: Thousands of tractor-trolleys arrive unannounced on the same day, causing 3-5 day highway congestions, grain spoilage in open air, and exorbitant idling costs for farmers.
2. **Arbitrary Quality Cuts**: Subjective manual testing by middlemen often leads to unjustified grade downgrades and deductions.
3. **Delayed Settlements**: Payments take weeks to trickle through commission agents (arhtiyas).
4. **Lack of Verifiable Audit Trails**: Susceptibility to phantom grain entries and procurement ledger tampering.

---

## 💡 Krishi-Setu Solution Architecture
**Krishi-Setu** is an end-to-end full-stack digital procurement and slot scheduling engine that transforms traditional mandi operations into a streamlined, automated, and tamper-proof workflow:

1. **Intelligent Capacity-Aware Slot Scheduling**:
   - Farmers select their nearest APMC hub, crop variety, quantity, and time window.
   - The backend checks real-time silo/hub intake capacity to prevent overcrowding.
   - Generates an instant digital Gate Token (e.g. `Q-04`) and printable entry pass.
2. **6-Stage Order Lifecycle Tracking**:
   - `Slot Booked` ➔ `In Queue` ➔ `Quality Check` ➔ `Weighing` ➔ `Payment Processing` ➔ `Completed & In Ledger`
   - Real-time progress bar with timestamped audit trail.
3. **Scientific Quality Grading (FAQ Norms)**:
   - Digital recording of moisture percentage and foreign matter.
   - Automatic classification into Grade A (FAQ), Grade B, or Grade C.
4. **Digital Weighbridge Integration**:
   - Automated recording of gross loaded weight and tare empty vehicle weight.
   - Automatic calculation of net grain quintals and total MSP payout.
5. **Direct Benefit Transfer (DBT) Integration**:
   - Direct disbursement to the farmer's Aadhaar-linked bank account (PFMS mock integration).
6. **SHA-256 Cryptographic Transparency Ledger**:
   - Every transaction (booking, quality inspection, weighment, payment) creates a cryptographically linked block with previous hash chaining, ensuring mathematical immunity against corruption.
7. **12 Indian Languages & RTL Support**:
   - Full multilingual accessibility: English, Hindi (हिन्दी), Punjabi (ਪੰਜਾਬੀ), Marathi (मराठी), Bengali (বাংলা), Tamil (தமிழ்), Telugu (తెలుగు), Gujarati (ગુજરાતી), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Odia (ଓଡ଼ିଆ), and Urdu (اردو with Right-to-Left RTL).
8. **Community Forum & Direct Helpdesk**:
   - Farmer-to-Government inquiry chat threads and shared agricultural discussion board.

---

## 🔑 Pre-Seeded Evaluator Accounts (Instant Login)

| Role | Email | Password | Pre-loaded Data |
|---|---|---|---|
| **🌾 Farmer** | `farmer@harvest2hub.gov.in` | `password123` | Active wheat & mustard slot bookings, gate tokens, DBT bank account |
| **🏛️ Gov Official** | `gov@harvest2hub.gov.in` | `password123` | APMC Hub operations, quality inspection controls, weighbridge entry, DBT releases |
| **⚡ Admin** | `admin@harvest2hub.gov.in` | `password123` | Full system audit, hub management, ledger explorer |
| **📱 Test OTP** | *Any mobile* | `123456` | One-click bypass for registration testing |

---

## 🛠️ Technology Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, `react-i18next`, `i18next`, `react-router-dom`, `axios`
- **Backend**: Node.js, Express.js, JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `crypto` (SHA-256)
- **Database**: MongoDB with Mongoose ODM
- **Security & Integrity**: JWT authentication, role guards (`farmer`, `government`, `admin`), SHA-256 cryptographic chaining

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v22.19.0)
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017`

### 2. Backend Setup
```bash
cd Backend
npm install
npm run seed       # Populates realistic Indian APMC hubs, orders, and ledger
npm start          # Starts server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd Frontend
npm install
npm run dev        # Starts Vite dev server on http://localhost:5173
```

### 4. Access the Application
Open your browser at **`http://localhost:5173`**
Use the top-bar **"Quick Demo Role"** buttons (`🌾 Farmer` / `🏛️ Gov Officer`) or click **Explore Transparency Ledger** for instant demonstration during hackathon presentation!

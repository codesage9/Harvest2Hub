import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { 
  Sprout, 
  Calendar, 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  Sparkles, 
  Banknote, 
  Users, 
  ArrowRight, 
  Award,
  Globe,
  Clock,
  TrendingUp,
  Building2,
  Lock
} from 'lucide-react';

export const LandingPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemo = async (role) => {
    if (role === 'farmer') {
      await login('farmer@harvest2hub.gov.in', 'password123');
      navigate('/farmer/dashboard');
    } else {
      await login('gov@harvest2hub.gov.in', 'password123');
      navigate('/gov/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-stone-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#081C15] via-[#1B4D3E] to-[#2D6A4F] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* SIH 26032 Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold mb-6 shadow-inner">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Smart India Hackathon • Problem Statement ID: 26032</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-['Manrope',sans-serif] leading-tight">
                Farm-to-Hub <span className="text-emerald-300">Slot Scheduling</span> & Transparent Procurement.
              </h1>
              <p className="text-lg text-stone-200 max-w-2xl font-normal leading-relaxed">
                Eliminating chaotic mandi congestion, middlemen exploitation, and manual delays through intelligent slot booking, automated quality grading, digital weighbridge integration, and instant Direct Benefit Transfer (DBT).
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/register"
                  className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm shadow-lg shadow-emerald-900/40 transition flex items-center gap-2"
                >
                  <Sprout className="w-4 h-4" />
                  Register as Farmer / Hub
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/ledger"
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm backdrop-blur transition flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  Explore Transparency Ledger
                </Link>
              </div>

              {/* One-Click Evaluation Box for Judges */}
              <div className="mt-8 p-4 bg-emerald-950/70 border border-emerald-500/30 rounded-2xl max-w-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    SIH Evaluator Quick Access
                  </span>
                  <span className="text-[11px] text-stone-300">Pre-seeded demo accounts</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleQuickDemo('farmer')}
                    className="p-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-left border border-emerald-700/50 transition group"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-emerald-200">🌾 Farmer Portal</div>
                    <div className="text-[11px] text-emerald-300/80">Gurdeep Singh Dhillon</div>
                  </button>
                  <button
                    onClick={() => handleQuickDemo('gov')}
                    className="p-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-900 text-left border border-blue-700/50 transition group"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-blue-200">🏛️ Procurement Desk</div>
                    <div className="text-[11px] text-blue-300/80">Vikramaditya Verma (IAS)</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Card: Real-time Simulation / Status Widget */}
            <div className="lg:col-span-5">
              <div className="bg-white/95 text-stone-800 rounded-3xl p-6 shadow-2xl border border-white/30 backdrop-blur">
                <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-bold text-sm text-[#1B4D3E]">Live Hub Operations</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Ludhiana Hub
                  </span>
                </div>

                <div className="space-y-4 py-4">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-stone-500">Today's Procurement Intake:</span>
                      <span className="font-bold text-stone-800">4,280 / 6,500 Quintals</span>
                    </div>
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1B4D3E] rounded-full" style={{ width: '66%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-xs p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold text-stone-800">Q-04 (PB-10-DF-4421):</span>
                        <span className="text-stone-600 ml-1">Paid ₹3,37,838 via DBT</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs p-2.5 bg-blue-50/60 rounded-lg border border-blue-100">
                      <Scale className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <span className="font-bold text-stone-800">Q-07 (MH-15-AB-7711):</span>
                        <span className="text-stone-600 ml-1">Weighing at Platform #2</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs p-2.5 bg-amber-50/60 rounded-lg border border-amber-100">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <span className="font-bold text-stone-800">Q-11 (PB-10-AZ-8921):</span>
                        <span className="text-stone-600 ml-1">Testing Moisture: 7.8% (FAQ Passed)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" /> Avg Gate Turnaround: 22 Mins
                  </span>
                  <span className="text-emerald-700 font-bold">Zero Congestion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Workflow: 6-Stage Problem Statement Resolution */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            End-to-End Pipeline
          </span>
          <h2 className="text-3xl font-extrabold text-[#1B4D3E] font-['Manrope',sans-serif] mt-3">
            How Harvest2Hub Solves Problem Statement 26032
          </h2>
          <p className="text-stone-600 text-sm mt-3 leading-relaxed">
            Every step is digitized and connected via tamper-proof audit trails, ensuring fair prices for farmers and automated logistics for government food corporations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2 font-['Manrope',sans-serif]">
              Decentralized Slot Booking
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Farmers select their nearby hub, crop type, quantity, and date. The engine dynamically checks daily silo capacities to avoid crowding on highways.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2 font-['Manrope',sans-serif]">
              Digital Gate Pass & QR Token
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Generates an automated token (e.g. Q-04) with vehicle verification. Tractors enter through fast-track RFID/QR gates without manual gatekeeper delays.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2 font-['Manrope',sans-serif]">
              Scientific Quality Grading (FAQ)
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Immediate moisture testing and foreign matter classification based on Fair Average Quality norms. Results are recorded instantly to eliminate arbitrary cuts.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg mb-4">
              4
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2 font-['Manrope',sans-serif]">
              Digital Weighbridge Sync
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Automated capture of gross weight and tare weight on digital weighbridges, calculating exact net grain yield to the decimal.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg mb-4">
              5
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2 font-['Manrope',sans-serif]">
              Direct Benefit Transfer (DBT)
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Direct integration with PFMS/Aadhaar-linked bank accounts. Full MSP payout is released without commission agents or middlemen cuts.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg mb-4">
              6
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2 font-['Manrope',sans-serif]">
              SHA-256 Transparency Ledger
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every procurement block is hashed cryptographically. Any tampering with weights, grades, or payments is mathematically detectable.
            </p>
          </div>
        </div>
      </section>

      {/* Multilingual & Inclusivity Showcase */}
      <section className="py-16 bg-stone-100 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                12 Indian Languages & RTL
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4D3E] font-['Manrope',sans-serif]">
                Accessible to Every Indian Farmer
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Built strictly adhering to the SIH prompt requirements: Complete localized experiences in English, Hindi, Punjabi (ਪੰਜਾਬੀ), Marathi (मराठी), Bengali (বাংলা), Tamil (தமிழ்), Telugu (తెలుగు), Gujarati (ગુજરાતી), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Odia (ଓଡ଼ିଆ), and Urdu (اردو with right-to-left RTL layout).
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['English', 'हिन्दी', 'ਪੰਜਾਬੀ', 'मराठी', 'বাংলা', 'தமிழ்', 'తెలుగు', 'ગુજરાતી', 'ಕನ್ನಡ', 'മലയാളം', 'ଓଡ଼ିଆ', 'اردو'].map(l => (
                  <span key={l} className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-700 shadow-sm">
                    {l}
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-bold text-stone-800 text-sm">Instant Language Switch</h4>
                </div>
                <p className="text-xs text-stone-500">
                  Select your preferred regional language from the top navbar. Your preference is automatically stored in your profile and synchronized across all devices.
                </p>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium">
                  "ਸਾਡੀ ਫਸਲ, ਸਾਡਾ ਹੱਕ — ਮੰਡੀ ਵਿੱਚ ਸਿੱਧੀ ਖਰੀਦ ਅਤੇ 48 ਘੰਟਿਆਂ ਵਿੱਚ ਪੈਸੇ ਸਿੱਧੇ ਖਾਤੇ ਵਿੱਚ!"
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4D3E] font-['Manrope',sans-serif]">
            Frequently Asked Questions
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-2">
            Everything you need to know about the Harvest2Hub slot scheduling and procurement workflow.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-5 bg-white rounded-xl border border-stone-200">
            <h4 className="font-bold text-sm text-stone-900 mb-1">How does slot booking prevent mandi traffic jams?</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Hubs have strict intake limits per 2-hour window. If a time slot exceeds vehicle capacity, the system advises the farmer on alternative open slots, smoothing out arrivals across the day.
            </p>
          </div>
          <div className="p-5 bg-white rounded-xl border border-stone-200">
            <h4 className="font-bold text-sm text-stone-900 mb-1">How is the MSP payout calculated and disbursed?</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Net Weight (Gross weight minus Tare weight) is multiplied by the official government MSP rate for the crop (e.g. ₹2,275/q for Wheat). The funds are disbursed directly to the farmer's Aadhaar-linked bank account via DBT.
            </p>
          </div>
          <div className="p-5 bg-white rounded-xl border border-stone-200">
            <h4 className="font-bold text-sm text-stone-900 mb-1">What is the Blockchain Transparency Ledger?</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every status advancement creates a cryptographically signed block with SHA-256 hash linking to the prior block. It guarantees auditability for CAG, vigilance officers, and farmers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

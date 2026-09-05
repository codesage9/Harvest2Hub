import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { 
  Sprout, 
  Building2, 
  User, 
  Phone, 
  CreditCard, 
  Mail, 
  Lock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const RegisterPage = () => {
  const { t } = useTranslation();
  const { register, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('farmer');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    aadhaar: '',
    email: '',
    password: '',
    state: 'Punjab',
    district: 'Ludhiana',
    village: '',
    landAreaAcres: 5,
    institutionName: '',
    department: '',
    accountNumber: '3049281900213',
    ifscCode: 'SBIN0001432',
    bankName: 'State Bank of India'
  });

  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('123456');
  const [mockOtpHint, setMockOtpHint] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInitiateRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Phone validation
    if (!formData.phone || formData.phone.length < 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      // Trigger Mock OTP
      const res = await sendOtp(formData.phone);
      if (res.mockOtp) {
        setMockOtpHint(res.mockOtp);
        setOtpValue(res.mockOtp); // Pre-fill for hackathon testing speed
      }
      setShowOtpModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await verifyOtp(formData.phone, otpValue);
      setOtpVerified(true);
      setShowOtpModal(false);

      // Proceed with actual registration
      const payload = {
        ...formData,
        role,
        bankDetails: {
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
          bankName: formData.bankName,
          holderName: formData.name
        }
      };

      const user = await register(payload);
      if (user.role === 'farmer') {
        navigate('/farmer/dashboard');
      } else {
        navigate('/gov/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification or registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-stone-50">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-stone-200 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#1B4D3E] text-white flex items-center justify-center mx-auto shadow-md">
            <Sprout className="w-7 h-7 text-emerald-300" />
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 font-['Manrope',sans-serif]">
            Citizen & Officer Registration
          </h2>
          <p className="text-xs text-stone-500">
            Smart India Hackathon 26032 • National Unified Agricultural Procurement Engine
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-stone-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('farmer')}
            className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
              role === 'farmer'
                ? 'bg-[#1B4D3E] text-white shadow-md'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sprout className="w-4 h-4" />
            Farmer / Cultivator
          </button>
          <button
            type="button"
            onClick={() => setRole('government')}
            className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
              role === 'government'
                ? 'bg-blue-800 text-white shadow-md'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Government / APMC Hub
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleInitiateRegister} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={role === 'farmer' ? 'e.g. Ramesh Kumar' : 'e.g. Officer Name'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Mobile Number (For OTP Verification)
              </label>
              <input
                type="tel"
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Aadhaar Number (UIDAI)
              </label>
              <input
                type="text"
                required
                name="aadhaar"
                value={formData.aadhaar}
                onChange={handleChange}
                placeholder="XXXX-XXXX-XXXX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@domain.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Create Password
            </label>
            <input
              type="password"
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]"
            />
          </div>

          {/* Role specific section */}
          {role === 'farmer' ? (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                Agricultural Land & Banking Details (For Instant DBT)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-medium text-stone-700">Land Area (Acres)</label>
                  <input
                    type="number"
                    name="landAreaAcres"
                    value={formData.landAreaAcres}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-700">Bank Account No.</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-700">IFSC Code</label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-700" />
                Government Institution & Procurement Department
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-medium text-stone-700">Institution Name</label>
                  <input
                    type="text"
                    name="institutionName"
                    value={formData.institutionName}
                    onChange={handleChange}
                    placeholder="e.g. Food Corporation of India / State APMC"
                    className="w-full mt-1 p-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-700">Designation / Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Grain Procurement Inspector"
                    className="w-full mt-1 p-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#1B4D3E] hover:bg-[#2D6A4F] text-white text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Verify Mobile with OTP & Register
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-stone-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-[#1B4D3E] hover:underline">
            Sign In here
          </Link>
        </div>
      </div>

      {/* Mock OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-stone-200">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 font-['Manrope',sans-serif]">
                Aadhaar / Mobile OTP Verification
              </h3>
              <p className="text-xs text-stone-500">
                A 6-digit verification code was dispatched to <b>+91 {formData.phone}</b>
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
              <span className="text-[11px] text-amber-800 font-semibold">
                SIH Mock OTP Service Code: <span className="font-mono font-bold text-sm text-stone-900">{mockOtpHint || '123456'}</span>
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Enter 6-digit OTP</label>
              <input
                type="text"
                maxLength={6}
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                className="w-full text-center tracking-widest font-mono text-xl py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="w-1/2 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleVerifyAndSubmit}
                disabled={loading}
                className="w-1/2 py-2.5 rounded-xl bg-[#1B4D3E] hover:bg-[#2D6A4F] text-xs font-bold text-white flex items-center justify-center gap-1 shadow-md"
              >
                {loading ? 'Verifying...' : 'Verify & Complete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

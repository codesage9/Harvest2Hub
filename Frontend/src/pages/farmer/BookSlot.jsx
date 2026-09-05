import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Truck, 
  Sprout, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  Scale,
  ArrowRight
} from 'lucide-react';

export const BookSlot = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [hubs, setHubs] = useState([]);
  const [selectedHub, setSelectedHub] = useState('');
  const [cropName, setCropName] = useState('Wheat');
  const [variety, setVariety] = useState('Sharbati Grade A');
  const [quantity, setQuantity] = useState(100);
  const [vehicleType, setVehicleType] = useState('Tractor-Trolley');
  const [vehicleNumber, setVehicleNumber] = useState('PB-10-AZ-5521');
  
  // Default tomorrow's date YYYY-MM-DD
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [bookingDate, setBookingDate] = useState(tomorrow);
  const [timeSlot, setTimeSlot] = useState('08:00 AM - 10:00 AM');

  // Hub Availability data
  const [availability, setAvailability] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Modal & Status
  const [bookingResult, setBookingResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch active hubs
  useEffect(() => {
    const fetchHubs = async () => {
      try {
        const res = await axios.get('/api/hubs');
        setHubs(res.data);
        if (res.data.length > 0) {
          setSelectedHub(res.data[0]._id);
        }
      } catch (err) {
        console.error('Error fetching hubs:', err);
      }
    };
    fetchHubs();
  }, []);

  // 2. Fetch hub capacity when hub or date changes
  useEffect(() => {
    const checkCap = async () => {
      if (!selectedHub || !bookingDate) return;
      setCheckingAvailability(true);
      try {
        const res = await axios.get(`/api/hubs/${selectedHub}/availability?date=${bookingDate}`);
        setAvailability(res.data);
      } catch (err) {
        console.error('Error checking availability:', err);
      } finally {
        setCheckingAvailability(false);
      }
    };
    checkCap();
  }, [selectedHub, bookingDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await axios.post('/api/slots/book', {
        hubId: selectedHub,
        cropName,
        variety,
        estimatedQuantityQuintals: Number(quantity),
        vehicleType,
        vehicleNumber,
        bookingDate,
        timeSlot
      });

      if (res.data.success) {
        setBookingResult(res.data.booking);
        setShowModal(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book procurement slot. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedHubObj = hubs.find(h => h._id === selectedHub);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" /> APMC Smart Scheduling
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B4D3E] font-['Manrope',sans-serif]">
          {t('booking.title')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          {t('booking.subtitle')}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Booking Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Step 1: Hub & Date Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {t('booking.select_hub')}
            </label>
            <select
              value={selectedHub}
              onChange={(e) => setSelectedHub(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none bg-white font-medium"
            >
              {hubs.map((hub) => (
                <option key={hub._id} value={hub._id}>
                  {hub.name} ({hub.district}, {hub.state})
                </option>
              ))}
            </select>
            {selectedHubObj && (
              <p className="text-[11px] text-stone-500 mt-1">
                Operating Hours: {selectedHubObj.operatingHours?.start} - {selectedHubObj.operatingHours?.end}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              {t('booking.booking_date')}
            </label>
            <input
              type="date"
              required
              value={bookingDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none bg-white"
            />
          </div>
        </div>

        {/* Live Hub Capacity & Time Slot Widget */}
        {availability && (
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-700" />
                {t('booking.capacity_status')} on {bookingDate}
              </span>
              <span className="text-xs font-bold text-emerald-800">
                {availability.remainingCapacityQuintals} Qtl Remaining
              </span>
            </div>

            <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  availability.utilizationPercentage > 85 ? 'bg-red-500' : 'bg-emerald-600'
                }`}
                style={{ width: `${availability.utilizationPercentage}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-[11px] text-stone-500">
              <span>Booked: {availability.bookedQuintals} Qtl</span>
              <span>Daily Capacity: {availability.dailyCapacityQuintals} Qtl ({availability.utilizationPercentage}% filled)</span>
            </div>
          </div>
        )}

        {/* Step 2: Time Slot Selector */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            {t('booking.time_slot')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              '08:00 AM - 10:00 AM',
              '10:00 AM - 12:00 PM',
              '12:00 PM - 02:00 PM',
              '02:00 PM - 04:00 PM',
              '04:00 PM - 06:00 PM'
            ].map((slot) => {
              const isSelected = timeSlot === slot;
              return (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setTimeSlot(slot)}
                  className={`p-3 rounded-xl border text-xs font-bold transition text-center ${
                    isSelected
                      ? 'bg-[#1B4D3E] text-white border-[#1B4D3E] shadow-sm'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-emerald-300'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Crop Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              {t('booking.crop_name')}
            </label>
            <select
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none bg-white"
            >
              <option value="Wheat">Wheat (MSP ₹2,275/q)</option>
              <option value="Mustard">Mustard (MSP ₹5,650/q)</option>
              <option value="Soybean">Soybean (MSP ₹4,600/q)</option>
              <option value="Paddy (Grade A)">Paddy Grade A (MSP ₹2,203/q)</option>
              <option value="Gram (Chana)">Gram / Chana (MSP ₹5,440/q)</option>
              <option value="Maize">Maize (MSP ₹2,090/q)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              {t('booking.variety')}
            </label>
            <input
              type="text"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              placeholder="e.g. Sharbati / PBW 343"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              {t('booking.quantity')}
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
            />
          </div>
        </div>

        {/* Step 4: Transport Vehicle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              {t('booking.vehicle_type')}
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none bg-white"
            >
              <option value="Tractor-Trolley">Tractor-Trolley</option>
              <option value="Small Truck">Small Truck (Tata Ace / 407)</option>
              <option value="Heavy Truck">Heavy Truck (10+ Wheeler)</option>
              <option value="Bullock Cart">Bullock Cart / Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              {t('booking.vehicle_number')}
            </label>
            <input
              type="text"
              required
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="e.g. PB-10-AZ-1234"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 px-6 rounded-2xl bg-[#1B4D3E] hover:bg-[#2D6A4F] text-white text-sm font-bold shadow-lg shadow-emerald-950/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {submitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              {t('booking.submit_button')}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Booking Confirmation Modal */}
      {showModal && bookingResult && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl border border-stone-200">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-stone-900 font-['Manrope',sans-serif]">
                {t('booking.modal_title')}
              </h3>
              <p className="text-xs text-stone-500">
                Order Ref: <span className="font-mono font-bold text-stone-800">{bookingResult.orderNumber}</span>
              </p>
            </div>

            {/* Token Highlight */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-1">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                {t('booking.modal_token')}
              </span>
              <div className="font-mono text-3xl font-extrabold text-[#1B4D3E]">
                {bookingResult.queueToken}
              </div>
              <p className="text-[11px] text-emerald-700">
                {bookingResult.bookingDate} • {bookingResult.timeSlot}
              </p>
            </div>

            {/* Summary Details */}
            <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-1.5 text-stone-700 border border-stone-200">
              <div className="flex justify-between">
                <span className="text-stone-500">Crop & Variety:</span>
                <span className="font-bold text-stone-800">{bookingResult.cropName} ({bookingResult.variety})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Quantity:</span>
                <span className="font-bold text-stone-800">{bookingResult.estimatedQuantityQuintals} Quintals</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Vehicle:</span>
                <span className="font-bold text-stone-800">{bookingResult.vehicleNumber}</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-500 leading-relaxed text-center">
              {t('booking.modal_note')}
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  navigate('/farmer/track-order');
                }}
                className="w-full py-3 rounded-xl bg-[#1B4D3E] hover:bg-[#2D6A4F] text-white text-xs font-bold transition shadow-md flex items-center justify-center gap-2"
              >
                Go to Live Order Tracker
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

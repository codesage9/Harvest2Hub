import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  Sprout, 
  Calendar, 
  Clock, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Banknote, 
  ArrowRight, 
  Bell, 
  Activity,
  QrCode,
  ShieldCheck
} from 'lucide-react';

export const FarmerDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmerData = async () => {
      if (!user) return;
      try {
        const res = await axios.get(`/api/slots/${user._id || user.id}`);
        setSlots(res.data);
      } catch (err) {
        console.error('Error fetching farmer slots:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmerData();
  }, [user]);

  // Aggregate stats
  const activeBookings = slots.filter(s => s.status !== 'Completed' && s.status !== 'Cancelled');
  const completedOrders = slots.filter(s => s.status === 'Completed');
  const totalEarned = completedOrders.reduce((sum, s) => sum + (s.totalAmountPayable || 0), 0);
  const totalGrainDeliveredQuintals = completedOrders.reduce((sum, s) => sum + (s.netWeightQuintals || s.estimatedQuantityQuintals || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Header */}
      <div className="bg-gradient-to-r from-[#1B4D3E] to-[#2D6A4F] text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold">
            <Sprout className="w-3.5 h-3.5" /> Registered Kisan Member
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Manrope',sans-serif]">
            {t('dashboard.welcome_back')}, {user?.name || 'Kisan Brother'}!
          </h1>
          <p className="text-xs sm:text-sm text-stone-200 max-w-2xl">
            {t('dashboard.farmer_subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/farmer/book-slot"
            className="px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            {t('dashboard.quick_book')}
          </Link>
          <Link
            to="/farmer/track-order"
            className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs sm:text-sm transition flex items-center gap-2"
          >
            <Activity className="w-4 h-4 text-emerald-300" />
            {t('dashboard.track_live')}
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">{t('dashboard.active_slots')}</p>
            <h3 className="text-2xl font-bold text-stone-900">{activeBookings.length}</h3>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">{t('dashboard.total_earnings')}</p>
            <h3 className="text-2xl font-bold text-stone-900">₹{totalEarned.toLocaleString('en-IN')}</h3>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">{t('dashboard.grain_procured')}</p>
            <h3 className="text-2xl font-bold text-stone-900">{totalGrainDeliveredQuintals} Qtl</h3>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Aadhaar DBT Status</p>
            <h3 className="text-base font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Verified
            </h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Slot Statuses & Notification Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Scheduled Slots Summary */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-stone-900 font-['Manrope',sans-serif]">
              {t('dashboard.recent_orders')}
            </h3>
            <Link to="/farmer/track-order" className="text-xs font-bold text-[#1B4D3E] hover:underline flex items-center gap-1">
              Track Detailed Flow <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-sm text-stone-500">
              Loading scheduled slots...
            </div>
          ) : slots.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 space-y-3">
              <p className="text-sm text-stone-500">No procurement slots booked yet.</p>
              <Link
                to="/farmer/book-slot"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B4D3E] text-white text-xs font-bold rounded-xl"
              >
                Schedule First Slot
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {slots.map((s) => {
                const isCompleted = s.status === 'Completed';
                return (
                  <div
                    key={s._id}
                    className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm hover:border-emerald-300 transition space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-stone-500">{s.orderNumber}</span>
                        <span className="text-xs font-bold text-stone-900 bg-stone-100 px-2.5 py-0.5 rounded-full">
                          {s.cropName} ({s.estimatedQuantityQuintals} Qtl)
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.status === 'Quality Check' || s.status === 'Weighing'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-stone-600 pt-1">
                      <div>
                        <span className="text-stone-400">Hub: </span>
                        <span className="font-semibold text-stone-800">{s.hubId?.name || 'Central Hub'}</span>
                      </div>
                      <div>
                        <span className="text-stone-400">Date: </span>
                        <span className="font-semibold text-stone-800">{s.bookingDate}</span>
                      </div>
                      <div>
                        <span className="text-stone-400">Time Window: </span>
                        <span className="font-semibold text-stone-800">{s.timeSlot}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-stone-100 font-mono font-bold text-stone-700 rounded text-[11px]">
                          Token: {s.queueToken || 'Q-XX'}
                        </span>
                        {s.vehicleNumber && (
                          <span className="text-stone-500 text-[11px]">Vehicle: {s.vehicleNumber}</span>
                        )}
                      </div>
                      <Link
                        to="/farmer/track-order"
                        className="font-bold text-[#1B4D3E] hover:underline flex items-center gap-1 text-xs"
                      >
                        {t('dashboard.view_timeline')} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Notifications & Crop Advisories */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-lg font-bold text-stone-900 font-['Manrope',sans-serif] flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600" />
            {t('dashboard.recent_notifications')}
          </h3>

          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs space-y-1">
              <div className="flex items-center justify-between text-emerald-900 font-bold">
                <span>MSP Procurement Active</span>
                <span className="text-[10px] text-emerald-700">Rabi 2026</span>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                Wheat MSP fixed at ₹2,275/Quintal with instant DBT payment released directly into Aadhaar verified accounts.
              </p>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs space-y-1">
              <div className="flex items-center justify-between text-blue-900 font-bold">
                <span>Moisture Advisory</span>
                <span className="text-[10px] text-blue-700">FAQ Norm</span>
              </div>
              <p className="text-blue-800 leading-relaxed">
                Ensure produce is sun-dried below 12.0% moisture before bringing it to the APMC hub to avoid grade deductions.
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs space-y-1">
              <div className="flex items-center justify-between text-amber-900 font-bold">
                <span>Gate Pass Protocol</span>
                <span className="text-[10px] text-amber-700">Notice</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                Present your digital QR Token or SMS at Hub Gate 1 for direct fast-track weighbridge entry.
              </p>
            </div>

            <Link
              to="/community"
              className="block text-center py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-[#1B4D3E] hover:bg-stone-50 transition"
            >
              Open Kisan Community Board
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

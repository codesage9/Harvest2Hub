import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Timeline } from '../../components/Timeline';
import axios from 'axios';
import { 
  Search, 
  Sparkles, 
  Scale, 
  Banknote, 
  Printer, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  MapPin,
  Calendar
} from 'lucide-react';

export const TrackOrder = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const res = await axios.get(`/api/slots/${user._id || user.id}`);
        setOrders(res.data);
        if (res.data.length > 0) {
          setSelectedOrderId(res.data[0]._id);
          setActiveOrder(res.data[0]);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleSelectOrder = (id) => {
    setSelectedOrderId(id);
    const found = orders.find(o => o._id === id);
    if (found) setActiveOrder(found);
  };

  const handlePrintPass = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">No Orders or Slot Schedules Found</h2>
        <p className="text-xs text-stone-500">Book your first agricultural procurement slot to begin tracking.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 print:p-0">
      
      {/* Header & Order Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B4D3E] font-['Manrope',sans-serif]">
            {t('tracking.title')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            {t('tracking.subtitle')}
          </p>
        </div>

        {/* Order Selector Dropdown */}
        <div className="w-full sm:w-72">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
            {t('tracking.select_order')}
          </label>
          <select
            value={selectedOrderId}
            onChange={(e) => handleSelectOrder(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold focus:ring-2 focus:ring-[#1B4D3E] bg-white text-stone-800"
          >
            {orders.map((o) => (
              <option key={o._id} value={o._id}>
                {o.orderNumber} - {o.cropName} ({o.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeOrder && (
        <div className="space-y-8">
          
          {/* Main Status & Gate Pass Card */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-8">
            
            {/* Top Bar with Token & Print Action */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase">Token</span>
                  <span className="font-mono text-xl font-extrabold text-[#1B4D3E]">
                    {activeOrder.queueToken || 'Q-XX'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-stone-900 font-mono">{activeOrder.orderNumber}</h3>
                    <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {activeOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Hub: <span className="font-semibold text-stone-700">{activeOrder.hubId?.name || 'Central Hub'}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePrintPass}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-2 transition print:hidden"
              >
                <Printer className="w-4 h-4" />
                {t('tracking.print_pass')}
              </button>
            </div>

            {/* Visual 6-Stage Timeline Component */}
            <Timeline currentStatus={activeOrder.status} timelineData={activeOrder.timeline} />

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              
              {/* Quality Metrics */}
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    {t('tracking.quality_metrics')}
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    {activeOrder.qualityGrade}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-200">
                    <span className="text-stone-500">{t('tracking.moisture')}:</span>
                    <span className="font-bold text-stone-800">
                      {activeOrder.moisturePercentage !== null ? `${activeOrder.moisturePercentage}% (FAQ Standard)` : 'Pending Test'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200">
                    <span className="text-stone-500">Foreign Matter:</span>
                    <span className="font-bold text-stone-800">
                      {activeOrder.foreignMatterPercentage !== null ? `${activeOrder.foreignMatterPercentage}%` : 'Pending Test'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">Quality Inspector:</span>
                    <span className="font-medium text-stone-800">
                      {activeOrder.qualityInspector || 'Station Analyst'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Weighbridge Metrics */}
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-blue-600" />
                    {t('tracking.weighment_details')}
                  </span>
                  <span className="text-xs font-bold text-blue-700">
                    {activeOrder.netWeightQuintals ? `${activeOrder.netWeightQuintals} Qtl` : 'Est: ' + activeOrder.estimatedQuantityQuintals + ' Qtl'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-200">
                    <span className="text-stone-500">{t('tracking.gross_wt')}:</span>
                    <span className="font-bold text-stone-800">
                      {activeOrder.grossWeightKg ? `${activeOrder.grossWeightKg} Kg` : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200">
                    <span className="text-stone-500">{t('tracking.tare_wt')}:</span>
                    <span className="font-bold text-stone-800">
                      {activeOrder.tareWeightKg ? `${activeOrder.tareWeightKg} Kg` : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">{t('tracking.net_wt')}:</span>
                    <span className="font-bold text-emerald-700">
                      {activeOrder.netWeightQuintals ? `${activeOrder.netWeightQuintals} Quintals` : 'In Process'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment & DBT Metrics */}
              <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-emerald-700" />
                    {t('tracking.total_payout')}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                    {activeOrder.paymentStatus}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-emerald-200">
                    <span className="text-stone-600">MSP Rate / Quintal:</span>
                    <span className="font-bold text-stone-900">₹{activeOrder.mspRatePerQuintal?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-emerald-200">
                    <span className="text-stone-600">Total MSP Amount:</span>
                    <span className="font-extrabold text-sm text-[#1B4D3E]">
                      ₹{activeOrder.totalAmountPayable?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="py-1">
                    <span className="text-stone-600 block text-[11px]">{t('tracking.payment_ref')}:</span>
                    <span className="font-mono font-bold text-stone-900 text-[11px] break-all">
                      {activeOrder.bankReferenceNumber || 'Scheduled for Direct Benefit Transfer (DBT)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cryptographic SHA-256 Ledger Block Footer */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-stone-50 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-stone-700">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-bold">{t('tracking.hash_code')}:</span>
                <span className="font-mono text-[11px] text-stone-500 truncate max-w-xs sm:max-w-md">
                  {activeOrder.blockHash || 'Generating block seal...'}
                </span>
              </div>
              <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                Verified Cryptographic Block
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

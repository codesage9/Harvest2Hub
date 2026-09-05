import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Timeline } from '../../components/Timeline';
import axios from 'axios';
import { 
  Layers, 
  Search, 
  Filter, 
  Sparkles, 
  Scale, 
  Banknote, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Eye,
  Sliders,
  User,
  Truck
} from 'lucide-react';

export const GovOrders = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Advance Status Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState('In Queue');
  const [qualityGrade, setQualityGrade] = useState('Grade A (FAQ)');
  const [moisture, setMoisture] = useState(11.5);
  const [foreignMatter, setForeignMatter] = useState(0.5);
  const [grossWeight, setGrossWeight] = useState(18000);
  const [tareWeight, setTareWeight] = useState(5000);
  const [bankRef, setBankRef] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders/all');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openActionModal = (order) => {
    setSelectedOrder(order);
    // Determine next logical status
    if (order.status === 'Slot Booked') setTargetStatus('In Queue');
    else if (order.status === 'In Queue') setTargetStatus('Quality Check');
    else if (order.status === 'Quality Check') setTargetStatus('Weighing');
    else if (order.status === 'Weighing') setTargetStatus('Completed');
    else setTargetStatus('Completed');

    // Pre-populate sensible defaults
    setQualityGrade(order.qualityGrade !== 'Pending' ? order.qualityGrade : 'Grade A (FAQ)');
    setMoisture(order.moisturePercentage || 11.2);
    setForeignMatter(order.foreignMatterPercentage || 0.4);
    setGrossWeight(order.grossWeightKg || 18500);
    setTareWeight(order.tareWeightKg || 5000);
    setBankRef(`DBT-SBI-${Math.floor(100000000 + Math.random() * 900000000)}`);
    setActionNotes('');
    setShowModal(true);
  };

  const handleAdvanceStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setSubmitting(true);

    try {
      const payload = {
        newStatus: targetStatus,
        qualityGrade,
        moisturePercentage: Number(moisture),
        foreignMatterPercentage: Number(foreignMatter),
        grossWeightKg: Number(grossWeight),
        tareWeightKg: Number(tareWeight),
        bankReferenceNumber: bankRef,
        notes: actionNotes
      };

      const res = await axios.patch(`/api/orders/${selectedOrder._id}/advance-status`, payload);
      if (res.data.success) {
        setSuccessBanner(`Order ${selectedOrder.orderNumber} successfully advanced to ${targetStatus}!`);
        setShowModal(false);
        fetchOrders();
      }
    } catch (err) {
      console.error('Error advancing status:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'All' && o.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const numMatch = o.orderNumber?.toLowerCase().includes(q);
      const farmerMatch = o.farmerId?.name?.toLowerCase().includes(q);
      const cropMatch = o.cropName?.toLowerCase().includes(q);
      const tokenMatch = o.queueToken?.toLowerCase().includes(q);
      return numMatch || farmerMatch || cropMatch || tokenMatch;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" /> Central Hub Processing Operations
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B4D3E] font-['Manrope',sans-serif]">
          {t('gov.orders_title')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          {t('gov.orders_subtitle')}
        </p>
      </div>

      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner('')} className="text-stone-400 hover:text-stone-700">✕</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'Slot Booked', 'In Queue', 'Quality Check', 'Weighing', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-[#1B4D3E] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID, farmer, vehicle..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-stone-500">Loading procurement orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400">No orders found matching filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order / Token</th>
                  <th className="py-3.5 px-4">Farmer Details</th>
                  <th className="py-3.5 px-4">Crop & Qty</th>
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Quality & Weighment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Hub Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                {filteredOrders.map((order) => {
                  const isCompleted = order.status === 'Completed';

                  return (
                    <tr key={order._id} className="hover:bg-stone-50/70 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-stone-900 block">{order.orderNumber}</span>
                        <span className="inline-block mt-0.5 font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {order.queueToken || 'Q-XX'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-stone-900 block">{order.farmerId?.name}</span>
                        <span className="text-[11px] text-stone-500">
                          {order.farmerId?.phone} • {order.farmerId?.district}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-stone-900 block">{order.cropName}</span>
                        <span className="text-[11px] text-stone-500">
                          Est: {order.estimatedQuantityQuintals} Qtl
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-stone-800 block">{order.vehicleType}</span>
                        <span className="font-mono text-[11px] text-stone-500">{order.vehicleNumber}</span>
                      </td>

                      <td className="py-3.5 px-4 space-y-0.5">
                        <span className="text-[11px] font-medium text-stone-700 block">
                          Grade: <b>{order.qualityGrade}</b> {order.moisturePercentage ? `(${order.moisturePercentage}%)` : ''}
                        </span>
                        <span className="text-[11px] text-stone-500 block">
                          Net: {order.netWeightQuintals ? `${order.netWeightQuintals} Qtl` : 'Pending'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'Quality Check' || order.status === 'Weighing'
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => openActionModal(order)}
                          className="px-3 py-1.5 rounded-xl bg-[#1B4D3E] hover:bg-[#2D6A4F] text-white text-[11px] font-bold shadow-sm transition inline-flex items-center gap-1"
                        >
                          <Sliders className="w-3 h-3" />
                          <span>Advance / Update</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Hub Officer Action Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl border border-stone-200">
            <div className="text-center space-y-1 pb-3 border-b border-stone-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Hub Operations Control
              </span>
              <h3 className="text-xl font-extrabold text-stone-900 font-['Manrope',sans-serif]">
                {t('gov.advance_modal_title')}
              </h3>
              <p className="text-xs text-stone-500">
                Order: <span className="font-mono font-bold text-stone-800">{selectedOrder.orderNumber}</span> • Farmer: <span className="font-bold text-stone-800">{selectedOrder.farmerId?.name}</span>
              </p>
            </div>

            <form onSubmit={handleAdvanceStatus} className="space-y-4 text-xs">
              
              {/* Target Stage Selector */}
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Select Processing Milestone
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-stone-800 bg-white"
                >
                  <option value="Slot Booked">Stage 1: Slot Booked</option>
                  <option value="In Queue">Stage 2: In Queue (Gate Entry)</option>
                  <option value="Quality Check">Stage 3: Quality Check (Grading)</option>
                  <option value="Weighing">Stage 4: Weighing (Weighbridge Scales)</option>
                  <option value="Completed">Stage 5 & 6: Completed (Release DBT Payment)</option>
                </select>
              </div>

              {/* Quality Check Section */}
              {(targetStatus === 'Quality Check' || targetStatus === 'Weighing' || targetStatus === 'Completed') && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <span className="font-bold text-stone-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Quality Assessment (FAQ)
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-stone-500">Grade</label>
                      <select
                        value={qualityGrade}
                        onChange={(e) => setQualityGrade(e.target.value)}
                        className="w-full mt-0.5 p-1.5 rounded-lg border border-stone-300 bg-white"
                      >
                        <option value="Grade A (FAQ)">Grade A (FAQ)</option>
                        <option value="Grade B">Grade B</option>
                        <option value="Grade C">Grade C</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-stone-500">Moisture %</label>
                      <input
                        type="number"
                        step="0.1"
                        value={moisture}
                        onChange={(e) => setMoisture(e.target.value)}
                        className="w-full mt-0.5 p-1.5 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-stone-500">Foreign %</label>
                      <input
                        type="number"
                        step="0.1"
                        value={foreignMatter}
                        onChange={(e) => setForeignMatter(e.target.value)}
                        className="w-full mt-0.5 p-1.5 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Weighbridge Section */}
              {(targetStatus === 'Weighing' || targetStatus === 'Completed') && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <span className="font-bold text-stone-800 flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-blue-600" />
                    Weighbridge Measurements (Digital Scale)
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-stone-500">Gross Weight (Loaded Kg)</label>
                      <input
                        type="number"
                        value={grossWeight}
                        onChange={(e) => setGrossWeight(e.target.value)}
                        className="w-full mt-0.5 p-1.5 rounded-lg border border-stone-300 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-stone-500">Tare Weight (Empty Vehicle Kg)</label>
                      <input
                        type="number"
                        value={tareWeight}
                        onChange={(e) => setTareWeight(e.target.value)}
                        className="w-full mt-0.5 p-1.5 rounded-lg border border-stone-300 bg-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Calculated Net Yield Preview */}
                  <div className="pt-2 flex justify-between text-stone-700 bg-blue-50/70 p-2 rounded-lg border border-blue-200">
                    <span>Calculated Net Weight:</span>
                    <span className="font-bold text-blue-900">
                      {Math.max(0, (grossWeight - tareWeight) / 100).toFixed(2)} Quintals
                    </span>
                  </div>
                </div>
              )}

              {/* Direct Benefit Transfer (DBT) Section */}
              {targetStatus === 'Completed' && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                  <span className="font-bold text-emerald-900 flex items-center gap-1">
                    <Banknote className="w-3.5 h-3.5 text-emerald-700" />
                    Direct Benefit Transfer (DBT Settlement)
                  </span>
                  <div>
                    <label className="text-stone-600">Bank UTR / Transaction Ref</label>
                    <input
                      type="text"
                      value={bankRef}
                      onChange={(e) => setBankRef(e.target.value)}
                      className="w-full mt-0.5 p-1.5 rounded-lg border border-stone-300 bg-white font-mono font-bold"
                    />
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    A cryptographic block will be calculated and saved into the immutable transparency ledger.
                  </p>
                </div>
              )}

              {/* Action Notes */}
              <div>
                <label className="block text-stone-500 mb-1">Inspector / Officer Comments</label>
                <input
                  type="text"
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="e.g. Verified under Fair Average Quality norms."
                  className="w-full p-2 rounded-xl border border-stone-300 bg-white"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-stone-300 font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 py-2.5 rounded-xl bg-[#1B4D3E] hover:bg-[#2D6A4F] text-white font-bold shadow-md transition disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : 'Commit Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

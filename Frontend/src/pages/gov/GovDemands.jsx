import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  Building2, 
  Plus, 
  Sprout, 
  Scale, 
  Banknote, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Tag
} from 'lucide-react';

export const GovDemands = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [demands, setDemands] = useState([]);
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Demand Modal
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [cropName, setCropName] = useState('Wheat');
  const [season, setSeason] = useState('Rabi 2026-27');
  const [targetQuantity, setTargetQuantity] = useState(100000);
  const [mspPrice, setMspPrice] = useState(2275);
  const [selectedHub, setSelectedHub] = useState('');
  const [guidelines, setGuidelines] = useState('Standard FAQ guidelines apply.');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchDemandsAndHubs = async () => {
    try {
      const [dRes, hRes] = await Promise.all([
        axios.get('/api/orders/demands/all'),
        axios.get('/api/hubs')
      ]);
      setDemands(dRes.data);
      setHubs(hRes.data);
      if (hRes.data.length > 0) setSelectedHub(hRes.data[0]._id);
    } catch (err) {
      console.error('Error fetching demands:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandsAndHubs();
  }, []);

  const handleCreateDemand = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post('/api/orders/demands/create', {
        title,
        cropName,
        season,
        targetQuantityQuintals: Number(targetQuantity),
        mspPrice: Number(mspPrice),
        hubId: selectedHub,
        guidelines
      });

      if (res.data.success) {
        setSuccessMsg('Procurement quota successfully issued and broadcasted to farmers!');
        setShowModal(false);
        setTitle('');
        fetchDemandsAndHubs();
      }
    } catch (err) {
      console.error('Error creating demand:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" /> Minimum Support Price (MSP) Program
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B4D3E] font-['Manrope',sans-serif]">
            {t('gov.demands_title')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Publish procurement demands, set national buffer targets, and broadcast MSP purchasing quotas.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-[#1B4D3E] hover:bg-[#2D6A4F] text-white text-xs font-bold shadow-md transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {t('gov.create_demand')}
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-stone-400 hover:text-stone-700">✕</button>
        </div>
      )}

      {/* Demands Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-stone-500">Loading MSP procurement demands...</div>
      ) : demands.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 text-xs text-stone-400">
          No procurement demands active. Click "Create New Procurement Demand" to issue a quota.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demands.map((demand) => {
            const progress = Math.min(100, Math.round(((demand.procuredQuantityQuintals || 0) / demand.targetQuantityQuintals) * 100));

            return (
              <div
                key={demand._id}
                className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-4 hover:border-emerald-300 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {demand.status}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    {demand.season}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-stone-900 font-['Manrope',sans-serif]">
                    {demand.title}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Target Hub: <span className="font-semibold text-stone-800">{demand.hubId?.name || 'All Regional Hubs'}</span>
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-stone-600">Procurement Progress:</span>
                    <span className="text-emerald-800">{progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1B4D3E] rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-stone-400">
                    <span>Procured: {(demand.procuredQuantityQuintals || 0).toLocaleString()} Qtl</span>
                    <span>Target: {demand.targetQuantityQuintals.toLocaleString()} Qtl</span>
                  </div>
                </div>

                {/* MSP Tag & Guidelines */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#1B4D3E]">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>MSP Rate: ₹{demand.mspPrice?.toLocaleString('en-IN')}/Quintal</span>
                  </div>
                  <span className="text-[11px] text-stone-500">FAQ Verified</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Demand Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 font-['Manrope',sans-serif]">
              {t('gov.create_demand')}
            </h3>

            <form onSubmit={handleCreateDemand} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Demand Campaign Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Rabi 2026-27 Wheat Procurement Drive"
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1B4D3E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Crop Name
                  </label>
                  <select
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Wheat">Wheat</option>
                    <option value="Mustard">Mustard</option>
                    <option value="Soybean">Soybean</option>
                    <option value="Paddy (Grade A)">Paddy (Grade A)</option>
                    <option value="Gram (Chana)">Gram (Chana)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Season
                  </label>
                  <input
                    type="text"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {t('gov.target_quintals')}
                  </label>
                  <input
                    type="number"
                    required
                    value={targetQuantity}
                    onChange={(e) => setTargetQuantity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {t('gov.msp_rate')}
                  </label>
                  <input
                    type="number"
                    required
                    value={mspPrice}
                    onChange={(e) => setMspPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Procurement Hub
                </label>
                <select
                  value={selectedHub}
                  onChange={(e) => setSelectedHub(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                >
                  {hubs.map(h => (
                    <option key={h._id} value={h._id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Procurement Norms & Guidelines
                </label>
                <textarea
                  rows={2}
                  value={guidelines}
                  onChange={(e) => setGuidelines(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#2D6A4F] text-white font-bold shadow-md transition disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : 'Issue MSP Quota'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

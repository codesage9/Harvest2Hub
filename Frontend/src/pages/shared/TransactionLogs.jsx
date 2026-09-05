import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  FileText, 
  ShieldCheck, 
  Search, 
  Download, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  Filter,
  Eye,
  Printer
} from 'lucide-react';

export const TransactionLogs = () => {
  const { t } = useTranslation();
  const { user, isGov } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTxs = async () => {
      if (!user) return;
      try {
        let endpoint = `/api/transactions/${user._id || user.id}`;
        if (isGov) {
          endpoint = '/api/transactions/ledger/all';
        }
        const res = await axios.get(endpoint);
        setTransactions(res.data);
      } catch (err) {
        console.error('Error loading transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTxs();
  }, [user, isGov]);

  const filtered = transactions.filter((tx) => {
    if (filterType !== 'All' && tx.type !== filterType) return false;
    if (search) {
      const q = search.toLowerCase();
      const refMatch = tx.referenceNumber?.toLowerCase().includes(q);
      const cropMatch = tx.crop?.toLowerCase().includes(q);
      const hubMatch = tx.hubName?.toLowerCase().includes(q);
      const orderMatch = tx.orderNumber?.toLowerCase().includes(q);
      return refMatch || cropMatch || hubMatch || orderMatch;
    }
    return true;
  });

  const handleOpenReceipt = (tx) => {
    setSelectedTx(tx);
    setShowReceiptModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Immutable Verification Records
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B4D3E] font-['Manrope',sans-serif]">
            {t('transactions.title')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            {t('transactions.subtitle')}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'Slot Booking', 'Quality Verification', 'Weighment Completed', 'Direct Bank Transfer'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                filterType === type
                  ? 'bg-[#1B4D3E] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reference or crop..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
          />
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-stone-500">Loading verified transaction records...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400">No transaction logs match your criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">{t('transactions.ref_number')}</th>
                  <th className="py-3.5 px-4">{t('transactions.type')}</th>
                  <th className="py-3.5 px-4">Crop & Qty</th>
                  <th className="py-3.5 px-4">{t('transactions.amount')}</th>
                  <th className="py-3.5 px-4">{t('transactions.date')}</th>
                  <th className="py-3.5 px-4">{t('transactions.status')}</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                {filtered.map((tx) => (
                  <tr key={tx._id} className="hover:bg-stone-50/70 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                      {tx.referenceNumber}
                      {tx.orderNumber && (
                        <span className="block text-[10px] text-stone-400 font-sans font-normal">
                          Order: {tx.orderNumber}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-stone-800">
                      {tx.type}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900">{tx.crop || '—'}</span>
                      {tx.quantityQuintals > 0 && (
                        <span className="text-stone-500 ml-1">({tx.quantityQuintals} Qtl)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                      {tx.amount > 0 ? `₹${tx.amount.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap">
                      {new Date(tx.createdAt || tx.timestamp).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenReceipt(tx)}
                        className="p-1.5 rounded-lg border border-stone-200 hover:bg-emerald-50 hover:text-emerald-700 text-stone-600 transition inline-flex items-center gap-1 font-semibold text-[11px]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Digital Receipt Modal */}
      {showReceiptModal && selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl border border-stone-200">
            {/* Header */}
            <div className="text-center space-y-1 pb-4 border-b border-stone-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 font-['Manrope',sans-serif]">
                Agricultural Procurement Digital Receipt
              </h3>
              <p className="text-[11px] text-stone-400 font-mono">
                Ref: {selectedTx.referenceNumber}
              </p>
            </div>

            {/* Receipt Details */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Transaction Type:</span>
                <span className="font-bold text-stone-800">{selectedTx.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Order Reference:</span>
                <span className="font-mono font-bold text-stone-800">{selectedTx.orderNumber || 'H2H-SYS-DIRECT'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Procurement Hub:</span>
                <span className="font-bold text-stone-800">{selectedTx.hubName || 'Central Hub'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Crop & Net Quantity:</span>
                <span className="font-bold text-stone-800">
                  {selectedTx.crop} • {selectedTx.quantityQuintals} Quintals
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Settled MSP Amount:</span>
                <span className="font-mono font-extrabold text-stone-900 text-sm">
                  {selectedTx.amount > 0 ? `₹${selectedTx.amount.toLocaleString('en-IN')}` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Verification Status:</span>
                <span className="font-bold text-emerald-700">{selectedTx.status} (PFMS Verified)</span>
              </div>
            </div>

            {/* Cryptographic SHA-256 Seal */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-600 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Cryptographic Block Seal (SHA-256)
              </span>
              <p className="font-mono text-[10px] break-all text-stone-800">
                {selectedTx.blockHash}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="w-1/2 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-600 hover:bg-stone-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="w-1/2 py-2.5 rounded-xl bg-[#1B4D3E] hover:bg-[#2D6A4F] text-xs font-bold text-white flex items-center justify-center gap-1 shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { 
  ShieldCheck, 
  Lock, 
  Link as LinkIcon, 
  CheckCircle2, 
  Search, 
  FileText, 
  Database, 
  Layers,
  Sparkles,
  ArrowRight,
  Hash
} from 'lucide-react';

export const TransparencyLedger = () => {
  const { t } = useTranslation();
  const [ledger, setLedger] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const res = await axios.get('/api/transactions/ledger/all');
        setLedger(res.data);
      } catch (err) {
        console.error('Error loading transparency ledger:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLedger();
  }, []);

  const filtered = ledger.filter((block) => {
    if (filterType !== 'All' && block.type !== filterType) return false;
    if (search) {
      const q = search.toLowerCase();
      const hashMatch = block.blockHash?.toLowerCase().includes(q);
      const prevMatch = block.previousHash?.toLowerCase().includes(q);
      const refMatch = block.referenceNumber?.toLowerCase().includes(q);
      const userMatch = block.userId?.name?.toLowerCase().includes(q);
      return hashMatch || prevMatch || refMatch || userMatch;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          Tamper-Proof National Agricultural Ledger (SHA-256)
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B4D3E] font-['Manrope',sans-serif]">
          {t('nav.ledger')} & Blockchain Explorer
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-3xl leading-relaxed">
          Every grain weighment, quality certification score, and direct benefit transfer (DBT) is cryptographically linked to the previous block via SHA-256 hash chains. Mathematical proof against corruption and arbitrary weight deductions.
        </p>
      </div>

      {/* Network Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Total Ledger Blocks</p>
            <h3 className="text-2xl font-bold text-stone-900">{ledger.length} Blocks</h3>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Hashing Algorithm</p>
            <h3 className="text-lg font-bold text-stone-900 font-mono">SHA-256 (256-bit)</h3>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Chain Integrity</p>
            <h3 className="text-base font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> 100% Validated
            </h3>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
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

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search block hash or transaction ref..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
          />
        </div>
      </div>

      {/* Blocks List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-stone-500">Verifying blockchain hashes...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400 bg-white rounded-3xl border border-stone-200">
            No blocks found matching filter.
          </div>
        ) : (
          filtered.map((block, idx) => (
            <div
              key={block._id}
              className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-4 hover:border-emerald-300 transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-stone-900 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
                    #{filtered.length - idx}
                  </span>
                  <span className="font-bold text-sm text-stone-900">{block.type}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Ref: {block.referenceNumber}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-stone-400">
                    {new Date(block.createdAt).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Sealed
                  </span>
                </div>
              </div>

              {/* Transaction Payload Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-stone-50 rounded-xl text-xs border border-stone-100">
                <div>
                  <span className="text-stone-400 block text-[11px]">Participant:</span>
                  <span className="font-bold text-stone-800">{block.userId?.name || 'Registered Citizen'}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Associated Order:</span>
                  <span className="font-mono font-bold text-stone-800">{block.orderNumber || 'DIRECT'}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Commodity:</span>
                  <span className="font-bold text-stone-800">
                    {block.crop} {block.quantityQuintals > 0 ? `(${block.quantityQuintals} Qtl)` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Settlement Amount:</span>
                  <span className="font-mono font-bold text-[#1B4D3E]">
                    {block.amount > 0 ? `₹${block.amount.toLocaleString('en-IN')}` : 'State Verified'}
                  </span>
                </div>
              </div>

              {/* Hashes Section */}
              <div className="space-y-1.5 text-[11px] font-mono">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-stone-400 shrink-0 flex items-center gap-1">
                    <LinkIcon className="w-3 h-3 text-stone-400" />
                    Previous Block Hash:
                  </span>
                  <span className="text-stone-500 truncate">{block.previousHash}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 flex items-center gap-1">
                    <Hash className="w-3 h-3 text-emerald-600" />
                    Block Hash (SHA-256):
                  </span>
                  <span className="text-stone-900 font-bold break-all bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {block.blockHash}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

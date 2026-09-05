import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  Building2, 
  TrendingUp, 
  Banknote, 
  Scale, 
  Layers, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Plus, 
  AlertCircle,
  Truck,
  ShieldCheck
} from 'lucide-react';

export const GovDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGovData = async () => {
      try {
        const [analyticsRes, ordersRes] = await Promise.all([
          axios.get('/api/analytics/overview'),
          axios.get('/api/orders/all')
        ]);
        setAnalytics(analyticsRes.data);
        setRecentOrders(ordersRes.data.slice(0, 5));
      } catch (err) {
        console.error('Error fetching gov dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGovData();
  }, []);

  const summary = analytics?.summary || {
    totalFarmers: 124,
    totalHubs: 4,
    totalOrders: 18,
    totalProcuredQuintals: 4850,
    totalDisbursedAmount: 11033750,
    totalStorageCapacity: 197000,
    currentStorageUsed: 91500,
    storageUtilizationPercent: 46
  };

  const statusDist = analytics?.statusDistribution || {
    booked: 4,
    inQueue: 2,
    qualityCheck: 3,
    weighing: 2,
    completed: 7
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-[#1B4D3E] text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-800 text-blue-200 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" /> Food & Civil Supplies Procurement Division
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Manrope',sans-serif]">
            {user?.name || 'Procurement Nodal Officer'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-200 max-w-2xl">
            {t('dashboard.gov_subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/gov/orders"
            className="px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
          >
            <Layers className="w-4 h-4" />
            Manage Active Orders
          </Link>
          <Link
            to="/gov/demands"
            className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs sm:text-sm transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            New MSP Quota
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Grain Procured (Net)</p>
            <h3 className="text-2xl font-bold text-stone-900">{summary.totalProcuredQuintals.toLocaleString()} Qtl</h3>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Total DBT Disbursed</p>
            <h3 className="text-2xl font-bold text-stone-900">₹{(summary.totalDisbursedAmount / 100000).toFixed(2)} Lakh</h3>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Active APMC Hubs</p>
            <h3 className="text-2xl font-bold text-stone-900">{summary.totalHubs} Hubs</h3>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Silo Storage Utilization</p>
            <h3 className="text-2xl font-bold text-stone-900">{summary.storageUtilizationPercent}%</h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Storage Status Chart & Real-Time Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Pending & Real-time Orders */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-stone-900 font-['Manrope',sans-serif]">
              Active Intake Flow & Quality Testing
            </h3>
            <Link to="/gov/orders" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1">
              View All Orders <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm divide-y divide-stone-100 overflow-hidden">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400">No recent orders.</div>
            ) : (
              recentOrders.map((order) => (
                <div key={order._id} className="p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-stone-50/60 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-stone-900">{order.orderNumber}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                        Token: {order.queueToken || 'Q-XX'}
                      </span>
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        {order.cropName} ({order.estimatedQuantityQuintals} Qtl)
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      Farmer: <span className="font-semibold text-stone-800">{order.farmerId?.name}</span> • 
                      Hub: <span className="font-semibold text-stone-800">{order.hubId?.name}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        order.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'Quality Check' || order.status === 'Weighing'
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {order.status}
                    </span>

                    <Link
                      to="/gov/orders"
                      className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-[#1B4D3E] hover:text-white text-stone-700 text-xs font-bold transition flex items-center gap-1"
                    >
                      Inspect / Action
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Hub Storage Breakdown */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-lg font-bold text-stone-900 font-['Manrope',sans-serif]">
            Hub Silo & Yard Capacities
          </h3>

          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-5">
            {analytics?.hubs?.map((hub) => {
              const util = Math.round((hub.currentStorage / (hub.storageCapacity || 1)) * 100);
              return (
                <div key={hub.id} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-stone-800">
                    <span className="truncate max-w-[200px]">{hub.name}</span>
                    <span>{util}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        util > 80 ? 'bg-red-500' : 'bg-[#1B4D3E]'
                      }`}
                      style={{ width: `${util}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>{hub.currentStorage.toLocaleString()} Qtl filled</span>
                    <span>Cap: {hub.storageCapacity.toLocaleString()} Qtl</span>
                  </div>
                </div>
              );
            })}

            <div className="pt-2 border-t border-stone-100">
              <Link
                to="/ledger"
                className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Audit Blockchain Ledger
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

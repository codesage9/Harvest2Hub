import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Sprout, Lock, Mail, ArrowRight, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';

export const LoginPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'farmer') {
        navigate('/farmer/dashboard');
      } else {
        navigate('/gov/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'farmer') {
      setEmail('farmer@harvest2hub.gov.in');
      setPassword('password123');
    } else if (role === 'government') {
      setEmail('gov@harvest2hub.gov.in');
      setPassword('password123');
    } else if (role === 'admin') {
      setEmail('admin@harvest2hub.gov.in');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-stone-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-stone-200 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#1B4D3E] text-white flex items-center justify-center mx-auto shadow-md">
            <Sprout className="w-7 h-7 text-emerald-300" />
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 font-['Manrope',sans-serif]">
            Sign in to Harvest<span className="text-emerald-600">2</span>Hub
          </h2>
          <p className="text-xs text-stone-500">
            Official Agricultural Procurement & Slot Management Portal
          </p>
        </div>

        {/* Demo Fast-Fill Buttons for SIH Judges */}
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              SIH Fast-Fill Accounts:
            </span>
            <span className="text-[10px] text-emerald-700 font-medium">Click to fill</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('farmer')}
              className="py-1.5 px-2 bg-white rounded-lg border border-emerald-300 text-emerald-800 text-[11px] font-bold hover:bg-emerald-100 transition shadow-sm"
            >
              🌾 Farmer
            </button>
            <button
              type="button"
              onClick={() => fillDemo('government')}
              className="py-1.5 px-2 bg-white rounded-lg border border-blue-300 text-blue-800 text-[11px] font-bold hover:bg-blue-100 transition shadow-sm"
            >
              🏛️ Institution
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="py-1.5 px-2 bg-white rounded-lg border border-purple-300 text-purple-800 text-[11px] font-bold hover:bg-purple-100 transition shadow-sm"
            >
              ⚡ Admin
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@harvest2hub.gov.in"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Password
              </label>
              <span className="text-[11px] text-emerald-700 font-medium">Default: password123</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#1B4D3E] hover:bg-[#2D6A4F] text-white text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Sign In to Dashboard
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center pt-2 text-xs text-stone-500">
          New user?{' '}
          <Link to="/register" className="font-bold text-[#1B4D3E] hover:underline">
            Register for a new account
          </Link>
        </div>
      </div>
    </div>
  );
};

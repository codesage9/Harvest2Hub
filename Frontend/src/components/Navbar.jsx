import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { AVAILABLE_LANGUAGES } from '../i18n';
import { 
  Sprout, 
  Globe, 
  User, 
  LogOut, 
  Calendar, 
  Activity, 
  MessageSquare, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Layers,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout, isAuthenticated, isFarmer, isGov, isAdmin, login } = useAuth();
  const navigate = useNavigate();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    setLangDropdownOpen(false);
  };

  // Quick switch for SIH presentation judges
  const quickSwitchRole = async (targetRole) => {
    setSwitchingRole(true);
    try {
      if (targetRole === 'farmer') {
        await login('farmer@harvest2hub.gov.in', 'password123');
        navigate('/farmer/dashboard');
      } else if (targetRole === 'government') {
        await login('gov@harvest2hub.gov.in', 'password123');
        navigate('/gov/dashboard');
      } else if (targetRole === 'admin') {
        await login('admin@harvest2hub.gov.in', 'password123');
        navigate('/gov/dashboard');
      }
    } catch (err) {
      console.error('Quick switch error:', err);
    } finally {
      setSwitchingRole(false);
    }
  };

  const currentLangObj = AVAILABLE_LANGUAGES.find(l => l.code === i18n.language) || AVAILABLE_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm">
      {/* Top SIH / National Banner */}
      <div className="bg-[#081C15] text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold tracking-wide text-emerald-300">SIH 2026 Problem Statement 26032</span>
          <span className="hidden sm:inline text-stone-300">| Smart Agriculture Procurement Hub Management</span>
        </div>

        {/* Demo Role Switcher for Hackathon Evaluation */}
        <div className="flex items-center gap-2 mt-1 sm:mt-0">
          <span className="text-[11px] text-stone-300 font-medium">Quick Demo Role:</span>
          <button
            onClick={() => quickSwitchRole('farmer')}
            disabled={switchingRole}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
              user?.role === 'farmer' ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            🌾 Farmer
          </button>
          <button
            onClick={() => quickSwitchRole('government')}
            disabled={switchingRole}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
              user?.role === 'government' ? 'bg-blue-600 text-white' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            🏛️ Gov Officer
          </button>
          <Link
            to="/ledger"
            className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-700/80 hover:bg-amber-700 text-amber-100 flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3" /> Ledger
          </Link>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B4D3E] to-[#2D6A4F] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-[#1B4D3E] font-['Manrope',sans-serif]">
                  Harvest<span className="text-emerald-600">2</span>Hub
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                  Gov Portal
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden md:block">Farm-to-Hub Slot & Settlement Engine</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-emerald-700 hover:bg-stone-100 transition"
            >
              {t('nav.home')}
            </Link>

            {isAuthenticated && isFarmer && (
              <>
                <Link
                  to="/farmer/dashboard"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-emerald-700 hover:bg-stone-100 transition"
                >
                  {t('nav.dashboard')}
                </Link>
                <Link
                  to="/farmer/book-slot"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-emerald-700 hover:bg-stone-100 transition"
                >
                  {t('nav.book_slot')}
                </Link>
                <Link
                  to="/farmer/track-order"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-emerald-700 hover:bg-stone-100 transition"
                >
                  {t('nav.track_order')}
                </Link>
                <Link
                  to="/community"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-emerald-700 hover:bg-stone-100 transition"
                >
                  {t('nav.community')}
                </Link>
                <Link
                  to="/chat"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-emerald-700 hover:bg-stone-100 transition"
                >
                  {t('nav.enquiry')}
                </Link>
                <Link
                  to="/transactions"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-emerald-700 hover:bg-stone-100 transition"
                >
                  {t('nav.transactions')}
                </Link>
              </>
            )}

            {isAuthenticated && isGov && (
              <>
                <Link
                  to="/gov/dashboard"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-blue-700 hover:bg-stone-100 transition"
                >
                  {t('nav.dashboard')}
                </Link>
                <Link
                  to="/gov/orders"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-blue-700 hover:bg-stone-100 transition"
                >
                  {t('nav.orders')}
                </Link>
                <Link
                  to="/gov/demands"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-blue-700 hover:bg-stone-100 transition"
                >
                  {t('nav.demands')}
                </Link>
                <Link
                  to="/community"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-blue-700 hover:bg-stone-100 transition"
                >
                  {t('nav.community')}
                </Link>
                <Link
                  to="/chat"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-blue-700 hover:bg-stone-100 transition"
                >
                  {t('nav.enquiry')}
                </Link>
                <Link
                  to="/transactions"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-blue-700 hover:bg-stone-100 transition"
                >
                  {t('nav.transactions')}
                </Link>
              </>
            )}

            <Link
              to="/ledger"
              className="px-3 py-2 rounded-lg text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {t('nav.ledger')}
            </Link>
          </nav>

          {/* Right Controls: Multilingual Selector + User Auth */}
          <div className="flex items-center gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 transition"
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-700" />
                <span>{currentLangObj.native}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-xl shadow-lg py-1 z-50 max-h-72 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100">
                    Select Language (12 Indian Languages)
                  </div>
                  {AVAILABLE_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 hover:text-emerald-900 transition ${
                        i18n.language === lang.code ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-stone-700'
                      }`}
                    >
                      <span>{lang.native}</span>
                      <span className="text-[10px] text-stone-400">{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile / Auth State */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 transition text-xs font-medium text-stone-800"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[100px] truncate hidden sm:inline">{user?.name}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  title={t('nav.logout')}
                  className="p-2 rounded-lg text-stone-500 hover:text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#1B4D3E] hover:bg-[#2D6A4F] shadow-sm transition"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            {t('nav.home')}
          </Link>
          {isAuthenticated && isFarmer && (
            <>
              <Link
                to="/farmer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                {t('nav.dashboard')}
              </Link>
              <Link
                to="/farmer/book-slot"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                {t('nav.book_slot')}
              </Link>
              <Link
                to="/farmer/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                {t('nav.track_order')}
              </Link>
            </>
          )}
          {isAuthenticated && isGov && (
            <>
              <Link
                to="/gov/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                {t('nav.dashboard')}
              </Link>
              <Link
                to="/gov/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                {t('nav.orders')}
              </Link>
              <Link
                to="/gov/demands"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                {t('nav.demands')}
              </Link>
            </>
          )}
          <Link
            to="/community"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            {t('nav.community')}
          </Link>
          <Link
            to="/chat"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            {t('nav.enquiry')}
          </Link>
          <Link
            to="/transactions"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            {t('nav.transactions')}
          </Link>
          <Link
            to="/ledger"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-emerald-800 bg-emerald-50"
          >
            {t('nav.ledger')}
          </Link>
          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            {t('nav.profile')}
          </Link>
        </div>
      )}
    </header>
  );
};

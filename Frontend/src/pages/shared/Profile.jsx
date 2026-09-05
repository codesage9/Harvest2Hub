import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { AVAILABLE_LANGUAGES } from '../../i18n';
import { 
  User, 
  Building2, 
  MapPin, 
  CreditCard, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Sprout,
  ShieldCheck
} from 'lucide-react';

export const Profile = () => {
  const { t, i18n } = useTranslation();
  const { user, updateProfile, isFarmer, isGov } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    state: '',
    district: '',
    village: '',
    pincode: '',
    landAreaAcres: 5,
    preferredLanguage: 'en',
    institutionName: '',
    designation: '',
    department: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    holderName: ''
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        state: user.state || 'Punjab',
        district: user.district || 'Ludhiana',
        village: user.village || '',
        pincode: user.pincode || '',
        landAreaAcres: user.landAreaAcres || 5,
        preferredLanguage: user.preferredLanguage || i18n.language || 'en',
        institutionName: user.institutionName || '',
        designation: user.designation || '',
        department: user.department || '',
        accountNumber: user.bankDetails?.accountNumber || '3049281900213',
        ifscCode: user.bankDetails?.ifscCode || 'SBIN0001432',
        bankName: user.bankDetails?.bankName || 'State Bank of India',
        holderName: user.bankDetails?.holderName || user.name || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLanguageSelect = (langCode) => {
    setFormData({ ...formData, preferredLanguage: langCode });
    i18n.changeLanguage(langCode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload = {
        ...formData,
        bankDetails: {
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
          bankName: formData.bankName,
          holderName: formData.holderName
        }
      };

      await updateProfile(payload);
      setSuccessMsg('Profile and Banking details updated successfully!');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B4D3E] font-['Manrope',sans-serif]">
          {t('profile.title')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          {t('profile.subtitle')}
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Personal Info */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            Citizen Identity Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-stone-700 mb-1">{t('profile.full_name')}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">{t('profile.phone')}</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-500"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">Aadhaar (UIDAI)</label>
              <input
                type="text"
                disabled
                value={user?.aadhaar || 'XXXX-XXXX-XXXX'}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Location & Land Area */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            Geographical Location & Agricultural Holdings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-stone-700 mb-1">{t('profile.state')}</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1B4D3E]"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">{t('profile.district')}</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1B4D3E]"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">{t('profile.village')}</label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1B4D3E]"
              />
            </div>
          </div>

          {isFarmer && (
            <div className="text-xs pt-2">
              <label className="block font-medium text-stone-700 mb-1">{t('profile.land_acres')}</label>
              <input
                type="number"
                name="landAreaAcres"
                value={formData.landAreaAcres}
                onChange={handleChange}
                className="w-full sm:w-64 p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1B4D3E]"
              />
            </div>
          )}

          {isGov && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Institution Name</label>
                <input
                  type="text"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1B4D3E]"
                />
              </div>
              <div>
                <label className="block font-medium text-stone-700 mb-1">Department / Designation</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1B4D3E]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Banking & Direct Benefit Transfer Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Direct Benefit Transfer (DBT) Bank Account
            </h3>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              PFMS Integrated
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-stone-700 mb-1">{t('profile.bank_name')}</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1B4D3E]"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">{t('profile.account_number')}</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1B4D3E] font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">{t('profile.ifsc')}</label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1B4D3E] font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">{t('profile.holder_name')}</label>
              <input
                type="text"
                name="holderName"
                value={formData.holderName}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1B4D3E]"
              />
            </div>
          </div>
        </div>

        {/* Preferred Language Setting */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600" />
            Preferred Regional Language
          </h3>
          <p className="text-xs text-stone-500">
            Select your language. Harvest2Hub will persist this preference in your profile.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {AVAILABLE_LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => handleLanguageSelect(l.code)}
                className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                  formData.preferredLanguage === l.code
                    ? 'bg-[#1B4D3E] text-white border-[#1B4D3E] shadow-sm'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>{l.native}</span>
                <span className="text-[10px] opacity-70">{l.code.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#1B4D3E] hover:bg-[#2D6A4F] text-white text-sm font-bold shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {t('profile.save_changes')}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

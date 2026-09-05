import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';
import pa from './locales/pa.json';
import mr from './locales/mr.json';
import ur from './locales/ur.json';
import bn from './locales/bn.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import gu from './locales/gu.json';
import kn from './locales/kn.json';
import ml from './locales/ml.json';
import orLocale from './locales/or.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  pa: { translation: pa },
  mr: { translation: mr },
  ur: { translation: ur },
  bn: { translation: bn },
  ta: { translation: ta },
  te: { translation: te },
  gu: { translation: gu },
  kn: { translation: kn },
  ml: { translation: ml },
  or: { translation: orLocale }
};

const savedLang = localStorage.getItem('harvest2hub_lang') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'hi',
    interpolation: {
      escapeValue: false
    }
  });

// Handle RTL direction for Urdu
export const updateDocumentDirection = (lang) => {
  if (lang === 'ur') {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ur';
  } else {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = lang;
  }
};

updateDocumentDirection(savedLang);

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('harvest2hub_lang', lng);
  updateDocumentDirection(lng);
});

export const AVAILABLE_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'ur', label: 'Urdu (RTL)', native: 'اردو' }
];

export default i18n;

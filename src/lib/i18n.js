// FILE: src/lib/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // Init i18next
  .init({
    debug: false,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // Not needed for react as it escapes by default
    },
    resources: {
      en: {
        common: require('../../public/locales/en/common.json')
      },
      th: {
        common: require('../../public/locales/th/common.json')
      }
    },
    ns: ['common'],
    defaultNS: 'common'
  });

export default i18n;

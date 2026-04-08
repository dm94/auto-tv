import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import es from './locales/es.json';
import { DEFAULT_LANGUAGE } from './config/config';

const resources = {
  en,
  es,
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;

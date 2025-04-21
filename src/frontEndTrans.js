import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import TranslationEn from "../i18n/en.json";
import TranslationAr from "../i18n/ar.json";
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: TranslationEn,
  },
  ar: {
    translation: TranslationAr,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });

export default i18n;
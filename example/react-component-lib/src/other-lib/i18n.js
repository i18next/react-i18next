import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

const i18n = createInstance({
  fallbackLng: 'en',
  debug: true,

  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },

  resources: {
    en: {
      translation: {
        hello: 'Hello from other i18n instance',
      },
    },
    de: {
      translation: {
        hello: 'Hallo aus einer anderen i18n Instanz',
      },
    },
  },
});

i18n.use(initReactI18next).init();

export default i18n;

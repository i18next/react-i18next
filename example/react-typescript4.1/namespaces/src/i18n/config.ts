import i18n from 'i18next';
import ns1 from './en/ns1.json';
import ns2 from './en/ns2.json';
import { initReactI18next } from 'react-i18next';

export const resources = {
  en: {
    ns1,
    ns2,
  },
} as const;

i18n.use(initReactI18next).init({
  lng: 'en',
  ns: ['ns1', 'ns2'],
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  resources,
});

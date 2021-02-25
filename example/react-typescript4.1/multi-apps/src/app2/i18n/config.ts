import i18n from 'i18next';
import ns2 from './en/ns2.json';
import { initReactI18next } from 'react-i18next';

export const resources = {
  en: {
    ns2,
  },
} as const;

i18n.use(initReactI18next).init({
  lng: 'en',
  ns: ['ns2'],
  resources,
});

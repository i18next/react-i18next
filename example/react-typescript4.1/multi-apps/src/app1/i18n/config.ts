import i18n from 'i18next';
import ns1 from './en/ns1.json';
import { initReactI18next } from 'react-i18next';

export const resources = {
  en: {
    ns1,
  },
} as const;

i18n.use(initReactI18next).init({
  lng: 'en',
  ns: ['ns1'],
  resources,
});

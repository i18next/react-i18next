import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import ICU from 'i18next-icu';
import de from 'i18next-icu/locale-data/de';
const icu = new ICU({
  localeData: de, // you also can pass in array of localeData
});

/**
 * or dynamically like: https://github.com/locize/locize-react-intl-example/blob/master/src/locize/index.js#L53
 */
import('i18next-icu/locale-data/ru' /* webpackChunkName: "locale-data-ru" */).then(localeData =>
  icu.addLocaleData(localeData),
);

i18n
  .use(icu)
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    nsSeparator: false,
    keySeparator: false,

    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react!!
    },

    react: {
      wait: true,
      useSuspense: false,
    },
  });

export default i18n;

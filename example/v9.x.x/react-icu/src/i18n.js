import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';

import ICU from 'i18next-icu';
import de from 'i18next-icu/locale-data/de'; // or dynamically like: https://github.com/locize/locize-react-intl-example/blob/master/src/locize/index.js#L53

i18n
  .use(
    new ICU({
      localeData: de, // you also can pass in array of localeData
    }),
  )
  .use(Backend)
  .use(LanguageDetector)
  .use(reactI18nextModule)
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
    },
  });

export default i18n;

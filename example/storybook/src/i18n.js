import i18n from 'i18next';
import LocizeBackend from 'i18next-locize-backend';
import LocizeEditor from 'locize-editor';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';

i18n
  .use(reactI18nextModule)
  .use(LocizeBackend)
  .use(LocizeEditor)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    appendNamespaceToCIMode: true,
    saveMissing: true,

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    debug: true,
    keySeparator: '### not used ###', // we use content as keys
    nsSeparator: '### not used ###', // we use content as keys

    backend: {
      projectId: 'e365e54a-c52c-479b-8538-682635db252f', // <-- replace with your projectId
      apiKey: 'your apiKey',
      referenceLng: 'en',
    },

    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ',',
      format(value, format, lng) {
        if (format === 'uppercase') return value.toUpperCase();
        return value;
      },
    },

    react: {
      wait: true,
    },
  });

export default i18n;

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import LocizeBackend from 'i18next-locize-backend';
import whichBackend from './whichBackend';

const options = {
  fallbackLng: 'en',

  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',

  keySeparator: false, // we use content as keys
  nsSeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ',',
  },

  react: {
    wait: true,
  },
};

switch (whichBackend()) {
  case 'locize':
    options.backend = {
      projectId: '9fa57726-b7a6-4d1c-bbf6-37629309e4c5', // <-- replace with your projectId
      apiKey: 'your apiKey',
      referenceLng: 'en',
    };
    i18n.use(LocizeBackend);
    break;

  case 'xhr':
    options.backend = {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    };
    i18n.use(Backend);
    break;

  case 'memory':
  default:
    options.resources = {
      en: {
        translations: {
          'To get started, edit <1>src/App.js</1> and save to reload.':
            'To get started, edit <1>src/App.js</1> and save to reload.',
          'Welcome to React': 'Welcome to React and react-i18next',
          advice: 'Try to set the query parameter "backend" to memory, xhr or locize i.e. {{url}}',
        },
      },
      de: {
        translations: {
          'To get started, edit <1>src/App.js</1> and save to reload.':
            'Starte in dem du, <1>src/App.js</1> editierst und speicherst.',
          'Welcome to React': 'Willkommen bei React und react-i18next',
          advice:
            'Versuche den query Parameter "backend" auf memory, xhr oder locize zu setzen zBsp. {{url}}',
        },
      },
    };
}

export default () => {
  i18n.use(LanguageDetector).init(options);
  return i18n;
};

import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import Expo from 'expo';

// creating a language detection plugin using expo
// http://i18next.com/docs/ownplugin/#languagedetector
const languageDetector = {
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: (callback) => { return /*'en'; */ Expo.Util.getCurrentLocaleAsync().then(lng => { callback(lng); })  },
  init: () => {},
  cacheUserLanguage: () => {}
}

i18n
  .use(languageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',

    resources: {
      en: {
        home: {
          title: 'Welcome',
          introduction: 'This text comes from i18next and is provided in english.'
        },
        page2: {
          title: 'Page 2',
          introduction: 'This text on page two.'
        },
        common: {
          currentLanguage: 'The current language is "{{lng}}"',
          actions: {
            toggleToGerman: 'Deutsch',
            toggleToEnglish: 'English',
            goToPage2: 'Open page 2'
          }
        }
      },
      de: {
        home: {
          title: 'Willkommen',
          introduction: 'Dieser Text ist von i18next und ist in deutsch.'
        },
        page2: {
          title: 'Seite 2',
          introduction: 'Text auf Seite 2'
        },
        common: {
          currentLanguage: 'Die Sprache ist auf "{{lng}}" gesetzt',
          actions: {
            toggleToGerman: 'Deutsch',
            toggleToEnglish: 'English',
            goToPage2: 'Öffne Seite 2'
          }
        }
      }
    },

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',

    debug: true,

    // cache: {
    //   enabled: true
    // },

    interpolation: {
      escapeValue: false, // not needed for react as it does escape per default to prevent xss!
    }
  });


export default i18n;

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// without stubbing do this:
// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';

// i18n.use(initReactI18next).init({
//   lng: 'en',
//   fallbackLng: 'en',

//   // have a common namespace used around the full app
//   ns: ['translations'],
//   defaultNS: 'translations',

//   // debug: true,

//   interpolation: {
//     escapeValue: false, // not needed for react!!
//   },

//   resources: { en: { translations: {} } },
// });

Enzyme.configure({ adapter: new Adapter() });

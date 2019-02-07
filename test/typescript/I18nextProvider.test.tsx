import i18n from 'i18next';
import * as React from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',

  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',

  debug: true,

  interpolation: {
    escapeValue: false, // not needed for react!!
  },

  react: {
    wait: true,
  },
});

function test() {
  return (
    <React.Suspense fallback={<p>Loading</p>}>
      <I18nextProvider i18n={i18n}>
        <h1>Foo</h1>
      </I18nextProvider>
    </React.Suspense>
  );
}

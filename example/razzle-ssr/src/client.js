import App from './App';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import { render } from 'react-dom';

import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

render(
  <I18nextProvider
    i18n={i18n}
    initialI18nStore={window.initialI18nStore}
    initialLanguage={window.initialLanguage}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </I18nextProvider>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}

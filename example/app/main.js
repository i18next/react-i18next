import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next'; // as we build ourself via webpack

import App from './components/App'; // your entry page
import i18n from './i18n'; // initialized i18next instance

ReactDOM.render(
  <I18nextProvider i18n={ i18n }><App /></I18nextProvider>,
  document.getElementById('app')
);

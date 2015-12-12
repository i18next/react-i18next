import ReactDOM from 'react-dom';
import React from 'react';
import App from './components/App';
import { I18nextProvider } from 'react-i18next/lib'; // as we build ourself via webpack
import i18n from './i18n';

ReactDOM.render(
  <I18nextProvider i18n={ i18n }><App /></I18nextProvider>,
  document.getElementById('app')
);

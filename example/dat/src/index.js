import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';

import './index.css';
import App from './App';
import i18n from './i18n';
import registerServiceWorker from './registerServiceWorker';
import whichBackend from './whichBackend';

function render() {
  ReactDOM.render(
    <I18nextProvider i18n={i18n()}>
      <App />
    </I18nextProvider>,
    document.getElementById('root'),
  );
  registerServiceWorker();
}

if (
  whichBackend() === 'locize' &&
  navigator &&
  navigator.permissions &&
  navigator.permissions.request
) {
  const permission = {
    name: 'network',
    hostname: 'api.locize.io',
  };

  navigator.permissions.query(permission).then(res => {
    if (res.state === 'granted') return render();

    navigator.permissions.request(permission).then(res => {
      if (res.state === 'granted') return document.location.reload();
      console.error('not allowed to access the "api.locize.io" network');
    });
  });
} else if (
  whichBackend() === 'locize' &&
  document.location.href.indexOf('https://') === 0 &&
  document.location.hostname.indexOf('hashbase.io') > 0
) {
  document.location = document.location.href.replace('https://', 'dat://');
} else {
  render();
}

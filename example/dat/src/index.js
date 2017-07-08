import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';

import './index.css';
import App from './App';
import i18n from './i18n';
import registerServiceWorker from './registerServiceWorker';
import whichBackend from './whichBackend';

function render() {
  ReactDOM.render(<I18nextProvider i18n={ i18n }><App /></I18nextProvider>, document.getElementById('root'));
  registerServiceWorker();
}

if (whichBackend() === 'locize' && navigator && navigator.permissions && navigator.permissions.request) {
  navigator.permissions.request({
    name: 'network',
    hostname: 'api.locize.io'
  }).then((res) => {
    if (res.state === 'granted') {
      render();
    } else {
      console.error('not allowed to access the "api.locize.io" network');
    }
  }, (err) => {
    console.error(err);
  });
} else {
  render();
}

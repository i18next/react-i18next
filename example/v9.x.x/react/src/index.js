import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// import { I18nextProvider } from 'react-i18next';
// import i18n from './i18n';

import './i18n';

ReactDOM.render(<App />, document.getElementById('root'));

// or use I18nextProvider
// -> remove the i18n.use(reactI18nextModule) in file ./i18n.js
// ReactDOM.render(<I18nextProvider i18n={i18n}><App /></I18nextProvider>, document.getElementById('root'));

registerServiceWorker();

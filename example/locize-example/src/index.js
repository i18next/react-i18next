import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import './i18n';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

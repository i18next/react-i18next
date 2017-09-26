import { h, render } from 'preact';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import './i18n';

render(<App />, document.getElementById('root'));
registerServiceWorker();

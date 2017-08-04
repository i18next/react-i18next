import { h, render } from 'preact';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import i18n from './i18n';

render(<I18nextProvider i18n={ i18n }><App /></I18nextProvider>, document.getElementById('root'));
registerServiceWorker();

import logo from './logo.svg';
import './App.css';
import './i18n/config';
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation(['ns1', 'ns2']);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>{t('ns1:title')}</h2>
        <p>{t('ns1:description.part1')}</p>
        <p>{t('ns1:description.part2')}</p>
        <p>{t('ns2:description.part1')}</p>
        <p>{t('ns2:description.part2')}</p>
      </header>
    </div>
  );
}

export default App;

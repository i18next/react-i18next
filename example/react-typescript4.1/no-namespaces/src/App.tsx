import logo from './logo.svg';
import './App.css';
import './i18n/config';
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>{t('title')}</h2>
        <p>{t('description.part1')}</p>
        <p>{t('description.part2')}</p>
        <p>{t('description.part3')}</p>
      </header>
    </div>
  );
}

export default App;

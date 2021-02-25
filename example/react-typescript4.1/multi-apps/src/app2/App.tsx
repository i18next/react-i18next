import './App.css';
import { useTranslation } from 'react-i18next';
import './i18n/config';

function App() {
  const { t } = useTranslation('ns2');

  return (
    <div className="App">
      <h1>{t('welcomeTitle')}</h1>
    </div>
  );
}

export default App;

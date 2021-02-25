import './App.css';
import { useTranslation } from 'react-i18next';
import './i18n/config';

function App() {
  const { t } = useTranslation('ns1');

  return (
    <div className="App">
      <h1>{t('helloWorldTitle')}</h1>
    </div>
  );
}

export default App;

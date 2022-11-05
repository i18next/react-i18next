import './i18n/config';
import { useTranslation } from 'react-i18next';

function App() {
  const {t} = useTranslation();

  return (
    <div className="App">
      <p>{t('title')}</p>
      <p>{t('description.part1')}</p>
      <p>{t('description.part2')}</p>
    </div>
  );
}

export default App;

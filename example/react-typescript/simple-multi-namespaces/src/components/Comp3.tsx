import { useTranslation } from "react-i18next";

function Comp2() {
  const {t} = useTranslation(['ns1', 'ns2']);

  return (
    <div className="App">
      <p>{t('ns1:description.part1')}</p>
      <p>{t('ns2:description.part2')}</p>
    </div>
  );
}

export default Comp2;
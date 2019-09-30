import * as React from 'react';
import { useTranslation } from 'react-i18next';

function defaultObjectUsage() {
  const { t, i18n } = useTranslation();

  // ensure the i18n here is still exposing original type
  const language = i18n.language;
  i18n.languages.join(', ');

  return (
    <div>
      {t('key1')} {i18n.exists('key1')}
    </div>
  );
}

function alternateArrayUsage() {
  const [t, i18n] = useTranslation();
  return (
    <div>
      {t('key1')} {i18n.exists('key1')}
    </div>
  );
}

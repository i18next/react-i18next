import React from 'react';
import { translate } from 'react-i18next/lib';

function TranslatableView(props) {
  const { t } = props;

  return (
    <div>
      <h1>{t('common:appName')}</h1>
      <p>{t('content.text', { /* options t options */ })}</p>
      <a href='https://github.com/i18next/react-i18next' target='_blank'>{t('nav:link1')}</a>
    </div>
  )
}

export default translate(['view', 'nav'])(TranslatableView);

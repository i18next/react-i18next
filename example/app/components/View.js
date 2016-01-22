import React from 'react';
import { translate, Interpolate } from 'react-i18next/lib';

function TranslatableView(props) {
  const { t } = props;

  let interpolateComponent = <strong>"a interpolated component"</strong>;

  return (
    <div>
      <h1>{t('common:appName')}</h1>
      <p>{t('content.text', { /* options t options */ })}</p>
      <Interpolate parent='p' i18nKey='common:interpolateSample' value='"some value in props"' component={interpolateComponent} />
      <a href='https://github.com/i18next/react-i18next' target='_blank'>{t('nav:link1')}</a>
    </div>
  )
}

export default translate(['view', 'nav'])(TranslatableView);

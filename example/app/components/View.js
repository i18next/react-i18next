import React from 'react';
import { translate, Interpolate } from 'react-i18next';
import AnotherComponent from './AnotherComponent';
import YetAnotherComponent from './YetAnotherComponent';
import i18n from '../i18n';

@translate(['view', 'nav'], { wait: true })
class TranslatableView extends React.Component {
  render() {
    const { t } = this.props;

    let interpolateComponent = <strong>"a interpolated component"</strong>;
    const toggle = lng => i18n.changeLanguage(lng);

    return (
      <div>
        <h1>{t('common:appName')}</h1>
        <button onClick={() => toggle('de')}>{t('nav:linkDE')}</button>
        <button onClick={() => toggle('en')}>{t('nav:linkEN')}</button>
        <AnotherComponent />
        <YetAnotherComponent />
        <Interpolate parent='p' i18nKey='common:interpolateSample' value='"some value in props"' component={interpolateComponent} />
        <Interpolate parent='p' i18nKey='common:interpolateSample' useDangerouslySetInnerHTML={true} value='"some value in props"' component={interpolateComponent} />
        <a href='https://github.com/i18next/react-i18next' target='_blank'>{t('nav:link1')}</a>
      </div>
    )
  }
}

export default TranslatableView;

import React from 'react';
import { translate, Interpolate } from 'react-i18next';
import AnotherComponent from './AnotherComponent';
import YetAnotherComponent from './YetAnotherComponent';


@translate(['view', 'nav'])
class TranslatableView extends React.Component {
  render() {
    const { t } = this.props;

    let interpolateComponent = <strong>"a interpolated component"</strong>;

    return (
      <div>
        <h1>{t('common:appName')}</h1>
        <AnotherComponent />
        <YetAnotherComponent />
        <Interpolate parent='p' i18nKey='common:interpolateSample' value='"some value in props"' component={interpolateComponent} />
        <a href='https://github.com/i18next/react-i18next' target='_blank'>{t('nav:link1')}</a>
      </div>
    )
  }
}

export default TranslatableView;

import React from 'react';
import {i18n, withNamespaces} from '../lib/i18n';

class LocaleSwitcher extends React.Component {
  render() {
    const { t } = this.props;
    return (
      <button
        type="submit"
        onClick={() => i18n.changeLanguage(i18n.language.startsWith('en') ? 'de' : 'en')}
      >
        {t('common:change-locale')}
      </button>
    );
  }
}

export default withNamespaces(['common'])(LocaleSwitcher);

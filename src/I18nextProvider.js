import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { I18nContext } from './context';

export class I18nextProvider extends Component {
  constructor(props) {
    super(props);
    this.i18n = props.i18n;
    this.defaultNS = props.defaultNS;

    // nextjs / SSR: getting data from next.js or other ssr stack
    if (props.initialI18nStore) {
      this.i18n.services.resourceStore.data = props.initialI18nStore;
      this.i18n.options.isInitialSSR = true; // if set will be deleted on first render in translate hoc
    }
    if (props.initialLanguage) {
      this.i18n.changeLanguage(props.initialLanguage);
    }
    this.reportNS = props.reportNS;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.i18n !== nextProps.i18n) {
      throw new Error('[react-i18next][I18nextProvider]does not support changing the i18n object.');
    }
  }

  render() {
    const { children } = this.props;
    const { i18n, defaultNS, reportNS } = this;

    return React.createElement(
      I18nContext.Provider,
      {
        value: {
          i18n,
          defaultNS,
          reportNS,
          lng: i18n && i18n.language,
          t: i18n && i18n.t.bind(i18n),
        },
      },
      children
    );
  }
}

I18nextProvider.propTypes = {
  i18n: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  defaultNS: PropTypes.string,
  reportNS: PropTypes.func,
};

I18nextProvider.defaultProps = {
  defaultNS: undefined,
  reportNS: undefined,
};

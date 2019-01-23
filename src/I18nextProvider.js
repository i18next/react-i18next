import React, { Component } from 'react';
import { I18nContext } from './context';
import { initSSR } from './utils';

export class I18nextProvider extends Component {
  constructor(props) {
    super(props);

    // nextjs / SSR: getting data from next.js or other ssr stack
    initSSR(props, true);
  }

  render() {
    const { children, i18n, defaultNS, reportNS } = this.props;

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
      children,
    );
  }
}

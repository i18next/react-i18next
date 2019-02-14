import React from 'react';
import { useSSR } from './useSSR';
import { composeInitialProps } from './context';

export function withSSR() {
  return function Extend(WrappedComponent) {
    function I18nextWithSSR({ initialI18nStore, initialLanguage, ...rest }) {
      useSSR(initialI18nStore, initialLanguage);

      return React.createElement(WrappedComponent, {
        ...rest,
      });
    }

    I18nextWithSSR.getInitialProps = composeInitialProps(WrappedComponent);

    return I18nextWithSSR;
  };
}

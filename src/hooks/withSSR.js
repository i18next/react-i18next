import React from 'react';
import { useSSR } from './useSSR';

export function withSSR() {
  return function Extend(WrappedComponent) {
    function Wrapper({ initialI18nStore, initialLanguage, ...rest }) {
      useSSR(initialI18nStore, initialLanguage);

      return React.createElement(WrappedComponent, {
        ...rest,
      });
    }

    return Wrapper;
  };
}

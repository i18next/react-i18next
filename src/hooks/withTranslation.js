import React from 'react';
import { useTranslation } from './useTranslation';

export function withTranslation(ns) {
  return function Extend(WrappedComponent) {
    function Wrapper(props) {
      const [t, i18n] = useTranslation(ns, props);

      return React.createElement(WrappedComponent, {
        ...props,
        t,
        i18n,
      });
    }

    return Wrapper;
  };
}

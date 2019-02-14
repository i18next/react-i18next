import React from 'react';
import { useTranslation } from './useTranslation';

export function withTranslation(ns) {
  return function Extend(WrappedComponent) {
    function I18nextWithTranslation(props) {
      const [t, i18n, ready] = useTranslation(ns, props);

      return React.createElement(WrappedComponent, {
        ...props,
        t,
        i18n,
        tReady: ready,
      });
    }

    return I18nextWithTranslation;
  };
}

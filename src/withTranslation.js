import React from 'react';
import { useTranslation } from './useTranslation';
import { getDisplayName } from './utils';

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

    I18nextWithTranslation.displayName = `withI18nextTranslation(${getDisplayName(
      WrappedComponent,
    )})`;

    return I18nextWithTranslation;
  };
}

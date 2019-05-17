import React from 'react';
import { useTranslation } from './useTranslation';
import { getDisplayName } from './utils';

export function withTranslation(ns, options = {}) {
  return function Extend(WrappedComponent) {
    function I18nextWithTranslation(props, ref) {
      const [t, i18n, ready] = useTranslation(ns, props);

      const passDownProps = {
        ...props,
        t,
        i18n,
        tReady: ready,
      };
      if (options.withRef && ref) {
        passDownProps.ref = ref;
      }
      return React.createElement(WrappedComponent, passDownProps);
    }

    I18nextWithTranslation.displayName = `withI18nextTranslation(${getDisplayName(
      WrappedComponent,
    )})`;

    I18nextWithTranslation.WrappedComponent = WrappedComponent;

    return options.withRef ? React.forwardRef(I18nextWithTranslation) : I18nextWithTranslation;
  };
}

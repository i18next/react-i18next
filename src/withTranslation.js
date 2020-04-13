import React from 'react';
import { useTranslation } from './useTranslation';
import { getDisplayName } from './utils';

export function withTranslation(ns, options = {}) {
  if (ns && typeof ns !== 'string' && !Array.isArray(ns)) {
    options = ns; // eslint-disable-line no-param-reassign
    ns = undefined; // eslint-disable-line no-param-reassign
  }
  return function Extend(WrappedComponent) {
    function I18nextWithTranslation({ forwardedRef, ...rest }) {
      const [t, i18n, ready] = useTranslation(ns, rest);

      if (!ready && options.wait) {
        if (options.wait === true) return null;
        return options.wait; // if it's a react component
      }

      const passDownProps = { ...rest, t, i18n, tReady: ready };
      if (options.withRef && forwardedRef) passDownProps.ref = forwardedRef;
      else if (!options.withRef && forwardedRef) passDownProps.forwardedRef = forwardedRef;
      return React.createElement(WrappedComponent, passDownProps);
    }

    I18nextWithTranslation.displayName = `withI18nextTranslation(${getDisplayName(
      WrappedComponent,
    )})`;
    I18nextWithTranslation.WrappedComponent = WrappedComponent;
    const forwardRef = (props, ref) =>
      React.createElement(I18nextWithTranslation, Object.assign({}, props, { forwardedRef: ref })); // eslint-disable-line prefer-object-spread

    return options.withRef ? React.forwardRef(forwardRef) : I18nextWithTranslation;
  };
}

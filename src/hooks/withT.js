import React from 'react';
import { useT } from './useT';

export function withT(ns) {
  return function Wrapper(WrappedComponent) {
    function Wrapper(props) {
      const [t, i18n] = useT(ns);

      return React.createElement(WrappedComponent, {
        ...props,
        t,
        i18n,
      });
    }

    return Wrapper;
  };
}

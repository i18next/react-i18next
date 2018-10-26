import React from 'react';
import { useT } from './useT';

export function withT(ns) {
  return function Wrapper(WrappedComponent) {
    function Wrapper(props) {
      const [t, ready, i18n] = useT(ns);

      return React.createElement(WrappedComponent, {
        ...props,
        t,
        ready,
        i18n,
      });
    }

    return Wrapper;
  };
}

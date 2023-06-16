import { createElement, useMemo } from 'react';
import { I18nContext } from './context.js';

export function I18nextProvider({ context, i18n, defaultNS, children }) {
  const value = useMemo(
    () => ({
      i18n,
      defaultNS,
    }),
    [i18n, defaultNS],
  );

  const Context = context || I18nContext;

  return createElement(
    Context.Provider,
    {
      value,
    },
    children,
  );
}

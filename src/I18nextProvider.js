import React from 'react';
import { I18nContext, usedI18nextProvider } from './context';

export function I18nextProvider({ i18n, defaultNS, children }) {
  usedI18nextProvider(true);

  return React.createElement(
    I18nContext.Provider,
    {
      value: {
        i18n,
        defaultNS,
      },
    },
    children,
  );
}

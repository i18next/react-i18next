import React from 'react';
import { I18nContext, usedI18nextProvider } from './context';

const _warnRemovedContextProp = prop => {
  console.warn(
    `[react-i18next] I18nextProvider no longer provides "${prop}" as a context prop, please upgrade your code: https://react.i18next.com/latest/migrating-v9-to-v10`
  );
};

export function I18nextProvider({ i18n, defaultNS, children }) {
  usedI18nextProvider(true);

  return React.createElement(
    I18nContext.Provider,
    {
      value: {
        i18n,
        defaultNS,
        reportNS: _warnRemovedContextProp('reportNS'),
        lng: _warnRemovedContextProp('lng'),
        t: _warnRemovedContextProp('t')
      },
    },
    children,
  );
}

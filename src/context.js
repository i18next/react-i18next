import { createContext } from 'react';
import { getDefaults, setDefaults } from './defaults.js';
import { getI18n, setI18n } from './i18nInstance.js';
import { initReactI18next } from './initReactI18next.js';

export { getDefaults, setDefaults, getI18n, setI18n, initReactI18next };

export const I18nContext = createContext();

export class ReportNamespaces {
  constructor() {
    this.usedNamespaces = {};
  }

  addUsedNamespaces(namespaces) {
    namespaces.forEach((ns) => {
      if (!this.usedNamespaces[ns]) this.usedNamespaces[ns] = true;
    });
  }

  getUsedNamespaces() {
    return Object.keys(this.usedNamespaces);
  }
}

export function composeInitialProps(ForComponent) {
  return (ctx) =>
    new Promise((resolve) => {
      const i18nInitialProps = getInitialProps();

      if (ForComponent.getInitialProps) {
        ForComponent.getInitialProps(ctx).then((componentsInitialProps) => {
          resolve({
            ...componentsInitialProps,
            ...i18nInitialProps,
          });
        });
      } else {
        resolve(i18nInitialProps);
      }
    });
  // Avoid async for now - so we do not need to pull in regenerator

  // return async ctx => {
  //   const componentsInitialProps = ForComponent.getInitialProps
  //     ? await ForComponent.getInitialProps(ctx)
  //     : {};

  //   const i18nInitialProps = getInitialProps();

  //   return {
  //     ...componentsInitialProps,
  //     ...i18nInitialProps,
  //   };
  // };
}

export function getInitialProps() {
  const i18n = getI18n();
  const namespaces = i18n.reportNamespaces ? i18n.reportNamespaces.getUsedNamespaces() : [];

  const ret = {};
  const initialI18nStore = {};
  i18n.languages.forEach((l) => {
    initialI18nStore[l] = {};
    namespaces.forEach((ns) => {
      initialI18nStore[l][ns] = i18n.getResourceBundle(l, ns) || {};
    });
  });

  ret.initialI18nStore = initialI18nStore;
  ret.initialLanguage = i18n.language;

  return ret;
}

import React from 'react';

let defaultOptions = {
  bindI18n: 'languageChanged',
  bindI18nStore: '',
  transEmptyNodeValue: '',
  transSupportBasicHtmlNodes: true,
  transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
  useSuspense: true,
};

let i18nInstance;
let hasUsedI18nextProvider;

export const I18nContext = React.createContext();

export function usedI18nextProvider(used) {
  hasUsedI18nextProvider = used;
}

export function getHasUsedI18nextProvider() {
  return hasUsedI18nextProvider;
}

export function setDefaults(options = {}) {
  defaultOptions = { ...defaultOptions, ...options };
}

export function getDefaults() {
  return defaultOptions;
}

export class ReportNamespaces {
  constructor() {
    this.usedNamespaces = {};
  }

  addUsedNamespaces(namespaces) {
    namespaces.forEach(ns => {
      if (!this.usedNamespaces[ns]) this.usedNamespaces[ns] = true;
    });
  }

  getUsedNamespaces() {
    return Object.keys(this.usedNamespaces);
  }
}

export function setI18n(instance) {
  i18nInstance = instance;
}

export function getI18n() {
  return i18nInstance;
}

export const initReactI18next = {
  type: '3rdParty',

  init(instance) {
    setI18n(instance);
  },
};

export function composeInitialProps(ForComponent) {
  return ctx =>
    new Promise(resolve => {
      const i18nInitialProps = getInitialProps();

      if (ForComponent.getInitialProps) {
        ForComponent.getInitialProps(ctx).then(componentsInitialProps => {
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
  i18n.languages.forEach(l => {
    initialI18nStore[l] = {};
    namespaces.forEach(ns => {
      initialI18nStore[l][ns] = i18n.getResourceBundle(l, ns) || {};
    });
  });

  ret.initialI18nStore = initialI18nStore;
  ret.initialLanguage = i18n.language;

  return ret;
}

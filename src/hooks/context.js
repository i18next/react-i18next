let defaultOptions = {
  wait: false,
  bindI18n: 'languageChanged',
};

let i18nInstance;

export function setDefaults(options) {
  defaultOptions = { ...defaultOptions, ...options };
}

export function getDefaults() {
  return defaultOptions;
}

const usedNamespaces = {};
export function addUsedNamespaces(namespaces) {
  namespaces.forEach(ns => {
    if (!usedNamespaces[ns]) usedNamespaces[ns] = true;
  });
}

export function getUsedNamespaces() {
  return Object.keys(usedNamespaces);
}

export function setI18n(instance) {
  i18nInstance = instance;
}

export function getI18n() {
  return i18nInstance;
}

export const initReactI18n = {
  type: '3rdParty',

  init(instance) {
    setDefaults(instance.options.react);
    setI18n(instance);
  },
};

export function getInitialPropsForSRR() {
  const i18n = getI18n();
  const namespaces = getUsedNamespaces();

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

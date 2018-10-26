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

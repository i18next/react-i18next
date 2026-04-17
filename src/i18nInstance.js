let i18nInstance;
const isBrowser = typeof window !== 'undefined';

export const setI18n = (instance) => {
  if (isBrowser) i18nInstance = instance;
};

export const getI18n = () => (isBrowser ? i18nInstance : undefined);

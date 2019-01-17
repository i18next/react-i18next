import { getI18n } from './context';

export function useSSR(initialI18nStore, initialLanguage) {
  const i18n = getI18n();

  // nextjs / SSR: getting data from next.js or other ssr stack
  if (initialI18nStore && !i18n.initializedStoreOnce) {
    i18n.services.resourceStore.data = initialI18nStore;
    i18n.initializedStoreOnce = true;
  }

  if (initialLanguage && !i18n.initializedLanguageOnce) {
    i18n.changeLanguage(initialLanguage);
    i18n.initializedLanguageOnce = true;
  }
}

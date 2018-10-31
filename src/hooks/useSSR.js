import { getI18n } from './context';

let initializedLanguageOnce = false;
let initializedStoreOnce = false;

export function useSSR(initialI18nStore, initialLanguage) {
  // only set this once
  if (initializedLanguageOnce && initializedStoreOnce) return;

  const i18n = getI18n();

  // nextjs / SSR: getting data from next.js or other ssr stack
  if (initialI18nStore && !initializedStoreOnce) {
    i18n.services.resourceStore.data = initialI18nStore;
    initializedStoreOnce = true;
  }
  if (initialLanguage && !initializedLanguageOnce) {
    i18n.changeLanguage(initialLanguage);
    initializedLanguageOnce = true;
  }
}

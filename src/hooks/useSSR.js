import { getI18n } from './context';

let initializedOnce = false;

export function useSSR(initialI18nStore, initialLanguage) {
  // only set this once
  if (initializedOnce) return;

  const i18n = getI18n();

  // nextjs / SSR: getting data from next.js or other ssr stack
  if (initialI18nStore && initialLanguage) {
    i18n.services.resourceStore.data = initialI18nStore;
    i18n.changeLanguage(initialLanguage);
    initializedOnce = true;
  }
}

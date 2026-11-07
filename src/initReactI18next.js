import { setI18n } from './i18nInstance.js';

export const initReactI18next = {
  type: '3rdParty',

  // the instance's `react` options stay on the instance (read per instance where they are
  // used), so a second instance does not inherit them; setDefaults() sets them for all
  init(instance) {
    setI18n(instance);
  },
};

import { setDefaults } from './defaults';
import { setI18n } from './i18nInstance';

export const initReactI18next = {
  type: '3rdParty',

  init(instance) {
    setDefaults(instance.options.react);
    setI18n(instance);
  },
};

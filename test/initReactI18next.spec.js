import { describe, it, expect, vi } from 'vitest';
import { initReactI18next } from '../src/initReactI18next';
import { getDefaults } from '../src/defaults';
import { getI18n } from '../src/i18nInstance';

describe('initReactI18next', () => {
  it('should have type 3rdParty', () => {
    expect(initReactI18next.type).toBe('3rdParty');
  });

  it('should initialize with i18n instance', () => {
    const mockI18n = {
      options: {
        react: {
          useSuspense: false,
          bindI18n: 'customEvent',
        },
      },
    };

    initReactI18next.init(mockI18n);

    const defaults = getDefaults();
    expect(defaults.useSuspense).toBe(false);
    expect(defaults.bindI18n).toBe('customEvent');

    const i18n = getI18n();
    expect(i18n).toBe(mockI18n);
  });

  it('should handle instance with no react options', () => {
    const mockI18n = {
      options: {},
    };

    initReactI18next.init(mockI18n);

    const i18n = getI18n();
    expect(i18n).toBe(mockI18n);
  });

  it('should handle instance with partial react options', () => {
    const mockI18n = {
      options: {
        react: {
          useSuspense: true,
        },
      },
    };

    initReactI18next.init(mockI18n);

    const defaults = getDefaults();
    expect(defaults.useSuspense).toBe(true);
  });
});

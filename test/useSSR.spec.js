import { describe, it, vitest, beforeEach, afterAll, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createInstance } from 'i18next';
import i18n from './i18n';
import { setI18n } from '../src/context';
import { useSSR } from '../src/useSSR';

vitest.unmock('../src/useSSR');

describe('useSSR', () => {
  let instance;

  beforeEach(async () => {
    instance = createInstance();
    await instance.init({ lng: 'en', ns: ['common'], resources: {} });
    setI18n(instance);
  });

  afterAll(() => {
    setI18n(i18n);
  });

  const initialI18nStore = { de: { other: { hello: 'Hallo' } } };

  it('should set values', () => {
    renderHook(() => useSSR(initialI18nStore, 'de'));
    expect(instance.language).toBe('de');
    expect(instance.services.resourceStore.data).toEqual(initialI18nStore);
    expect(instance.t('hello', { ns: 'other' })).toBe('Hallo');
    // a language change loads the hydrated namespaces too
    expect(instance.options.ns).toEqual(['common', 'other']);
  });

  it('should only take the store and the language once', () => {
    renderHook(() => useSSR(initialI18nStore, 'de'));
    renderHook(() => useSSR({ fr: { other: { hello: 'Bonjour' } } }, 'fr'));
    expect(instance.language).toBe('de');
    expect(instance.services.resourceStore.data).toEqual(initialI18nStore);
  });

  it('should use the instance passed in props', () => {
    const other = createInstance();
    other.init({ lng: 'en', resources: {} });
    renderHook(() => useSSR(initialI18nStore, 'de', { i18n: other }));
    expect(other.language).toBe('de');
    expect(instance.language).toBe('en');
  });

  it('should not touch a cloned instance', () => {
    const clone = instance.cloneInstance();
    renderHook(() => useSSR(initialI18nStore, 'de', { i18n: clone }));
    expect(clone.language).toBe('en');
    expect(clone.services.resourceStore.data).toEqual({});
  });

  it('should not crash and warn when i18n is not available', () => {
    setI18n(undefined);
    const warnSpy = vitest.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useSSR({ foo: 'bar' }, 'en'));
    }).not.toThrow();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('useSSR'),
      expect.objectContaining({ code: 'NO_I18NEXT_INSTANCE' }),
    );
    warnSpy.mockRestore();
  });

  it('should not crash and warn when i18n exists but is not initialized', () => {
    const uninitializedI18n = {
      options: {},
      services: {},
    };
    setI18n(uninitializedI18n);
    const warnSpy = vitest.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useSSR({ foo: 'bar' }, 'en'));
    }).not.toThrow();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('useSSR'),
      expect.objectContaining({ code: 'I18N_NOT_INITIALIZED' }),
    );
    warnSpy.mockRestore();
  });
});

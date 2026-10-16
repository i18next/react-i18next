import { describe, it, vitest, beforeEach, afterEach, expect } from 'vitest';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { createElement, Suspense } from 'react';
import i18n from './i18n';
import { BackendMock } from './backendMock';
import { useTranslation } from '../src/useTranslation';

vitest.unmock('../src/useTranslation');

describe('useTranslation loading ns', () => {
  let newI18n;
  let backend;

  beforeEach(() => {
    newI18n = i18n.createInstance();
    backend = new BackendMock();
    newI18n.use(backend).init({
      lng: 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // not needed for react!!
      },
    });
  });

  it('should wait for correct translation with suspense', async () => {
    const all = [];
    const { result } = renderHook(() => {
      const value = useTranslation('common', { i18n: newI18n, useSuspense: true });
      all.push(value);
      return value;
    });

    expect(all).toHaveLength(0);
    backend.flush();
    await waitFor(() => expect(result.current.t('key1')).toBe('test'));
  });

  it('should wait for correct translation without suspense', async () => {
    const { result } = renderHook(() =>
      useTranslation('common', { i18n: newI18n, useSuspense: false }),
    );

    expect(result.current.t('key1')).toBe('key1');
    backend.flush();
    await waitFor(() => expect(result.current.t('key1')).toBe('test'));
  });

  it('should return defaultValue if i18n instance not found', async () => {
    const { result } = renderHook(() =>
      useTranslation('common', { i18n: newI18n, useSuspense: false }),
    );
    const { t } = result.current;
    expect(t('key1', 'my default value')).toBe('my default value');
    expect(t('key1', { defaultValue: 'my default value' })).toBe('my default value');
  });
});

describe('useTranslation loading synchronous namespaces', () => {
  afterEach(cleanup);

  it.each([
    { label: 'current language', lng: undefined, expectedLanguage: 'en' },
    { label: 'explicit language', lng: 'de', expectedLanguage: 'de' },
  ])(
    'loads namespaces on demand without suspending for the $label',
    async ({ lng, expectedLanguage }) => {
      const newI18n = i18n.createInstance();
      const backend = {
        type: 'backend',
        init() {
          // This synchronous backend needs no setup.
        },
        read: vitest.fn((language, namespace, callback) => {
          callback(null, { key1: `${language}/${namespace}` });
        }),
      };
      await newI18n.use(backend).init({
        lng: 'en',
        fallbackLng: false,
        load: 'currentOnly',
        ns: ['shell'],
        defaultNS: 'shell',
        initAsync: false,
      });

      expect(backend.read).toHaveBeenCalledTimes(1);
      expect(backend.read).toHaveBeenCalledWith('en', 'shell', expect.any(Function));
      expect(newI18n.hasResourceBundle(expectedLanguage, 'common')).toBe(false);

      const fallback = vitest.fn(() => null);
      const wrapper = ({ children }) =>
        createElement(Suspense, { fallback: createElement(fallback) }, children);
      const { result, rerender } = renderHook(
        ({ namespace }) => useTranslation(namespace, { i18n: newI18n, useSuspense: true, lng }),
        { initialProps: { namespace: 'common' }, wrapper },
      );

      expect(result.current).not.toBeNull();
      expect(result.current.ready).toBe(true);
      expect(result.current.t('key1')).toBe(`${expectedLanguage}/common`);
      expect(fallback).not.toHaveBeenCalled();
      expect(newI18n.hasResourceBundle(expectedLanguage, 'later')).toBe(false);

      rerender({ namespace: 'later' });

      expect(result.current.ready).toBe(true);
      expect(result.current.t('key1')).toBe(`${expectedLanguage}/later`);
      expect(fallback).not.toHaveBeenCalled();

      await act(() => newI18n.changeLanguage('fr'));

      expect(result.current.ready).toBe(true);
      expect(result.current.t('key1')).toBe(`${lng || 'fr'}/later`);
      expect(fallback).not.toHaveBeenCalled();
    },
  );
});

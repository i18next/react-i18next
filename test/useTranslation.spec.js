import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import i18nInstance from './i18n';
import { useTranslation } from '../src/useTranslation';
import { setI18n } from '../src/context';
import { I18nextProvider } from '../src/I18nextProvider';

jest.unmock('../src/useTranslation');
jest.unmock('../src/I18nextProvider');

describe('useTranslation', () => {
  describe('object', () => {
    it('should render correct content', () => {
      const { result } = renderHook(() => useTranslation('translation', { i18n: i18nInstance }));
      const { t, i18n } = result.current;
      expect(t('key1')).toBe('test');
      expect(i18nInstance).toBe(i18n);
    });
  });

  describe('array', () => {
    it('should render correct content', () => {
      const { result } = renderHook(() => useTranslation('translation', { i18n: i18nInstance }));
      const [t, i18n] = result.current;
      expect(t('key1')).toBe('test');
      expect(i18n).toBe(i18nInstance);
    });
  });

  describe('without i18next instance', () => {
    beforeAll(() => {
      setI18n(undefined);
    });

    afterAll(() => {
      setI18n(i18nInstance);
    });

    describe('handling gracefully', () => {
      it('should render content fallback', () => {
        console.warn = jest.fn();

        const { result } = renderHook(() => useTranslation('translation', { i18n: undefined }));
        const { t, i18n } = result.current;

        expect(t('key1')).toBe('key1');
        expect(t(['doh', 'Human friendly fallback'])).toBe('Human friendly fallback');
        expect(i18n).toEqual({});

        expect(console.warn).toHaveBeenCalled();
      });
    });
  });

  describe('few namespaces', () => {
    it('hook destructured values are expected types', () => {
      const { result } = renderHook(() =>
        useTranslation(['other', 'translation'], { i18n: i18nInstance }),
      );
      const { t, i18n } = result.current;
      expect(typeof t).toBe('function');
      expect(i18n).toEqual(i18nInstance);
      expect(t('key1')).toEqual('key1');
    });

    describe('fallback mode', () => {
      beforeAll(() => {
        i18nInstance.options.react.nsMode = 'fallback';
      });

      afterAll(() => {
        delete i18nInstance.options.react.nsMode;
      });

      it('should render correct content', () => {
        const { result } = renderHook(() =>
          useTranslation(['other', 'translation'], { i18n: i18nInstance }),
        );
        const { t } = result.current;

        expect(t('key1')).toBe('test');
      });
    });

    it('should render content fallback', () => {
      const { result } = renderHook(() =>
        useTranslation(['other', 'translation'], { i18n: i18nInstance }),
      );
      const { t } = result.current;

      expect(t('key1')).toBe('key1');
    });
  });

  describe('default namespace from context', () => {
    afterEach(() => {
      i18nInstance.reportNamespaces.usedNamespaces = {};
    });

    const namespace = 'sampleNS';
    const wrapper = ({ children }) => (
      <I18nextProvider defaultNS={namespace} i18={i18nInstance}>
        {children}
      </I18nextProvider>
    );

    it('should render content fallback', () => {
      const { result } = renderHook(() => useTranslation(), { wrapper });
      const { t } = result.current;

      expect(t('key1')).toBe('key1');

      expect(i18nInstance.reportNamespaces.getUsedNamespaces()).toContain(namespace);
    });
  });

  describe('key prefix', () => {
    i18nInstance.addResource('en', 'translation', 'deeply.nested.key', 'here!');

    it('should apply keyPrefix', () => {
      const { result } = renderHook(() =>
        useTranslation('translation', { i18n: i18nInstance, keyPrefix: 'deeply.nested' }),
      );
      const { t } = result.current;
      expect(t('key')).toBe('here!');
      expect(t.keyPrefix).toBe('deeply.nested');
    });
  });

  describe('replacing i18n instance in provider', () => {
    i18nInstance.addResource('fr', 'translation', 'key1', 'test2');
    const i18nInstanceClone = i18nInstance.cloneInstance({ lng: 'fr' });
    const wrapper = ({ children, i18n }) => (
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    );

    it('should render correct content', () => {
      const { result, rerender } = renderHook(() => useTranslation(), {
        wrapper,
        initialProps: {
          i18n: i18nInstance,
        },
      });

      const { t: t1 } = result.current;
      expect(t1('key1')).toBe('test');

      rerender({ i18n: i18nInstanceClone });

      const { t: t2 } = result.current;
      expect(t2('key1')).toBe('test2');
    });
  });
});

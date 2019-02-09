import React from 'react';
import { mount } from 'enzyme';
import i18nInstance from './i18n';
import { useTranslation } from '../src/useTranslation';
import { setI18n } from '../src/context';

jest.unmock('../src/useTranslation');

describe('useTranslation', () => {
  describe('object', () => {
    function TestComponent() {
      const { t, i18n } = useTranslation('translation', { i18n: i18nInstance });

      expect(typeof t).toBe('function');
      expect(i18nInstance).toBe(i18n);

      return <div>{t('key1')}</div>;
    }

    it('should render correct content', () => {
      const wrapper = mount(<TestComponent />, {});
      // console.log(wrapper.debug());
      expect(wrapper.contains(<div>test</div>)).toBe(true);
    });
  });

  describe('array', () => {
    function TestComponent() {
      const [t, instance] = useTranslation('translation', { i18nInstance });

      expect(typeof t).toBe('function');
      expect(instance).toBe(i18nInstance);

      return <div>{t('key1')}</div>;
    }

    it('should render correct content', () => {
      const wrapper = mount(<TestComponent />, {});
      // console.log(wrapper.debug());
      expect(wrapper.contains(<div>test</div>)).toBe(true);
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
      function TestComponent() {
        const { t, i18n } = useTranslation('translation', { i18n: undefined });

        expect(typeof t).toBe('function');
        expect(i18n).toEqual({});

        return <div>{t('key1')}</div>;
      }

      it('should render content fallback', () => {
        console.warn = jest.fn();
        const wrapper = mount(<TestComponent />, {});
        // console.log(wrapper.debug());
        expect(wrapper.contains(<div>key1</div>)).toBe(true);
        expect(console.warn).toHaveBeenCalled();
      });
    });
  });
});

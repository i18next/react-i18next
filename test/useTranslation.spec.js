import React from 'react';
import { mount } from 'enzyme';
import i18nInstance from './i18n';
import { useTranslation } from '../src/useTranslation';

jest.unmock('../src/useTranslation');

describe('useTranslation', () => {
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
});

import React from 'react';
import { mount } from 'enzyme';
import i18n from './i18n';
import { useTranslation } from '../src/useTranslation';

jest.unmock('../src/useTranslation');

describe('useTranslation', () => {
  function TestComponent() {
    const [t, instance] = useTranslation('translation', { i18n });

    expect(typeof t).toBe('function');
    expect(instance).toBe(i18n);

    return <div>{t('key1')}</div>;
  }

  it('should render correct content', () => {
    const wrapper = mount(<TestComponent />, {});
    // console.log(wrapper.debug());
    expect(wrapper.contains(<div>test</div>)).toBe(true);
  });
});

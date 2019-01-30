import React from 'react';
import { mount } from 'enzyme';
import i18n from './i18n';
import { TranslationRenderProp } from '../src/TranslationRenderProp';

jest.unmock('../src/TranslationRenderProp');

describe('TranslationRenderProp', () => {
  function TestComponent() {
    return <TranslationRenderProp>{t => <div>{t('key1')}</div>}</TranslationRenderProp>;
  }

  it('should render correct content', () => {
    const wrapper = mount(<TestComponent />);
    // console.log(wrapper.debug());
    expect(wrapper.contains(<div>test</div>)).toBe(true);
  });
});

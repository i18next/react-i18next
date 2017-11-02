import React from 'react';
import { mount } from 'enzyme';
import i18n from './i18n';
import I18n from '../src/I18n';

const context = { i18n };

describe('I18n simple', () => {
  it('should render correct content', () => {
    const wrapper = mount(
      <I18n ns="translation">{t => <span>{t('key1')}</span>}</I18n>,
      { context }
    );

    expect(wrapper.contains(<span>test</span>)).toBe(true);
  });
});

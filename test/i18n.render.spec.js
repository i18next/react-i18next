import React from 'react';
import { mount } from 'enzyme';
import i18n from './i18n';
import I18n from '../src/I18n';

const context = { i18n };

describe.only('I18n', () => {
  it('should render correct content', () => {
    const wrapper = mount(
      <I18n i18n={i18n} ns="translation">{t => <span>{t('key1')}</span>}</I18n>,
      { context }
    );

    expect(wrapper.contains(<span>test</span>)).toBe(true);
  });

  it('should render correct content for a component that renders a <I18n /> component', () => {
    const Comp = () => (
      <div>
        Values:
        <I18n i18n={i18n} ns="translation">
          {t => (
            <div>
              <span>{t('key1')}</span>
              <span>{t('key1')}</span>
            </div>
          )}
        </I18n>
      </div>
    );

    const wrapper = mount(<Comp />, { context });

    expect(
      wrapper.contains(
        <div>
          <span>test</span>
          <span>test</span>
        </div>
      )
    ).toBe(true);
  });
});

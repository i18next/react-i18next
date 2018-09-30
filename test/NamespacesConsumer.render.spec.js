import React from 'react';
import { mount } from 'enzyme';
import i18n from './i18n';
import { NamespacesConsumer } from '../src/NamespacesConsumer';

describe('NamespacesConsumer', () => {
  it('should render correct content', () => {
    const wrapper = mount(
      <NamespacesConsumer i18n={i18n} ns="translation">
        {t => <span>{t('key1')}</span>}
      </NamespacesConsumer>,
      {}
    );
    // console.log(wrapper.debug());
    expect(wrapper.contains(<span>test</span>)).toBe(true);
  });

  it('should render correct content for a component that renders a <NamespacesConsumer /> component', () => {
    const Comp = () => (
      <div>
        Values:
        <NamespacesConsumer i18n={i18n} ns="translation">
          {t => (
            <div>
              <span>{t('key1')}</span>
              <span>{t('key1')}</span>
            </div>
          )}
        </NamespacesConsumer>
      </div>
    );

    const wrapper = mount(<Comp />, {});

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

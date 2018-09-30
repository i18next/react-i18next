import React from 'react';
import { shallow, render, mount } from 'enzyme';
import i18n from './i18n';
import { withNamespaces } from '../src/withNamespaces';

describe('withNamespaces', () => {
  const TestElement = ({ t, lng }) => (
    <div>
      {t('key1')} - {lng}
    </div>
  );

  it('should render correct translation', () => {
    const HocElement = withNamespaces(['translation'], {})(TestElement);

    const wrapper = mount(<HocElement i18n={i18n} />);
    // console.log(wrapper.debug());
    expect(wrapper.contains(<div>test - en</div>)).toBe(true);
  });

  it('should bind / unbind', () => {
    const HocElement = withNamespaces(['translation'], {})(TestElement);

    const wrapper = mount(<HocElement i18n={i18n} />);
    // console.log(wrapper.debug());

    // has bound events
    expect(i18n.observers.languageChanged.length).toBe(2);
    expect(i18n.observers.loaded.length).toBe(2);

    // unbind after unmount
    wrapper.unmount();
    expect(i18n.observers.languageChanged.length).toBe(1);
    expect(i18n.observers.loaded.length).toBe(1);
  });
});

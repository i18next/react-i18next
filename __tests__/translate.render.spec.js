import React from 'react';
import { shallow, render, mount } from 'enzyme';
import i18n from './i18n';
import translate from '../src/translate';

const context = {
  i18n
};

describe('translate', () => {
  const TestElement = ({ t }) => {
    return (
      <div>{t('key1')}</div>
    );
  }

  it('should render three <Foo /> components', () => {
    const HocElement = translate(['translation'], {})(TestElement);

    const wrapper = mount(<HocElement i18n={i18n} />, context);
    // console.log(wrapper.debug());
    expect(wrapper.contains(<div>test</div>)).toBe(true);
  });
});

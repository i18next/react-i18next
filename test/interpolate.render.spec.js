import React from 'react';
import { shallow, render, mount } from 'enzyme';
import i18n from './i18n';
import translate from '../src/translate';
import Interpolate from '../src/interpolate';

const context = {
  i18n
};

describe('interpolate', () => {
  const TestElement = ({ t }) => {
    return (
      <Interpolate parent='p' i18nKey='interpolateKey' insert={<span>something</span>} up="uppercase" />
    );
  }

  it('should render correct interpolation', () => {
    const HocElement = translate(['translation'], {})(TestElement);

    const wrapper = mount(<HocElement />, { context });
    // console.log(wrapper.debug());
    expect(wrapper.contains(<p>add <span>something</span> {i18n.options.interpolation.format('uppercase', 'uppercase')}</p>)).toBe(true);
  });
});

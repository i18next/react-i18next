import React from 'react';
import { shallow, render, mount } from 'enzyme';
import i18n from './i18n';
import translate from '../src/translate';
import Interpolate from '../src/Interpolate';

describe('interpolate', () => {
  const TestElement = ({ t }) => {
    return (
      <Interpolate parent='p' i18nKey='interpolateKey' insert={<span>something</span>} up="uppercase" />
    );
  }

  it('should render correct interpolation', () => {
    const HocElement = translate(['translation'], {})(TestElement);

    const wrapper = mount(<HocElement i18n={i18n} />);
    // console.log(wrapper.debug());
    expect(wrapper.contains(<p>add <span>something</span> UPPERCASE</p>)).toBe(true);
  });
});

describe('interpolate dangerouslySetInnerHTML', () => {
  const TestElement = ({ t }) => {
    return (
      <Interpolate useDangerouslySetInnerHTML parent='p' i18nKey='interpolateKey2' insert={<span>something</span>} up="uppercase" />
    );
  }

  it('should render correct interpolation', () => {
    const HocElement = translate(['translation'], {})(TestElement);

    const wrapper = mount(<HocElement i18n={i18n} />);
    // console.log(wrapper.debug());
    expect(wrapper.contains(<p><span dangerouslySetInnerHTML={{ __html: '<strong>add</strong> ' }} /><span>something</span><span dangerouslySetInnerHTML={{ __html: ' '}} />UPPERCASE</p>)).toBe(true);
  });
});

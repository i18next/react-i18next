import React from 'react';
import { mount } from 'enzyme';
import i18n from './i18n';
import { Translation } from '../src/Translation';

jest.unmock('../src/Translation');

describe('Translation', () => {
  function TestComponent() {
    return <Translation>{t => <div>{t('key1')}</div>}</Translation>;
  }

  it('should render correct content', () => {
    const wrapper = mount(<TestComponent />);
    // console.log(wrapper.debug());
    expect(wrapper.contains(<div>test</div>)).toBe(true);
  });
});

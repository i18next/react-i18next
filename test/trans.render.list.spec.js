import React from 'react';
import { mount } from 'enzyme';
import './i18n';
import { Trans } from '../src/Trans';

describe('Trans should render nested components', () => {
  it('should render dynamic ul as components property', () => {
    const list = ['li1', 'li2'];

    const TestElement = () => (
      <Trans
        i18nKey="testTrans4KeyWithNestedComponent"
        components={[
          <ul>
            {list.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>,
        ]}
      />
    );
    const wrapper = mount(<TestElement />);

    expect(
      wrapper.contains(
        <ul>
          <li>li1</li>
          <li>li2</li>
        </ul>,
      ),
    ).toBe(true);
  });

  it('should render dynamic ul as components property when pass as a children', () => {
    const list = ['li1', 'li2'];

    const TestElement = () => (
      <Trans i18nKey="testTrans5KeyWithNestedComponent">
        My list:
        <ul>
          {list.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Trans>
    );
    const wrapper = mount(<TestElement />);
    expect(
      wrapper.contains(
        <ul>
          <li>li1</li>
          <li>li2</li>
        </ul>,
      ),
    ).toBe(true);
  });
});

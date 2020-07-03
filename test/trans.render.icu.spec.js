import React from 'react';
import { mount } from 'enzyme';
import './i18n';
import { Trans } from '../src/Trans';

describe('trans using no children but props - icu case', () => {
  const TestElement = () => (
    <Trans
      defaults="hello <0>{{what}}</0>"
      values={{ what: 'world' }}
      components={[<strong>univers</strong>]}
    />
  );
  it('should render translated string', () => {
    const wrapper = mount(<TestElement />);
    // console.log(wrapper.debug());
    expect(
      wrapper.contains(
        <div>
          hello <strong>world</strong>
        </div>,
      ),
    ).toBe(true);
  });
});

describe('trans using no children but props - nested case', () => {
  const TestElement = () => (
    <Trans
      defaults="<0>hello <1></1> {{what}}</0>"
      values={{ what: 'world' }}
      components={[
        <span>
          placeholder
          <br />
        </span>,
      ]}
    />
  );
  it('should render translated string', () => {
    const wrapper = mount(<TestElement />);
    // console.log(wrapper.debug());
    expect(
      wrapper.contains(
        <span>
          hello <br /> world
        </span>,
      ),
    ).toBe(true);
  });
});

describe('trans using no children but props - self closing case', () => {
  const TestElement = () => (
    <Trans defaults="hello <0/>{{what}}" values={{ what: 'world' }} components={[<br />]} />
  );
  it('should render translated string', () => {
    const wrapper = mount(<TestElement />);
    // console.log(wrapper.debug());
    expect(
      wrapper.contains(
        <div>
          hello <br />
          world
        </div>,
      ),
    ).toBe(true);
  });
});

describe('Trans should use value from translation', () => {
  it('should use value from translation if no data provided in component', () => {
    const TestElement = () => (
      <Trans
        i18nKey="testTrans5KeyWithValue"
        values={{
          testValue: 'dragonfly',
        }}
        components={[<span className="awesome-styles" />]}
      />
    );

    const wrapper = mount(<TestElement />);
    expect(wrapper.contains(<span className="awesome-styles">dragonfly</span>)).toBe(true);
  });

  it('should use value from translation if dummy data provided in component', () => {
    const TestElement = () => (
      <Trans
        i18nKey="testTrans5KeyWithValue"
        values={{
          testValue: 'dragonfly',
        }}
        components={[<span className="awesome-styles">test string</span>]}
      />
    );

    const wrapper = mount(<TestElement />);
    expect(wrapper.contains(<span className="awesome-styles">dragonfly</span>)).toBe(true);
  });
});

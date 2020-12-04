import React from 'react';
import { render, screen } from '@testing-library/react';
import './i18n';
import { Trans } from '../src/Trans';

describe('trans using no children but props - icu case', () => {
  const TestElement = () => (
    <Trans
      defaults="hello <0>{{what}}</0>"
      values={{ what: 'world' }}
      components={[<strong>universe</strong>]}
    />
  );
  it('should render translated string', () => {
    const wrapper = render(<TestElement />);
    // screen.debug()

    expect(wrapper.container).toContainHTML('hello <strong>world</strong>');
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
    const wrapper = render(<TestElement />);
    // screen.debug()

    expect(wrapper.container).toContainHTML('hello <br> world');
  });
});

describe('trans using no children but props - self closing case', () => {
  const TestElement = () => (
    <Trans defaults="hello <0/>{{what}}" values={{ what: 'world' }} components={[<br />]} />
  );
  it('should render translated string', () => {
    const wrapper = render(<TestElement />);
    // screen.debug()
    expect(wrapper.container).toContainHTML('hello <br>world');
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

    const wrapper = render(<TestElement />);
    expect(wrapper.container).toContainHTML('<span class="awesome-styles">dragonfly</span>');
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

    const wrapper = render(<TestElement />);
    expect(wrapper.container).toContainHTML('<span class="awesome-styles">dragonfly</span>');
  });
});

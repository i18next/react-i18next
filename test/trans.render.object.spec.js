import React from 'react';
import { mount } from 'enzyme';
import './i18n';
import { Trans } from '../src/Trans';

describe('trans using no children but components (object) - base case using array not object', () => {
  const TestElement = () => (
    <Trans
      defaults="hello <0>beautiful</0> <1>{{what}}</1>"
      values={{ what: 'world' }}
      components={[<i>just dummy</i>, <strong>univers</strong>]}
    />
  );
  it('should render translated string', () => {
    const wrapper = mount(<TestElement />);
    // console.log(wrapper.debug());
    expect(
      wrapper.contains(
        <div>
          hello <i>beautiful</i> <strong>world</strong>
        </div>,
      ),
    ).toBe(true);
  });
});

describe('trans using no children but components (object) - using index', () => {
  const TestElement = () => (
    <Trans
      defaults="hello <1>beautiful</1> <2>{{what}}</2>"
      values={{ what: 'world' }}
      components={{ 1: <i>just dummy</i>, 2: <strong>univers</strong> }}
    />
  );
  it('should render translated string', () => {
    const wrapper = mount(<TestElement />);
    // console.log(wrapper.debug());
    expect(
      wrapper.contains(
        <div>
          hello <i>beautiful</i> <strong>world</strong>
        </div>,
      ),
    ).toBe(true);
  });
});

describe('trans using no children but components (object) - using names', () => {
  const TestElement = () => (
    <Trans
      defaults="hello <italic>beautiful</italic> <bold>{{what}}</bold>"
      values={{ what: 'world' }}
      components={{ italic: <i>just dummy</i>, bold: <strong>univers</strong> }}
    />
  );
  it('should render translated string', () => {
    const wrapper = mount(<TestElement />);
    // console.log(wrapper.debug());
    expect(
      wrapper.contains(
        <div>
          hello <i>beautiful</i> <strong>world</strong>
        </div>,
      ),
    ).toBe(true);
  });
});

describe('trans using no children but components (object) - use more than once', () => {
  const TestElement = () => (
    <Trans
      defaults="hello<list><listitem>A</listitem>,<listitem>B</listitem>and<listitem>C</listitem></list>"
      components={{ list: <ul>a</ul>, listitem: <li>b</li> }}
    />
  );
  it('should render translated string', () => {
    const wrapper = mount(<TestElement />);
    // console.log(wrapper.debug());
    expect(
      wrapper.contains(
        <div>
          hello
          <ul>
            <li>A</li>,<li>B</li>
            and
            <li>C</li>
          </ul>
        </div>,
      ),
    ).toBe(true);
  });
});

describe('trans using no children but components (object) - use more than once (empty)', () => {
  const TestElement = () => (
    <Trans
      defaults="hello<list><listitem>A</listitem>,<listitem>B</listitem>and<listitem>C</listitem></list>"
      components={{ list: <ul />, listitem: <li /> }}
    />
  );
  it('should render translated string', () => {
    const wrapper = mount(<TestElement />);
    // console.log(wrapper.debug());
    expect(
      wrapper.contains(
        <div>
          hello
          <ul>
            <li>A</li>,<li>B</li>
            and
            <li>C</li>
          </ul>
        </div>,
      ),
    ).toBe(true);
  });
});

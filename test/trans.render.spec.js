import React from 'react';
import { shallow, render, mount } from 'enzyme';
import i18n from './i18n';
import translate from '../src/translate';
import Trans from '../src/trans';

const context = {
  i18n
};

function Link({ to, children }) {
  return <a href={to}>{children}</a>;
}

describe('trans simple', () => {
  const TestElement = ({ t, parent }) => {
    const count = 10;
    const name = "Jan";
    return (
      <Trans i18nKey="transTest1" parent={parent}>
        Open <Link to="/msgs">here</Link>.
      </Trans>
    );
  }

  it('should render correct content', () => {
    const HocElement = translate(['translation'], {})(TestElement);

    const wrapper = mount(<HocElement />, { context });
    // console.log(wrapper.debug());
    expect(wrapper.contains(
      <div>
        Go <Link to="/msgs">there</Link>.
      </div>
    )).toBe(true);
  });

  it('can use a different parent element', () => {
    const HocElement = translate(['translation'], {})(TestElement);

    const wrapper = mount(<HocElement parent="span" />, { context });
    expect(wrapper.contains(
      <span>
        Go <Link to="/msgs">there</Link>.
      </span>
    )).toBe(true);
  });
});

describe('trans testTransKey1 singular', () => {
  const TestElement = ({ t }) => {
    const numOfItems = 1;
    return (
      <Trans i18nKey='testTransKey1' count={numOfItems}>
       {{numOfItems}} items matched.
      </Trans>
    );
  }

  it('should render correct content', () => {
    const HocElement = translate(['translation'], {})(TestElement);

    const wrapper = mount(<HocElement />, { context });
    // console.log(wrapper.debug());
    expect(wrapper.contains(
      <div>
        1 item matched.
      </div>
    )).toBe(true);
  });
});

describe('trans testTransKey1 plural', () => {
  const TestElement = ({ t }) => {
    const numOfItems = 10;
    return (
      <Trans i18nKey='testTransKey1' count={numOfItems}>
       {{numOfItems}} items matched.
      </Trans>
    );
  }

  it('should render correct content', () => {
    const HocElement = translate(['translation'], {})(TestElement);

    const wrapper = mount(<HocElement />, { context });
    // console.log(wrapper.debug());
    expect(wrapper.contains(
      <div>
        10 items matched.
      </div>
    )).toBe(true);
  });
});

describe('trans testTransKey2', () => {
  const TestElement = ({ t }) => {
    const numOfItems = 10;
    return (
      <Trans i18nKey='testTransKey2' count={numOfItems}>
        <span className='matchCount'>{{numOfItems}}</span> items matched.
      </Trans>
    );
  }

  it('should render correct content', () => {
    const HocElement = translate(['translation'], {})(TestElement);

    const wrapper = mount(<HocElement />, { context });
    // console.log(wrapper.debug());
    expect(wrapper.contains(
      <div>
        <span className='matchCount'>10</span> items matched.
      </div>
    )).toBe(true);
  });
});

describe('trans testTransKey3', () => {
  const TestElement = ({ t }) => {
    const numOfItems = 10;
    return (
      <Trans i18nKey='testTransKey3' count={numOfItems}>
        Result: <span className='matchCount'>{{numOfItems}}</span> items matched.
      </Trans>
    );
  }

  it('should render correct content', () => {
    const HocElement = translate(['translation'], {})(TestElement);

    const wrapper = mount(<HocElement />, { context });
    // console.log(wrapper.debug());
    expect(wrapper.contains(
      <div>
        Result: <span className='matchCount'>10</span> items matched.
      </div>
    )).toBe(true);
  });
});


describe('trans complex', () => {
  const TestElement = ({ t }) => {
    const count = 10;
    const name = "Jan";
    return (
      <Trans i18nKey="transTest2" count={count}>
        Hello <strong>{{name}}</strong>, you have {{count}} message. Open <Link to="/msgs">here</Link>.
      </Trans>
    );
  }

  it('should render correct content', () => {
    const HocElement = translate(['translation'], {})(TestElement);

    const wrapper = mount(<HocElement />, { context });
    // console.log(wrapper.debug());
    expect(wrapper.contains(
      <div>
        Hello <strong>Jan</strong>, you have 10 messages. Open <Link to="/msgs">here</Link>.
      </div>
    )).toBe(true);
  });
});

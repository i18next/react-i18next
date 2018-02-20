import React from 'react';
import { shallow, render, mount } from 'enzyme';
import i18n from './i18n';
import translate from '../src/translate';
import Trans from '../src/Trans';
import PropTypes from "prop-types";

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

  describe('trans simple - setting back default behaviour of no parent', () => {
    // we set in ./i18n react.defaultTransParent so all tests run backwards compatible
    // and this tests new default bahaviour of just returning children
    const TestElement = ({ t, parent }) => {
      const count = 10;
      const name = "Jan";
      return (
        <Trans i18nKey="transTest1_noParent" parent={false}>
          <span>Open <Link to="/msgs">here</Link>.</span>
        </Trans>
      );
    }

    it('should render correct content', () => {
      const HocElement = translate(['translation'], {})(TestElement);

      const wrapper = mount(<HocElement />, { context });
      // console.log(wrapper.debug());
      expect(wrapper.contains(
        <span>Go <Link to="/msgs">there</Link>.</span>
      )).toBe(true);
    });
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

  it('uses the i18n.t function if t is not in the context nor specified using props', () => {
    const wrapper = mount(<TestElement />, { context, childContextTypes: { i18n: PropTypes.object.isRequired } });

    expect(wrapper.contains((
      <div>
        Go <Link to="/msgs">there</Link>.
      </div>)
    )).toBe(true);
  });
});

describe('trans simple using ns prop', () => {
  const TestElement = ({ t, parent }) => {
    return (
      <Trans i18nKey="transTest1" ns="other" parent={parent}>
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
        Another go <Link to="/msgs">there</Link>.
      </div>
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

describe('trans with t as prop', () => {
  const TestElement = ({ t, cb }) => {
    const customT = (...args) => {
      if (cb) cb();
      return t(...args);
    };
    return (
      <Trans i18nKey="transTest1" t={customT}>
        Open <Link to="/msgs">here</Link>.
      </Trans>
    );
  };

  it('should use props t', () => {
    let usedCustomT = false;
    const cb = () => { usedCustomT = true; };

    const HocElement = translate(['translation'], {})(TestElement);

    mount(<HocElement cb={cb} />, { context });
    expect(usedCustomT).toBe(true);
  });

  it('should not pass t to HTML element', () => {
    const HocElement = translate(['translation'], {})(TestElement);

    const wrapper = mount(<HocElement />, { context });
    expect(wrapper.contains(
      <div>
        Go <Link to="/msgs">there</Link>.
      </div>
    )).toBe(true);
  });

});

describe('trans with empty content', () => {
  const TestElement = ({ t, cb }) => {
    return <Trans>{""}</Trans>;
  };
  it('should render an empty string', () => {
    const HocElement = translate(['translation'], {})(TestElement);
    const wrapper = mount(<HocElement />, { context });
    expect(wrapper.contains(<div></div>)).toBe(true);
  });
});

describe('trans with only content from translation file - no children', () => {
  const TestElement = ({ t, cb }) => {
    return <Trans i18nKey="key1"></Trans>;
  };
  it('should render translated string', () => {
    const HocElement = translate(['translation'], {})(TestElement);
    const wrapper = mount(<HocElement />, { context });
    expect(wrapper.contains(<div>test</div>)).toBe(true);
  });
});

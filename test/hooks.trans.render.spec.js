import React from 'react';
import { shallow, render, mount } from 'enzyme';
import ifReact from 'enzyme-adapter-react-helper/build/ifReact';
import i18n from './i18n';
import { withTranslation } from '../src/hooks/withTranslation';
import { Trans } from '../src/hooks/Trans';


function Link({ to, children }) {
  return <a href={to}>{children}</a>;
}

describe('trans simple', () => {
  const TestElement = ({ t, parent }) => {
    const count = 10;
    const name = 'Jan';
    return (
      <Trans i18nKey="transTest1" parent={parent}>
        Open <Link to="/msgs">here</Link>.
      </Trans>
    );
  };

  it('should render correct content', () => {
    const wrapper = mount(<TestElement />);
    // console.log(wrapper.debug());
    expect(
      wrapper.contains(
        <div>
          Go <Link to="/msgs">there</Link>.
        </div>
      )
    ).toBe(true);
  });

  // ifReact('>= 16', describe, describe.skip)(
  //   'trans simple - setting back default behaviour of no parent',
  //   () => {
  //     // we set in ./i18n react.defaultTransParent so all tests run backwards compatible
  //     // and this tests new default bahaviour of just returning children
  //     const TestElement = ({ t, parent }) => {
  //       const count = 10;
  //       const name = 'Jan';
  //       return (
  //         <Trans i18nKey="transTest1_noParent" parent={false}>
  //           <span>
  //             Open <Link to="/msgs">here</Link>.
  //           </span>
  //         </Trans>
  //       );
  //     };

  //     it('should render correct content', () => {
  //       const wrapper = mount(<TestElement />);
  //       // console.log(wrapper.debug());
  //       expect(
  //         wrapper.contains(
  //           <span>
  //             Go <Link to="/msgs">there</Link>.
  //           </span>
  //         )
  //       ).toBe(true);
  //     });
  //   }
  // );

  it('can use a different parent element', () => {
    const wrapper = mount(<TestElement parent="span" />);
    expect(
      wrapper.contains(
        <span>
          Go <Link to="/msgs">there</Link>.
        </span>
      )
    ).toBe(true);
  });
});

describe('trans simple using ns prop', () => {
  const TestElement = ({ t, parent }) => (
    <Trans i18nKey="transTest1" ns="other" parent={parent}>
      Open <Link to="/msgs">here</Link>.
    </Trans>
  );

  it('should render correct content', () => {
    const wrapper = mount(<TestElement />);
    // console.log(wrapper.debug());
    expect(
      wrapper.contains(
        <div>
          Another go <Link to="/msgs">there</Link>.
        </div>
      )
    ).toBe(true);
  });
});

describe('trans simple with custom html tag', () => {
  const TestElement = ({ t, parent }) => (
    <Trans i18nKey="transTest1_customHtml" parent={parent}>
      Open <Link to="/msgs">here</Link>.
    </Trans>
  );

  it('should skip custom html tags', () => {
    const wrapper = mount(<TestElement />);
    // console.log(wrapper.debug());
    expect(
      wrapper.contains(
        <div>
          Go <Link to="/msgs">there</Link>.
        </div>
      )
    ).toBe(true);
  });
});

describe('trans testTransKey1 singular', () => {
  const TestElement = ({ t }) => {
    const numOfItems = 1;
    return (
      <Trans i18nKey="testTransKey1" count={numOfItems}>
        {{ numOfItems }} items matched.
      </Trans>
    );
  };

  it('should render correct content', () => {
    const wrapper = mount(<TestElement />);
    // console.log(wrapper.debug());
    expect(wrapper.contains(<div>1 item matched.</div>)).toBe(true);
  });
});

describe('trans testTransKey1 plural', () => {
  const TestElement = ({ t }) => {
    const numOfItems = 10;
    return (
      <Trans i18nKey="testTransKey1" count={numOfItems}>
        {{ numOfItems }} items matched.
      </Trans>
    );
  };

  it('should render correct content', () => {
    const wrapper = mount(<TestElement />);
    // console.log(wrapper.debug());
    expect(wrapper.contains(<div>10 items matched.</div>)).toBe(true);
  });
});

describe('trans testTransKey2', () => {
  const TestElement = ({ t }) => {
    const numOfItems = 10;
    return (
      <Trans i18nKey="testTransKey2" count={numOfItems}>
        <span className="matchCount">{{ numOfItems }}</span> items matched.
      </Trans>
    );
  };

  it('should render correct content', () => {
    const wrapper = mount(<TestElement />);
    // console.log(wrapper.debug());
    expect(
      wrapper.contains(
        <div>
          <span className="matchCount">10</span> items matched.
        </div>
      )
    ).toBe(true);
  });
});

describe('trans testTransKey3', () => {
  const TestElement = ({ t }) => {
    const numOfItems = 10;
    return (
      <Trans i18nKey="testTransKey3" count={numOfItems}>
        Result: <span className="matchCount">{{ numOfItems }}</span> items matched.
      </Trans>
    );
  };

  it('should render correct content', () => {
    const wrapper = mount(<TestElement />);
    // console.log(wrapper.debug());
    expect(
      wrapper.contains(
        <div>
          Result: <span className="matchCount">10</span> items matched.
        </div>
      )
    ).toBe(true);
  });
});

describe('trans complex', () => {
  const TestElement = ({ t }) => {
    const count = 10;
    const name = 'Jan';
    // prettier-ignore
    return (
      <Trans i18nKey="transTest2" count={count}>
        Hello <strong>{{ name }}</strong>, you have {{ count }} message. Open <Link to="/msgs">here</Link>.
      </Trans>
    );
  };

  it('should render correct content', () => {
    const wrapper = mount(<TestElement />);
    // console.warn(wrapper.debug());
    expect(
      wrapper.contains(
        <div>
          Hello <strong>Jan</strong>, you have 10 messages. Open <Link to="/msgs">here</Link>.
        </div>
      )
    ).toBe(true);
  });
});

describe('trans complex v2 no extra pseudo elements for interpolation', () => {
  const TestElement = ({ t }) => {
    const count = 10;
    const name = 'Jan';
    // prettier-ignore
    return (
      <Trans i18nKey="transTest2InV2" count={count}>
        Hello <strong>{{ name }}</strong>, you have {{ count }} message. Open <Link to="/msgs">here</Link>.
      </Trans>
    );
  };

  it('should render correct content', () => {
    const wrapper = mount(<TestElement />);
    // console.warn(wrapper.debug());
    expect(
      wrapper.contains(
        <div>
          Hello <strong>Jan</strong>, you have 10 messages. Open <Link to="/msgs">here</Link>.
        </div>
      )
    ).toBe(true);
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
    const cb = () => {
      usedCustomT = true;
    };

    const HocElement = withTranslation(['translation'], {})(TestElement);

    mount(<HocElement cb={cb} />);
    expect(usedCustomT).toBe(true);
  });

  it('should not pass t to HTML element', () => {
    const HocElement = withTranslation(['translation'], {})(TestElement);

    const wrapper = mount(<HocElement i18n={i18n} />);
    expect(
      wrapper.contains(
        <div>
          Go <Link to="/msgs">there</Link>.
        </div>
      )
    ).toBe(true);
  });
});

describe('trans with empty content', () => {
  const TestElement = () => <Trans />;
  it('should render an empty string', () => {
    const wrapper = mount(<TestElement />);
    expect(wrapper.contains(<div />)).toBe(true);
  });
});

describe('trans with only content from translation file - no children', () => {
  const TestElement = () => <Trans i18nKey="key1" />;
  it('should render translated string', () => {
    const wrapper = mount(<TestElement />);
    expect(wrapper.contains(<div>test</div>)).toBe(true);
  });
});

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
        </div>
      )
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
        </span>
      )
    ).toBe(true);
  });
});

describe('trans should not break on invalid node from translations', () => {
  const TestElement = () => <Trans i18nKey="testInvalidHtml" />;
  it('should render translated string', () => {
    const wrapper = mount(<TestElement />);
    // console.log(wrapper.debug());
    expect(wrapper.contains(<div>&lt;hello</div>)).toBe(true);
  });
});

describe('trans should not break on invalid node from translations - part2', () => {
  const TestElement = () => <Trans i18nKey="testInvalidHtml2" />;
  it('should render translated string', () => {
    const wrapper = mount(<TestElement />);
    // console.log(wrapper.debug());
    expect(wrapper.contains(<div>&lt;hello&gt;</div>)).toBe(true);
  });
});

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import i18n from './i18n';
import { withTranslation } from '../src/withTranslation';
import { Trans } from '../src/Trans';

function Link({ to, children }) {
  return <a href={to}>{children}</a>;
}

describe('trans simple', () => {
  afterEach(() => {
    cleanup();
  });

  function TestComponent({ parent }) {
    return (
      <Trans i18nKey="transTest1" parent={parent}>
        Open <Link to="/msgs">here</Link>.
      </Trans>
    );
  }

  it('should render correct content', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Go 
        <a
          href="/msgs"
        >
          there
        </a>
        .
      </div>
    `);
  });

  it('can use a different parent element', () => {
    const { container } = render(<TestComponent parent="span" />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <span>
        Go 
        <a
          href="/msgs"
        >
          there
        </a>
        .
      </span>
    `);
  });
});

describe('trans simple using ns prop', () => {
  function TestComponent({ parent }) {
    return (
      <Trans i18nKey="transTest1" ns="other" parent={parent}>
        Open <Link to="/msgs">here</Link>.
      </Trans>
    );
  }

  it('should render correct content', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Another go 
        <a
          href="/msgs"
        >
          there
        </a>
        .
      </div>
    `);
  });
});

describe('trans using translation prop', () => {
  function TestComponent({ parent }) {
    return (
      <Trans i18nKey="transTest3" parent={parent}>
        {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
        <a />
      </Trans>
    );
  }

  it('should render correct content', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Result should be a clickable link 
        <a
          href="https://www.google.com"
        >
          Google
        </a>
      </div>
    `);
  });
});

describe('trans overwrites translation prop', () => {
  function TestComponent({ parent }) {
    return (
      <Trans i18nKey="transTest3_overwrite" parent={parent}>
        {/* eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label */}
        <a href="https://www.bing.com" />
      </Trans>
    );
  }

  it('should render correct content', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Result should be a clickable link 
        <a
          href="https://www.bing.com"
        >
          Google
        </a>
      </div>
    `);
  });
});

describe('trans simple with custom html tag', () => {
  function TestComponent({ parent }) {
    return (
      <Trans i18nKey="transTest1_customHtml" parent={parent}>
        Open <Link to="/msgs">here</Link>.
      </Trans>
    );
  }

  function TestComponent2({ parent }) {
    return <Trans i18nKey="transTest1_customHtml2" parent={parent} />;
  }

  function TestComponent3({ parent }) {
    return <Trans i18nKey="transTest1_customHtml3" parent={parent} />;
  }

  it('should not skip custom html tags', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        <strong>
          Go
        </strong>
         
        <br />
        <a
          href="/msgs"
        >
          there
        </a>
        .
      </div>
    `);
  });

  it('should not skip custom html tags - empty node', () => {
    const { container } = render(<TestComponent2 />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        <strong>
          Go
        </strong>
         
        <br />
         there.
      </div>
    `);
  });

  it('should skip custom html tags not listed in transKeepBasicHtmlNodesFor', () => {
    const { container } = render(<TestComponent3 />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        <strong>
          Go
        </strong>
        &lt;video /&gt;
        &lt;script&gt;console.warn("test")&lt;/script&gt;
         there.
      </div>
    `);
  });
});

describe('trans bracketNotation', () => {
  function TestComponent() {
    const numOfItems = 4;
    return <Trans i18nKey="bracketNotation" count={numOfItems} />;
  }

  it('should render correct content', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        4
      </div>
    `);
  });
});

describe('trans otherNotation', () => {
  function TestComponent() {
    const numOfItems = 4;
    return <Trans i18nKey="otherNotation" count={numOfItems} />;
  }

  it('should render correct content', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        #$?count?$#
      </div>
    `);
  });
});

describe('trans testTransKey1 singular', () => {
  function TestComponent() {
    const numOfItems = 1;
    return (
      <Trans i18nKey="testTransKey1" count={numOfItems}>
        {{ numOfItems }} items matched.
      </Trans>
    );
  }

  it('should render correct content', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        1
         item matched.
      </div>
    `);
  });
});

describe('trans testTransKey1 plural', () => {
  function TestComponent() {
    const numOfItems = 10;
    return (
      <Trans i18nKey="testTransKey1" count={numOfItems}>
        {{ numOfItems }} items matched.
      </Trans>
    );
  }

  it('should render correct content', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        10
         items matched.
      </div>
    `);
  });
});

describe('trans testTransKey2', () => {
  function TestComponent() {
    const numOfItems = 10;
    return (
      <Trans i18nKey="testTransKey2" count={numOfItems}>
        <span className="matchCount">{{ numOfItems }}</span> items matched.
      </Trans>
    );
  }

  it('should render correct content', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        <span
          class="matchCount"
        >
          10
        </span>
         items matched.
      </div>
    `);
  });
});

describe('trans testTransKey3', () => {
  function TestComponent() {
    const numOfItems = 10;
    return (
      <Trans i18nKey="testTransKey3" count={numOfItems}>
        Result: <span className="matchCount">{{ numOfItems }}</span> items matched.
      </Trans>
    );
  }

  it('should render correct content', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Result: 
        <span
          class="matchCount"
        >
          10
        </span>
         items matched.
      </div>
    `);
  });
});

describe('trans complex', () => {
  function TestComponent() {
    const count = 10;
    const name = 'Jan';
    // prettier-ignore
    return (
      <Trans i18nKey="transTest2" count={count}>
        Hello <strong>{{ name }}</strong>, you have {{ count }} message. Open <Link to="/msgs">here</Link>.
      </Trans>
    );
  }

  it('should render correct content', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Hello 
        <strong>
          Jan
        </strong>
        , you have 
        10
         messages. Open 
        <a
          href="/msgs"
        >
          here
        </a>
        .
      </div>
    `);
  });
});

describe('trans complex - count only in props', () => {
  function TestComponent() {
    const count = 10;
    const name = 'Jan';
    // prettier-ignore
    return (
      <Trans i18nKey="transTest2" count={count}>
        Hello <strong>{{ name }}</strong>, you have {{n: count}} message. Open <Link to="/msgs">here</Link>.
      </Trans>
    );
  }

  it('should render correct content', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Hello 
        <strong>
          Jan
        </strong>
        , you have 
        10
         messages. Open 
        <a
          href="/msgs"
        >
          here
        </a>
        .
      </div>
    `);
  });
});

describe('trans complex v2 no extra pseudo elements for interpolation', () => {
  function TestComponent() {
    const count = 10;
    const name = 'Jan';
    // prettier-ignore
    return (
      <Trans i18nKey="transTest2InV2" count={count}>
        Hello <strong>{{ name }}</strong>, you have {{ count }} message. Open <Link to="/msgs">here</Link>.
      </Trans>
    );
  }

  it('should render correct content', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Hello 
        <strong>
          Jan
        </strong>
        , you have 10 messages. Open 
        <a
          href="/msgs"
        >
          here
        </a>
        .
      </div>
    `);
  });
});

describe('trans with t as prop', () => {
  function TestComponent({ t, cb }) {
    const customT = (...args) => {
      if (cb) cb();
      return t(...args);
    };
    return (
      <Trans i18nKey="transTest1" t={customT}>
        Open <Link to="/msgs">here</Link>.
      </Trans>
    );
  }

  it('should use props t', () => {
    let usedCustomT = false;
    const cb = () => {
      usedCustomT = true;
    };

    const HocElement = withTranslation(['translation'], {})(TestComponent);

    render(<HocElement cb={cb} />);
    expect(usedCustomT).toBe(true);
  });

  it('should not pass t to HTML element', () => {
    const HocElement = withTranslation(['translation'], {})(TestComponent);

    const { container } = render(<HocElement i18n={i18n} />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Go 
        <a
          href="/msgs"
        >
          there
        </a>
        .
      </div>
    `);
  });
});

describe('trans with empty content', () => {
  function TestComponent() {
    return <Trans />;
  }
  it('should render an empty string', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`<div />`);
  });
});

describe('trans with only content from translation file - no children', () => {
  function TestComponent() {
    return <Trans i18nKey="key1" />;
  }
  it('should render translated string', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        test
      </div>
    `);
  });
});

describe('trans with only html content from translation file - no children', () => {
  function TestComponent() {
    return <Trans i18nKey="transTest1_customHtml2" />;
  }
  it('should render translated string', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        <strong>
          Go
        </strong>
         
        <br />
         there.
      </div>
    `);
  });
});

describe('trans should not break on invalid node from translations', () => {
  function TestComponent() {
    return <Trans i18nKey="testInvalidHtml" />;
  }
  it('should render translated string', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        &lt;hello
      </div>
    `);
  });
});

describe('trans should not break on invalid node from translations - part2', () => {
  function TestComponent() {
    return <Trans i18nKey="testInvalidHtml2" />;
  }
  it('should render translated string', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        &lt;hello&gt;
      </div>
    `);
  });
});

describe('trans should work with misleading overloaded empty elements in components', () => {
  function TestComponent() {
    return (
      <Trans
        i18nKey="someKey"
        defaults="Hi {{ firstName }},<br/>and <bold>welcome</bold>"
        values={{ firstName: 'Fritz' }}
        components={{ br: <br />, bold: <strong /> }}
      />
    );
  }
  it('should render translated string', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Hi Fritz,
        <br />
        and 
        <strong>
          welcome
        </strong>
      </div>
    `);
  });
});

describe('trans should work with defaultVariables', () => {
  function TestComponent() {
    return <Trans i18nKey="interpolateKeyWithDefaultVariables" />;
  }
  it('should render translated string', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        add first SECOND
      </div>
    `);
  });
});

describe('trans should work with lowercase elements in components', () => {
  function TestComponent() {
    return (
      <Trans
        i18nKey="someKeyWithLowercaseComp"
        defaults="click <whatever>here</whatever> for more"
        components={{ whatever: <a href="/foo">dummy</a> }}
      />
    );
  }
  it('should render translated string', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        click 
        <a
          href="/foo"
        >
          here
        </a>
         for more
      </div>
    `);
  });
});

describe('trans should work with uppercase elements in components', () => {
  function TestComponent() {
    return (
      <Trans
        i18nKey="someKeyWithUppercaseComp"
        defaults="click <Link>here</Link> for more"
        components={{ Link: <a href="/foo">dummy</a> }}
      />
    );
  }
  it('should render translated string', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        click 
        <a
          href="/foo"
        >
          here
        </a>
         for more
      </div>
    `);
  });
});

describe('trans should work with selfclosing elements in components', () => {
  function TestComponent() {
    return (
      <Trans
        i18nKey="transTestWithSelfClosing"
        components={{
          component: <div>These children will be preserved</div>,
        }}
      />
    );
  }
  it('should render translated string', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        interpolated component: 
        <div>
          These children will be preserved
        </div>
      </div>
    `);
  });
});

describe('trans should work with self closing elements with react components', () => {
  function Component({ children }) {
    return <div>{children}</div>;
  }
  it('should render component children', () => {
    const { container } = render(
      <Trans
        i18nKey="transTestWithSelfClosing"
        components={{
          component: <Component>These children will be preserved</Component>,
        }}
      />,
    );
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        interpolated component: 
        <div>
          These children will be preserved
        </div>
      </div>
    `);
  });
  it('should render Link component children', () => {
    const { container } = render(
      <Trans
        i18nKey="transTestWithSelfClosing"
        components={{
          component: <Link to="#">These children will be preserved</Link>,
        }}
      />,
    );
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        interpolated component: 
        <a
          href="#"
        >
          These children will be preserved
        </a>
      </div>
    `);
  });
  it('should render anchor tag children', () => {
    const { container } = render(
      <Trans
        i18nKey="transTestWithSelfClosing"
        components={{
          component: <a href="#">These children will be preserved</a>,
        }}
      />,
    );
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        interpolated component: 
        <a
          href="#"
        >
          These children will be preserved
        </a>
      </div>
    `);
  });
});

describe('trans with null child', () => {
  function TestComponent() {
    return (
      <Trans i18nKey="transTest1">
        Open <Link to="/msgs">here</Link>.{null}
      </Trans>
    );
  }

  it('should ignore the null child and render correct content', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Go 
        <a
          href="/msgs"
        >
          there
        </a>
        .
      </div>
    `);
  });
});

describe('trans with wrapTextNodes', () => {
  let orgValue;
  beforeAll(() => {
    orgValue = i18n.options.react.transWrapTextNodes;
    i18n.options.react.transWrapTextNodes = 'span';
  });
  afterAll(() => {
    i18n.options.react.transWrapTextNodes = orgValue;
  });

  function TestComponent() {
    return (
      <Trans i18nKey="transTest1">
        Open <Link to="/msgs">here</Link>.
      </Trans>
    );
  }

  it('should wrap text nodes accordingly', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        <span>
          Go 
        </span>
        <a
          href="/msgs"
        >
          <span>
            there
          </span>
        </a>
        <span>
          .
        </span>
      </div>
    `);
  });
});

describe('trans does ignore user defined values when parsing', () => {
  function TestComponent({ value }) {
    return (
      <Trans>
        This is <strong>just</strong> some {{ value }} text
      </Trans>
    );
  }

  it('should escape value with angle brackets', () => {
    const { container } = render(<TestComponent value="<weird>" />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        This is 
        <strong>
          just
        </strong>
         some &lt;weird&gt; text
      </div>
    `);
  });
});

describe('trans should allow escaped html', () => {
  function TestComponent() {
    return (
      <Trans i18nKey="transTestEscapedHtml" components={[<Link to="/msgs" />]} shouldUnescape />
    );
  }

  it('should unescape &lt; &nbsp; &amp; &gt; to < SPACE & >', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Escaped html should unescape correctly 
        <a
          href="/msgs"
        >
          &lt; &&gt;
        </a>
        .
      </div>
    `);
  });
});

describe('trans with custom unescape', () => {
  let orgValue;
  beforeAll(() => {
    orgValue = i18n.options.react.unescape;
    i18n.options.react.unescape = (text) => text.replace('&shy;', '\u00AD');
  });

  afterAll(() => {
    i18n.options.react.unescape = orgValue;
  });

  it('should allow unescape override', () => {
    function TestComponent() {
      return (
        <Trans
          i18nKey="transTestCustomUnescape"
          components={[<Link to="/msgs" />]}
          shouldUnescape
        />
      );
    }
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Text should be passed through custom unescape 
        <a
          href="/msgs"
        >
          \u00AD
        </a>
      </div>
    `);
  });

  it('should allow unescape override again', () => {
    function TestComponent() {
      return <Trans i18nKey="transTestCustomUnescapeSecond" shouldUnescape />;
    }
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Vertrauens\u00ADkennwert
      </div>
    `);
  });
});

describe('trans with context via tOptions', () => {
  const tOptions = { context: 'home' };
  function TestComponent({ parent }) {
    return (
      <Trans i18nKey="testTransWithCtx" tOptions={tOptions} parent={parent}>
        Open <Link to="/msgs">here</Link>.
      </Trans>
    );
  }

  it('should render correct content', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Go 
        <a
          href="/msgs"
        >
          home
        </a>
        .
      </div>
    `);
    expect(tOptions).to.have.property('context', 'home');
  });
});

describe('trans with context property', () => {
  function TestComponent({ parent }) {
    return (
      <Trans i18nKey="testTransWithCtx" context="home" parent={parent}>
        Open <Link to="/msgs">here</Link>.
      </Trans>
    );
  }

  it('should render correct content', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Go 
        <a
          href="/msgs"
        >
          home
        </a>
        .
      </div>
    `);
  });
});

describe('trans with formatting', () => {
  function TestComponent({ parent }) {
    return (
      <>
        <Trans parent={parent} i18nKey="trans-key-with-generic-var" values={{ foo: 1234 }} />
        <Trans parent={parent} i18nKey="trans-key-with-number-var" values={{ foo: 1234 }} />
        <Trans parent={parent} i18nKey="trans-key-with-number-var">
          {{ foo: 1234 }}
        </Trans>
      </>
    );
  }

  it('should render correct content', () => {
    const { container } = render(<TestComponent />);
    expect(container.childNodes[0]).toMatchInlineSnapshot(`
      <div>
        Value as is: 1234
      </div>
    `);
    expect(container.childNodes[1]).toMatchInlineSnapshot(`
      <div>
        Treat value as number: 1234
      </div>
    `);
    expect(container.childNodes[2]).toMatchInlineSnapshot(`
      <div>
        Treat value as number: 1234
      </div>
    `);
  });
});

describe('trans with formatting with alwaysFormat', () => {
  let newI18n;

  beforeEach(() => {
    newI18n = i18n.createInstance();
    newI18n.init({
      interpolation: {
        alwaysFormat: true,
        escapeValue: false,
        format: (value) => `(formatted ${value})`,
      },
    });
  });

  function TestComponent({ parent }) {
    const name = 'Fritz';
    return (
      <Trans parent={parent} i18n={newI18n} count={3}>
        number: {'{{count, INTEGER}}'}
        <br />
        name: {{ name }}
      </Trans>
    );
  }

  it('should render correct content', () => {
    const { container } = render(<TestComponent />);
    expect(container).toMatchInlineSnapshot(`
      <div>
        number: (formatted 3)
        <br />
        name: (formatted Fritz)
      </div>
    `);
  });
});

describe('trans with undefined context property', () => {
  function TestComponent({ parent }) {
    return (
      <Trans i18nKey="testTransWithCtx" context={undefined} parent={parent}>
        Open <Link to="/msgs">here</Link>.
      </Trans>
    );
  }

  it('should render correct content', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Go 
        <a
          href="/msgs"
        >
          there
        </a>
        .
      </div>
    `);
  });
});

describe('trans with context property but no children', () => {
  function TestComponent({ parent }) {
    return <Trans i18nKey="testTransNoChildrenWithCtx" context="home" parent={parent} />;
  }

  it('should render correct content', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Go to Switzerland.
      </div>
    `);
  });
});

describe('trans with undefined context property but no children', () => {
  function TestComponent({ parent }) {
    return <Trans i18nKey="testTransNoChildrenWithCtx" context={undefined} parent={parent} />;
  }

  it('should render correct content', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Go .
      </div>
    `);
  });
});

describe('trans with different context property but no children', () => {
  function TestComponent({ parent }) {
    return <Trans i18nKey="testTransNoChildrenWithCtx" context="somewhere" parent={parent} />;
  }

  it('should render correct content', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Go somewhere.
      </div>
    `);
  });
});

describe('trans with defaults property and children', () => {
  function TestComponent() {
    return (
      <Trans count={3} defaults="This property should not get used">
        You have {{ count: 3 }} message
      </Trans>
    );
  }

  it('should render correct content', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        You have 3 messages
      </div>
    `);
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import i18n from './i18n';
import { withTranslation } from '../src/withTranslation';
import { Trans } from '../src/Trans';

function Link({ to, children }) {
  return <a href={to}>{children}</a>;
}

describe('trans simple', () => {
  const TestComponent = ({ parent }) => (
    <Trans i18nKey="transTest1" parent={parent}>
      Open <Link to="/msgs">here</Link>.
    </Trans>
  );

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
  const TestComponent = ({ parent }) => (
    <Trans i18nKey="transTest1" ns="other" parent={parent}>
      Open <Link to="/msgs">here</Link>.
    </Trans>
  );

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
  const TestComponent = ({ parent }) => (
    <Trans i18nKey="transTest3" parent={parent}>
      <a />
    </Trans>
  );

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
  const TestComponent = ({ parent }) => (
    <Trans i18nKey="transTest3_overwrite" parent={parent}>
      <a href="https://www.bing.com" />
    </Trans>
  );

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
  const TestComponent = ({ parent }) => (
    <Trans i18nKey="transTest1_customHtml" parent={parent}>
      Open <Link to="/msgs">here</Link>.
    </Trans>
  );

  const TestComponent2 = ({ parent }) => <Trans i18nKey="transTest1_customHtml2" parent={parent} />;

  const TestComponent3 = ({ parent }) => <Trans i18nKey="transTest1_customHtml3" parent={parent} />;

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

describe('trans testTransKey1 singular', () => {
  const TestComponent = () => {
    const numOfItems = 1;
    return (
      <Trans i18nKey="testTransKey1" count={numOfItems}>
        {{ numOfItems }} items matched.
      </Trans>
    );
  };

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
  const TestComponent = () => {
    const numOfItems = 10;
    return (
      <Trans i18nKey="testTransKey1" count={numOfItems}>
        {{ numOfItems }} items matched.
      </Trans>
    );
  };

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
  const TestComponent = () => {
    const numOfItems = 10;
    return (
      <Trans i18nKey="testTransKey2" count={numOfItems}>
        <span className="matchCount">{{ numOfItems }}</span> items matched.
      </Trans>
    );
  };

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
  const TestComponent = () => {
    const numOfItems = 10;
    return (
      <Trans i18nKey="testTransKey3" count={numOfItems}>
        Result: <span className="matchCount">{{ numOfItems }}</span> items matched.
      </Trans>
    );
  };

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
  const TestComponent = () => {
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
  const TestComponent = () => {
    const count = 10;
    const name = 'Jan';
    // prettier-ignore
    return (
      <Trans i18nKey="transTest2" count={count}>
        Hello <strong>{{ name }}</strong>, you have {{n: count}} message. Open <Link to="/msgs">here</Link>.
      </Trans>
    );
  };

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
  const TestComponent = () => {
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
  const TestComponent = ({ t, cb }) => {
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
  const TestComponent = () => <Trans />;
  it('should render an empty string', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`<div />`);
  });
});

describe('trans with only content from translation file - no children', () => {
  const TestComponent = () => <Trans i18nKey="key1" />;
  it('should render translated string', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        test
      </div>
    `);
  });
});

describe('trans should not break on invalid node from translations', () => {
  const TestComponent = () => <Trans i18nKey="testInvalidHtml" />;
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
  const TestComponent = () => <Trans i18nKey="testInvalidHtml2" />;
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
  const TestComponent = () => (
    <Trans
      i18nKey="someKey"
      defaults="Hi {{ firstName }},<br/>and <bold>welcome</bold>"
      values={{ firstName: 'Fritz' }}
      components={{ br: <br />, bold: <strong /> }}
    />
  );
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

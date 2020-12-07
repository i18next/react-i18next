import React from 'react';
import { render } from '@testing-library/react';
import './i18n';
import { Trans } from '../src/Trans';

describe('trans using no children but components (object) - base case using array not object', () => {
  const TestComponent = () => (
    <Trans
      defaults="hello <0>beautiful</0> <1>{{what}}</1>"
      values={{ what: 'world' }}
      components={[<i>just dummy</i>, <strong>univers</strong>]}
    />
  );
  it('should render translated string', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        hello 
        <i>
          beautiful
        </i>
         
        <strong>
          world
        </strong>
      </div>
    `);
  });
});

describe('trans using no children but components (object) - using index', () => {
  const TestComponent = () => (
    <Trans
      defaults="hello <1>beautiful</1> <2>{{what}}</2>"
      values={{ what: 'world' }}
      components={{ 1: <i>just dummy</i>, 2: <strong>univers</strong> }}
    />
  );
  it('should render translated string', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        hello 
        <i>
          beautiful
        </i>
         
        <strong>
          world
        </strong>
      </div>
    `);
  });
});

describe('trans using no children but components (object) - using names', () => {
  const TestComponent = () => (
    <Trans
      defaults="hello <italic>beautiful</italic> <bold>{{what}}</bold>"
      values={{ what: 'world' }}
      components={{ italic: <i>just dummy</i>, bold: <strong>univers</strong> }}
    />
  );
  it('should render translated string', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        hello 
        <i>
          beautiful
        </i>
         
        <strong>
          world
        </strong>
      </div>
    `);
  });
});

describe('trans using no children but components (object) - using names with no lowercase', () => {
  const TestComponent = () => (
    <Trans
      defaults="hello <italicCase>beautiful</italicCase> <BoldCase>{{what}}</BoldCase>"
      values={{ what: 'world' }}
      components={{ italicCase: <i>just dummy</i>, BoldCase: <strong>univers</strong> }}
    />
  );
  it('should render translated string', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        hello 
        <i>
          beautiful
        </i>
         
        <strong>
          world
        </strong>
      </div>
    `);
  });
});

describe('trans using no children but components (object) - use more than once', () => {
  const TestComponent = () => (
    <Trans
      defaults="hello<list><listitem>A</listitem>,<listitem>B</listitem>and<listitem>C</listitem></list>"
      components={{ list: <ul>a</ul>, listitem: <li>b</li> }}
    />
  );
  it('should render translated string', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        hello
        <ul>
          <li>
            A
          </li>
          ,
          <li>
            B
          </li>
          and
          <li>
            C
          </li>
        </ul>
      </div>
    `);
  });
});

describe('trans using no children but components (object) - use more than once (empty)', () => {
  const TestComponent = () => (
    <Trans
      defaults="hello<list><listitem>A</listitem>,<listitem>B</listitem>and<listitem>C</listitem></list>"
      components={{ list: <ul />, listitem: <li /> }}
    />
  );
  it('should render translated string', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        hello
        <ul>
          <li>
            A
          </li>
          ,
          <li>
            B
          </li>
          and
          <li>
            C
          </li>
        </ul>
      </div>
    `);
  });
});

describe('trans using no children but components (object) - using self closing tag', () => {
  const Button = () => <button type="button">click me</button>;
  const TestComponent = () => (
    <Trans defaults="hello <ClickMe />" components={{ ClickMe: <Button /> }} />
  );
  it('should render translated string', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        hello 
        <button
          type="button"
        >
          click me
        </button>
      </div>
    `);
  });
});

describe('trans using no children but components (object) - empty content', () => {
  const Button = () => <button type="button">click me</button>;
  const TestComponent = () => (
    <Trans defaults="hello <ClickMe></ClickMe>" components={{ ClickMe: <Button /> }} />
  );
  it('should render translated string', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        hello 
        <button
          type="button"
        >
          click me
        </button>
      </div>
    `);
  });
});

describe('trans using children but components (object) - self closing tag', () => {
  const Button = () => <button type="button">click me</button>;
  const TestComponent = () => (
    <Trans components={{ ClickMe: <Button /> }}>{'hello <ClickMe/>'}</Trans>
  );
  it('should render translated string', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        hello 
        <button
          type="button"
        >
          click me
        </button>
      </div>
    `);
  });
});

describe('trans using no children but components (object) - interpolated component with children', () => {
  const Button = ({ children }) => <button type="button">{children}</button>;
  const TestComponent = () => (
    <Trans defaults="hello <ClickMe>Test</ClickMe>" components={{ ClickMe: <Button /> }} />
  );
  it('should render translated string', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        hello 
        <button
          type="button"
        >
          Test
        </button>
      </div>
    `);
  });
});

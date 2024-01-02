import { describe, it, expect, afterEach } from 'vitest';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import './i18n';
import { Trans } from '../src';

describe('Trans should render nested components', () => {
  // beforeAll(() => {
  //   vitest.spyOn(console, 'error').mockImplementation(() => { });
  // })

  afterEach(() => {
    cleanup();
    // vitest.clearAllMocks();
  });

  it('should render dynamic ul as components property', () => {
    const list = ['li1', 'li2'];

    function TestComponent() {
      return (
        <Trans
          i18nKey="testTrans4KeyWithNestedComponent"
          components={[
            <ul>
              {list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>,
          ]}
        />
      );
    }
    const { container } = render(<TestComponent />);

    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Result should be a list: 
        <ul>
          <li>
            li1
          </li>
          <li>
            li2
          </li>
        </ul>
      </div>
    `);
  });

  it('should render dynamic ul as components property when pass as a children', () => {
    const list = ['li1', 'li2'];

    function TestComponent() {
      return (
        <Trans i18nKey="testTrans5KeyWithNestedComponent">
          My list:
          <ul i18nIsDynamicList>
            {list.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Trans>
      );
    }
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Result should be a list: 
        <ul>
          <li>
            li1
          </li>
          <li>
            li2
          </li>
        </ul>
      </div>
    `);
  });

  it('should render dynamic Elements correctly', () => {
    const dynamicContent = <div>testing</div>;

    function TestComponent() {
      return (
        <Trans>
          My dynamic content:
          <React.Fragment i18nIsDynamicList>{dynamicContent}</React.Fragment>
        </Trans>
      );
    }
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        My dynamic content:
        <div>
          testing
        </div>
      </div>
    `);
  });

  it('should render dynamic strings correctly', () => {
    const dynamicContent = 'testing';

    function TestComponent() {
      return (
        <Trans>
          My dynamic content: <React.Fragment i18nIsDynamicList>{dynamicContent}</React.Fragment>
        </Trans>
      );
    }
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        My dynamic content: 
        testing
      </div>
    `);
  });
});

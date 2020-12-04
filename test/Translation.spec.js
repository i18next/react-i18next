import React from 'react';
import { render, screen } from '@testing-library/react';
import './i18n';
import { Translation } from '../src/Translation';

jest.unmock('../src/Translation');

describe('Translation', () => {
  function TestComponent() {
    return <Translation>{t => <div>{t('key1')}</div>}</Translation>;
  }

  it('should render correct content', () => {
    const { container } = render(<TestComponent />);
    // screen.debug()
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        test
      </div>
    `);
  });
});

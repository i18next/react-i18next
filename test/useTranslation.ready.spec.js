import React from 'react';

import { render } from '@testing-library/react';
import { useTranslation } from '../src/useTranslation';

jest.unmock('../src/useTranslation');

const instance = {
  language: 'en',
  languages: ['en', 'fr'],
  services: {
    resourceStore: {
      data: {},
    },
    backendConnector: { backend: {}, state: { 'en|notLoadedNS': 1, 'fr|notLoadedNS': 1 } },
  },
  isInitialized: true,
  changeLanguage: () => {},
  getFixedT: () => message => message,
  hasResourceBundle: (lng, ns) => ns === 'alreadyLoadedNS',
  loadNamespaces: () => {},
  on: () => {},
  off: () => {},
  options: {},
};

describe('useTranslation', () => {
  function TestComponent({ i18n }) {
    const [t] = useTranslation('alreadyLoadedNS', { i18n });

    return <div>{t('keyOne')}</div>;
  }

  function TestComponentNotReady({ i18n }) {
    const [t] = useTranslation(['notLoadedNS', 'alreadyLoadedNS'], { i18n });

    return <div>{t('keyOne')}</div>;
  }

  it('should throw a suspense if not ready (having not all ns)', () => {
    expect(() => {
      console.error = jest.fn(); // silent down the error boundary error from react-dom

      render(<TestComponentNotReady i18n={instance} />);
    }).toThrow(
      'TestComponentNotReady suspended while rendering, but no fallback UI was specified.',
    );
    expect(console.error).toHaveBeenCalled(); // silent down the error boundary error from react-dom
  });

  it('should render correct content if ready (having all ns)', () => {
    const { container } = render(<TestComponent i18n={instance} />);

    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        keyOne
      </div>
    `);
  });

  it('should ignore suspense if no backend defined', () => {
    const instance2 = { ...instance };
    instance2.services.backendConnector = { backend: false };
    const { container } = render(<TestComponentNotReady i18n={instance2} />);

    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        keyOne
      </div>
    `);
  });

  it('should ignore suspense if failed loading ns and no fallback lng is defined', () => {
    const instance2 = { ...instance };
    instance2.services.options = { fallbackLng: false };
    const { container } = render(<TestComponentNotReady i18n={instance2} />);

    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        keyOne
      </div>
    `);
  });

  it('should ignore suspense if failed loading ns but has fallback loaded', () => {
    const instance2 = { ...instance };
    instance2.services.backendConnector = {
      backend: {},
      state: { 'en|notLoadedNS': -1, 'fr|notLoadedNS': 2 },
    };
    const { container } = render(<TestComponentNotReady i18n={instance2} />);

    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        keyOne
      </div>
    `);
  });

  it('should ignore suspense if failed loading ns and has fallback failing too', () => {
    const instance2 = { ...instance };
    instance2.services.backendConnector = {
      backend: {},
      state: { 'en|notLoadedNS': -1, 'fr|notLoadedNS': -1 },
    };
    const { container } = render(<TestComponentNotReady i18n={instance2} />);

    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        keyOne
      </div>
    `);
  });

  it('should ignore suspense if set useSuspense to false', () => {
    const instance2 = { ...instance };
    instance2.options.react = { useSuspense: false };
    instance2.services.backendConnector = {
      backend: {},
      state: { 'en|notLoadedNS': 1, 'fr|notLoadedNS': 1 },
    };
    const { container } = render(<TestComponentNotReady i18n={instance2} />);

    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        keyOne
      </div>
    `);
  });
});

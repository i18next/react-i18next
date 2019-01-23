import React from 'react';
import { mount } from 'enzyme';
import { useTranslation } from '../src/hooks/useTranslation';

jest.unmock('../src/hooks/useTranslation');

const i18n = {
  language: 'en',
  languages: ['en'],
  options: {
    defaultNS: 'defaultNS',
    nsMode: 'fallback',
  },
  services: {
    resourceStore: {
      data: {},
    },
    backendConnector: {},
  },
  isInitialized: true,
  changeLanguage: () => {},
  getFixedT: () => message => message,
  hasResourceBundle: (lng, ns) => ns === 'alreadyLoadedNS',
  loadNamespaces: () => {},
};

describe('useTranslation', () => {
  function TestComponent() {
    const [t] = useTranslation('alreadyLoadedNS', { i18n });

    return <div>{t('keyOne')}</div>;
  }

  function TestComponentNotReady() {
    const [t] = useTranslation(['notLoadedNS', 'alreadyLoadedNS'], { i18n });

    return <div>{t('keyOne')}</div>;
  }

  it('should throw a suspense if not ready (having not all ns)', () => {
    expect(() => {
      console.error = jest.fn(); // silent down the error boundary error from react-dom

      mount(<TestComponentNotReady />, {});
    }).toThrow(
      'TestComponentNotReady suspended while rendering, but no fallback UI was specified.',
    );
    expect(console.error).toHaveBeenCalled(); // silent down the error boundary error from react-dom
  });

  it('should render correct content if ready (having all ns)', () => {
    const wrapper = mount(<TestComponent />, {});
    // console.log(wrapper.debug());
    expect(wrapper.contains(<div>keyOne</div>)).toBe(true);
  });
});

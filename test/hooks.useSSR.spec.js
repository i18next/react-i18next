import React from 'react';
import { mount } from 'enzyme';
import i18n from './i18n';
import { setI18n } from '../src/hooks/context';
import { useSSR } from '../src/hooks/useSSR';

jest.unmock('../src/hooks/useSSR');

const mockI18n = {
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
  changeLanguage: lng => {
    mockI18n.language = lng;
  },
  getFixedT: () => message => message,
  hasResourceBundle: (lng, ns) => ns === 'alreadyLoadedNS',
  loadNamespaces: () => {},
};

describe('useSSR', () => {
  function TestComponent() {
    useSSR({ foo: 'bar' }, 'de');

    return <div>SSR</div>;
  }

  beforeAll(() => {
    setI18n(mockI18n);
  });

  afterAll(() => {
    setI18n(i18n);
  });

  it('should set values', () => {
    const wrapper = mount(<TestComponent />, {});
    // console.log(wrapper.debug());
    expect(wrapper.contains(<div>SSR</div>)).toBe(true);
    expect(mockI18n.language).toBe('de');
    expect(mockI18n.services.resourceStore.data).toEqual({ foo: 'bar' });
  });
});

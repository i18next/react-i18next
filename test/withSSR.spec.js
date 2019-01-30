import React from 'react';
import { mount } from 'enzyme';
import i18n from './i18n';
import { setI18n } from '../src/context';
import { withSSR } from '../src/withSSR';

jest.unmock('../src/withSSR');

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
    return <div>SSR</div>;
  }

  beforeAll(() => {
    setI18n(mockI18n);
  });

  afterAll(() => {
    setI18n(i18n);
  });

  it('should set values', () => {
    const HocElement = withSSR()(TestComponent);
    const wrapper = mount(<HocElement initialI18nStore={{ foo: 'bar' }} initialLanguage="de" />);
    // console.log(wrapper.debug());
    expect(wrapper.contains(<div>SSR</div>)).toBe(true);
    expect(mockI18n.language).toBe('de');
    expect(mockI18n.services.resourceStore.data).toEqual({ foo: 'bar' });
  });
});

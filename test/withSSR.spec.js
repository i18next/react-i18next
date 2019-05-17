import React from 'react';
import { mount } from 'enzyme';
import i18n from './i18n';
import { setI18n } from '../src/context';
import { withSSR } from '../src/withSSR';
import { useTranslation } from '../src/useTranslation';

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
  getResourceBundle: (lng, ns) => ({ lng, ns }),
  loadNamespaces: () => {},
  on: () => {},
};

describe('withSSR', () => {
  function TestComponent() {
    const { t } = useTranslation('ns1');
    return <div>SSR</div>;
  }

  TestComponent.getInitialProps = async ctx => ({ foo: 'bar' });

  beforeAll(() => {
    setI18n(mockI18n);
  });

  afterAll(() => {
    setI18n(i18n);
  });

  it('should export wrapped component', () => {
    const HocElement = withSSR()(TestComponent);
    expect(HocElement.WrappedComponent).toBe(TestComponent);
  });

  it('should set values', () => {
    const HocElement = withSSR()(TestComponent);
    const wrapper = mount(<HocElement initialI18nStore={{ foo: 'bar' }} initialLanguage="de" />);
    // console.log(wrapper.debug());
    expect(wrapper.contains(<div>SSR</div>)).toBe(true);
    expect(mockI18n.language).toBe('de');
    expect(mockI18n.services.resourceStore.data).toEqual({ foo: 'bar' });
  });

  it('should get initialProps', async () => {
    const HocElement = withSSR()(TestComponent);

    expect.assertions(1);
    const props = await HocElement.getInitialProps({});

    const expected = {
      foo: 'bar',
      initialI18nStore: {
        en: {
          ns1: {
            lng: 'en',
            ns: 'ns1',
          },
        },
      },
      initialLanguage: 'de',
    };

    expect(props).toEqual(expected);
  });
});

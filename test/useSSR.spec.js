import { renderHook } from '@testing-library/react-hooks';
import i18n from './i18n';
import { setI18n } from '../src/context';
import { useSSR } from '../src/useSSR';

jest.unmock('../src/useSSR');

describe('useSSR', () => {
  const mockI18n = {
    language: 'en',
    languages: ['en'],
    options: {
      ns: [],
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

  beforeAll(() => {
    setI18n(mockI18n);
  });

  afterAll(() => {
    setI18n(i18n);
  });

  it('should set values', () => {
    renderHook(() => useSSR({ foo: 'bar' }, 'de'));
    expect(mockI18n.language).toBe('de');
    expect(mockI18n.services.resourceStore.data).toEqual({ foo: 'bar' });
  });
});

import { NamespacesConsumerComponent } from '../src/NamespacesConsumer';

jest.unmock('../src/NamespacesConsumer');

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
  },
  changeLanguage: () => {},
  getFixedT: message => message,
  hasResourceBundle: (lng, ns) => ns === 'alreadyLoadedNS',
  loadNamespaces: () => {},
};

describe('NamespacesConsumer', () => {
  it('sets initial ready state to false if resource bundles are not loaded', () => {
    const notLoadedInstance = new NamespacesConsumerComponent(
      { i18n, ns: ['notLoadedNS', 'alreadyLoadedNS'], i18nOptions: { ...i18n.options } },
      {}
    );
    expect(notLoadedInstance.state.ready).toBe(false);
  });

  it('sets initial ready state to true if resource bundles are already loaded', () => {
    const notLoadedInstance = new NamespacesConsumerComponent(
      { i18n, ns: ['alreadyLoadedNS'], i18nOptions: { ...i18n.options } },
      {}
    );
    expect(notLoadedInstance.state.ready).toBe(true);
  });
});

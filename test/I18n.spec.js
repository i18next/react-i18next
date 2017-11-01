jest.unmock('../src/I18n');
import I18n from '../src/I18n';

const i18n = {
  language: 'en',
  options: {
    defaultNS: 'defaultNS'
  },
  services: {
    resourceStore: {
      data: {}
    }
  },
  changeLanguage: () => {},
  getFixedT: message => message,
  hasResourceBundle: (lng, ns) => ns === 'alreadyLoadedNS',
  loadNamespaces: () => {}
};

describe('I18n', () => {
  it('sets initial ready state to false if resource bundles are not loaded', () => {
    const notLoadedInstance = new I18n({ i18n, ns: ['notLoadedNS', 'alreadyLoadedNS'] }, {});
    expect(notLoadedInstance.state.ready).toBe(false);
  });

  it('sets initial ready state to true if resource bundles are already loaded', () => {
    const notLoadedInstance = new I18n({ i18n, ns: ['alreadyLoadedNS'] }, {});
    expect(notLoadedInstance.state.ready).toBe(true);
  });
});

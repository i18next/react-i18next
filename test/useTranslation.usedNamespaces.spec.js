import React from 'react';
import { mount } from 'enzyme';
import { useTranslation } from '../src/useTranslation';

jest.unmock('../src/useTranslation');

const i18n = {
  language: 'en',
  languages: ['en'],
  services: {
    resourceStore: {
      data: {},
    },
    backendConnector: { backend: {} },
  },
  isInitialized: true,
  changeLanguage: () => {},
  getFixedT: () => message => message,
  hasResourceBundle: (lng, ns) => ns === 'ns1' || ns === 'ns2' || ns === 'ns3',
  loadNamespaces: () => {},
  on: () => {},
  options: {},
};

describe('useTranslation', () => {
  function TestComponent() {
    const [t] = useTranslation(['ns1', 'ns2', 'ns3'], { i18n });

    return <div>{t('keyOne')}</div>;
  }

  it('should render correct content if ready (having all ns)', () => {
    mount(<TestComponent />, {});
    // console.log(wrapper.debug());
    expect(i18n.reportNamespaces.getUsedNamespaces()).toEqual(['ns1', 'ns2', 'ns3']);
  });
});

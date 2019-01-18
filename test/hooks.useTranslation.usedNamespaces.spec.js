import React from 'react';
import { mount } from 'enzyme';
import { useTranslation } from '../src/hooks/useTranslation';
import { getUsedNamespaces } from '../src/hooks/context';

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
  hasResourceBundle: (lng, ns) => ns === 'ns1' || ns === 'ns2' || ns === 'ns3',
  loadNamespaces: () => {},
};

describe('useTranslation', () => {
  function TestComponent() {
    const [t] = useTranslation(['ns1', 'ns2', 'ns3'], { i18n });

    return <div>{t('keyOne')}</div>;
  }

  it('should render correct content if ready (having all ns)', () => {
    const wrapper = mount(<TestComponent />, {});
    // console.log(wrapper.debug());
    expect(getUsedNamespaces()).toEqual(['ns1', 'ns2', 'ns3']);
  });
});

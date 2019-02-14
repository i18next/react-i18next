import React from 'react';
import { mount } from 'enzyme';
import { I18nextProvider } from '../src/I18nextProvider';
import { useTranslation } from '../src/useTranslation';

jest.unmock('../src/useTranslation');
jest.unmock('../src/I18nextProvider');

const instance = {
  language: 'en',
  languages: ['en', 'fr'],
  services: {
    resourceStore: {
      data: {},
    },
    backendConnector: { backend: {}, state: {} },
  },
  isInitialized: true,
  changeLanguage: () => {},
  getFixedT: () => message => message,
  hasResourceBundle: (lng, ns) => ns === 'translation',
  loadNamespaces: () => {},
  on: () => {},
  options: {},
};

describe('I18nextProvider', () => {
  function TestComponent() {
    const { t, i18n } = useTranslation('translation');

    expect(typeof t).toBe('function');
    expect(i18n).toBe(instance);

    return <div>{t('key1')}</div>;
  }

  it('should render correct content', () => {
    const wrapper = mount(
      <I18nextProvider i18n={instance}>
        <TestComponent />
      </I18nextProvider>,
      {},
    );
    // console.log(wrapper.debug());
    expect(wrapper.contains(<div>key1</div>)).toBe(true);
  });
});

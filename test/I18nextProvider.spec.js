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
  it('should render correct content', () => {
    function TestComponent() {
      const { t, i18n } = useTranslation('translation');

      expect(typeof t).toBe('function');
      expect(i18n).toBe(instance);

      return <div>{t('key1')}</div>;
    }

    const wrapper = mount(
      <I18nextProvider i18n={instance}>
        <TestComponent />
      </I18nextProvider>,
      {},
    );
    // console.log(wrapper.debug());
    expect(wrapper.contains(<div>key1</div>)).toBe(true);
  });

  it('should not rerender if value is not changed', () => {
    let count = 0;
    const TestComponent = React.memo(function TestComponent() {
      const { t } = useTranslation('translation');
      count += 1;
      return <div>{t('key1')}</div>;
    });

    const wrapper = mount(
      <I18nextProvider i18n={instance}>
        <TestComponent />
      </I18nextProvider>,
      {},
    );
    expect(count).toBe(1);
    wrapper.setProps({ i18n: instance });
    expect(count).toBe(1);
  });
});

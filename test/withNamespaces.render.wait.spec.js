import React from 'react';
import { shallow, render, mount } from 'enzyme';
import i18n from './i18n';
import BackendMock from './backendMock';
import { withNamespaces } from '../src/withNamespaces';

const newI18n = i18n.createInstance();
const backend = new BackendMock();
newI18n.use(backend).init({
  lng: 'en',
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false, // not needed for react!!
  },
});

describe('withNamespaces wait', () => {
  const TestElement = ({ t }) => <div>{t('key1')}</div>;

  it('should wait for correct translation', () => {
    const HocElement = withNamespaces(['common'], { wait: true })(TestElement);

    const wrapper = mount(<HocElement i18n={i18n} />);
    // console.log(wrapper.debug());
    expect(wrapper.contains(<div>test</div>)).toBe(false);

    backend.flush();
    wrapper.update();

    setTimeout(() => {
      expect(wrapper.contains(<div>test</div>)).toBe(true);
    }, 50);
  });

  it('should global wait for correct translation', () => {
    // reinit global
    newI18n.init({ react: { wait: true } });

    const HocElement = withNamespaces(['common'], {
      /* not use this -> wait: true */
    })(TestElement);

    const wrapper = mount(<HocElement i18n={newI18n} />);
    // console.log(wrapper.debug());
    expect(wrapper.contains(<div>test</div>)).toBe(false);

    backend.flush();
    wrapper.update();

    setTimeout(() => {
      expect(wrapper.contains(<div>test</div>)).toBe(true);
    }, 50);
  });
});

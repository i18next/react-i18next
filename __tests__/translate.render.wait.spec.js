import React from 'react';
import { shallow, render, mount } from 'enzyme';
import i18n from './i18n';
import BackendMock from './BackendMock';
import translate from '../src/translate';

const newI18n = i18n.createInstance();
const backend = new BackendMock();
newI18n
  .use(backend)
  .init({
    lng: 'en',
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false, // not needed for react!!
    }
  })

const context = {
  i18n: newI18n
};

describe.only('translate wait', () => {
  const TestElement = ({ t }) => {
    return (
      <div>{t('key1')}</div>
    );
  }

  it('should wait for correct translation', () => {
    const HocElement = translate(['common'], { wait: true })(TestElement);

    const wrapper = mount(<HocElement />, { context });
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
    newI18n.init({ react: { wait: true }});

    const HocElement = translate(['common'], { /* not use this -> wait: true */ })(TestElement);

    const wrapper = mount(<HocElement />, { context });
    // console.log(wrapper.debug());
    expect(wrapper.contains(<div>test</div>)).toBe(false);

    backend.flush();
    wrapper.update();

    setTimeout(() => {
      expect(wrapper.contains(<div>test</div>)).toBe(true);
    }, 50);
  });
});

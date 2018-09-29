import React from 'react';
import { shallow, render, mount } from 'enzyme';
import i18n from './i18n';
import translate from '../src/translate';

const newI18n = i18n.createInstance();
newI18n.init({
  lng: 'en',
  fallbackLng: 'en',

  resources: {
    en: {
      a: {
        key1: 'test a',
      },
      b: {
        key2: 'test b',
      },
    },
  },

  interpolation: {
    escapeValue: false, // not needed for react!!
  },
});

describe.only('translate wait', () => {
  const TestElement = ({ t }) => <div>{t('key2')}</div>;

  it('should fallback for correct translation', () => {
    const HocElement = translate(['a', 'b'], { nsMode: 'fallback' })(TestElement);

    const wrapper = mount(<HocElement i18n={newI18n} />);
    // console.log(wrapper.debug());
    expect(wrapper.contains(<div>test b</div>)).toBe(true);
  });

  it('should global fallback for correct translation', () => {
    // reinit global
    newI18n.init({ react: { nsMode: 'fallback' } });

    const HocElement = translate(['a', 'b'], {
      /*nsMode: fallback */
    })(TestElement);

    const wrapper = mount(<HocElement i18n={newI18n} />);
    // console.log(wrapper.debug());
    expect(wrapper.contains(<div>test b</div>)).toBe(true);
  });
});

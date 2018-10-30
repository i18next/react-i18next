import React from 'react';
import Enzyme from 'enzyme';
import { I18nextProvider } from '../src/I18nextProvider';

jest.unmock('../src/I18nextProvider');

describe('I18nextProvider', () => {
  it('should throw an exception if you try to change i18n object', () => {
    const i18n = { t: () => {} };
    const anotherI18n = { i18n: { another: true } };

    const wrapper = Enzyme.shallow(<I18nextProvider i18n={i18n} />);

    function setAnotherI18n() {
      wrapper.setProps(anotherI18n);
    }
    expect(setAnotherI18n).toThrowError(
      '[react-i18next][I18nextProvider]does not support changing the i18n object.'
    );
  });

  it('should not throw an exception if you set the same i18n object', () => {
    const i18n = { t: () => {} };

    const wrapper = Enzyme.shallow(<I18nextProvider i18n={i18n} />);

    function setSameI18n() {
      wrapper.setProps(i18n);
    }
    expect(setSameI18n).not.toThrowError();
  });
});

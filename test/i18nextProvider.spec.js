import React from 'react';
import PropTypes from 'prop-types';
import { I18nextProvider } from '../src/I18nextProvider';
import { I18nContext } from '../src/context';

jest.unmock('../src/I18nextProvider');

describe('I18nextProvider', () => {
  it('should throw an exception if you try to change i18n object', () => {
    const i18n = {};
    const wrapper = new I18nextProvider({ i18n });
    wrapper.props.i18n = { anoter: true };
    function willReceiveProps() {
      wrapper.componentWillReceiveProps({ i18n: {} });
    }
    expect(willReceiveProps).toThrowError(
      '[react-i18next][I18nextProvider]does not support changing the i18n object.'
    );
  });
});

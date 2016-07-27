jest.unmock('../src/I18nextProvider');
import React from 'react';
import  I18nextProvider from '../src/I18nextProvider' ;

describe('I18nextProvider', () => {
  it('should provide i18n context', () => {
    const i18n = {};
    const wrapper = new I18nextProvider({ i18n });
    expect(wrapper.getChildContext().i18n).toBe(i18n);
  });
  it('should throw an exception if you try to change i18n object', () => {
    const i18n = {};
    const wrapper = new I18nextProvider({ i18n });
    wrapper.props.i18n = { anoter: true };
    function willReceiveProps() {
      wrapper.componentWillReceiveProps({ i18n: {} });
    }
    expect(willReceiveProps).toThrowError('[react-i18next][I18nextProvider]does not support changing the i18n object.');
  });
  it('should render children', () => {
    const div = React.createFactory('div');
    const child = React.createElement(div);
    const wrapper = new I18nextProvider({ i18n: {}, children: child });
    const render = wrapper.render();
    expect(render).toBe(child);
  });
});

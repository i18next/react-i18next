jest.unmock('../src/Trans');
import React from 'react';
import PropTypes from 'prop-types';
import Trans from '../src/trans';

describe('trans', () => {
  it('should have some stuff', () => {
    expect(Trans.contextTypes.i18n)
      .toBe(PropTypes.object.isRequired);
    expect(Trans.contextTypes.t)
      .toBe(PropTypes.func.isRequired);
    const props = {};
    const context = {
      i18n: {},
      t(message) {
        return message;
      }
    };
    const trans = new Trans(props, context);
    expect(trans.i18n).toBe(context.i18n);
    expect(trans.t).toBe(context.t);
  });
});

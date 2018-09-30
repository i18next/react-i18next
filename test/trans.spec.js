import React from 'react';
import PropTypes from 'prop-types';
import { TransComponent } from '../src/Trans';
jest.unmock('../src/Trans');

describe('trans', () => {
  it('should have some stuff', () => {
    expect(TransComponent.propTypes.i18n).toBe(PropTypes.object);
    expect(TransComponent.propTypes.t).toBe(PropTypes.func);
  });
});

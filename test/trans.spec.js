jest.unmock('../src/Trans');
import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '../src/Trans';

describe('trans', () => {
  it('should have some stuff', () => {
    expect(Trans.propTypes.i18n)
      .toBe(PropTypes.object);
    expect(Trans.propTypes.t)
      .toBe(PropTypes.func);
  });
});

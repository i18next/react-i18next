jest.unmock('../src/translate');
import React from 'react';
import translate from '../src/translate';

describe('translate', () => {
  it('should return a function', () => {
    const wrap = translate('namespace', {});
    expect(typeof wrap).toBe('function');
  });
  it('that function should wrap my element', () => {
    const wrap = translate('namespace', {});
    const Elem = React.createFactory('Elem');
    Elem.displayName = 'Elem';
    const wrapped = wrap(Elem);
    expect(wrapped.WrappedComponent).toBe(Elem);
    expect(wrapped.displayName).toBe('Translate(Elem)');
  });
});

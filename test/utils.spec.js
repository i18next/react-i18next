import { describe, it, expect } from 'vitest';
import { isString, isObject } from '../src/utils.js';

describe('isString', () => {
  it('should return true for strings', () => {
    expect(isString('string')).toBe(true);
  });

  it.each([[undefined], [null], [1], [{}], [[]], [() => {}]])(
    'should return false for non-strings, testing %o',
    (value) => {
      expect(isString(value)).toBe(false);
    },
  );
});

describe('isObject', () => {
  it.each([[{}], [{ key: 'value' }], [[]]])(
    'should return true for objects, testing %o',
    (value) => {
      expect(isObject(value)).toBe(true);
    },
  );

  it.each([[undefined], [null], [1], ['string'], [() => {}]])(
    'should return false for non-objects, testing %o',
    (value) => {
      expect(isObject(value)).toBe(false);
    },
  );
});

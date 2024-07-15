import { describe, it, expect } from 'vitest';
import { isString } from '../src/utils.js';

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

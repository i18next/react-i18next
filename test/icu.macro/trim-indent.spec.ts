import { describe, it, expect } from 'vitest';
import { trimIndent } from '../../src/icu.macro/utils/trim-indent';

describe('trimIndent', () => {
  it('should remove leading newline and whitespace', () => {
    const input = '\n    Hello world';
    const expected = 'Hello world';
    expect(trimIndent(input)).toBe(expected);
  });

  it('should remove trailing newline and whitespace', () => {
    const input = 'Hello world\n    ';
    const expected = 'Hello world';
    expect(trimIndent(input)).toBe(expected);
  });

  it('should remove both leading and trailing newline with whitespace', () => {
    const input = '\n    Hello world\n    ';
    const expected = 'Hello world';
    expect(trimIndent(input)).toBe(expected);
  });

  it('should preserve internal whitespace', () => {
    const input = '\n    Hello    world\n    ';
    const expected = 'Hello    world';
    expect(trimIndent(input)).toBe(expected);
  });

  it('should return unchanged string if no leading/trailing whitespace', () => {
    const input = 'Hello world';
    expect(trimIndent(input)).toBe(input);
  });
});

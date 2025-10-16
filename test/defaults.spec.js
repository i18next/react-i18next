import { describe, it, expect, beforeEach } from 'vitest';
import { setDefaults, getDefaults } from '../src/defaults';

describe('defaults', () => {
  // Store original defaults to restore after tests
  let originalDefaults;

  beforeEach(() => {
    originalDefaults = getDefaults();
  });

  it('should return default options', () => {
    const defaults = getDefaults();

    expect(defaults).toHaveProperty('bindI18n');
    expect(defaults).toHaveProperty('transEmptyNodeValue');
    expect(defaults).toHaveProperty('transSupportBasicHtmlNodes');
    expect(defaults).toHaveProperty('useSuspense');
  });

  it('should set custom defaults', () => {
    setDefaults({
      bindI18n: 'customEvent',
      useSuspense: false,
    });

    const defaults = getDefaults();

    expect(defaults.bindI18n).toBe('customEvent');
    expect(defaults.useSuspense).toBe(false);
  });

  it('should merge options with existing defaults', () => {
    const originalBindI18n = getDefaults().bindI18n;

    setDefaults({
      useSuspense: false,
    });

    const defaults = getDefaults();

    // Should keep original bindI18n
    expect(defaults.bindI18n).toBe(originalBindI18n);
    // Should update useSuspense
    expect(defaults.useSuspense).toBe(false);
  });

  it('should handle empty options object', () => {
    const beforeDefaults = getDefaults();

    setDefaults({});

    const afterDefaults = getDefaults();

    // Should maintain all properties
    expect(afterDefaults).toEqual(beforeDefaults);
  });

  it('should handle undefined options', () => {
    const beforeDefaults = getDefaults();

    setDefaults();

    const afterDefaults = getDefaults();

    // Should maintain all properties
    expect(afterDefaults).toEqual(beforeDefaults);
  });
});

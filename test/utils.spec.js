import { describe, it, expect, vi } from 'vitest';
import { isString, isObject, warn, hasLoadedNamespace } from '../src/utils.js';

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

describe('warn', () => {
  it('should use i18n logger warn method when available', () => {
    const warnSpy = vi.fn();
    const i18n = {
      services: {
        logger: {
          warn: warnSpy,
        },
      },
    };

    warn(i18n, 'TEST_CODE', 'Test message');

    expect(warnSpy).toHaveBeenCalledWith(
      'react-i18next:: Test message',
      expect.objectContaining({ code: 'TEST_CODE' }),
    );
  });

  it('should use logger.forward when available', () => {
    const forwardSpy = vi.fn();
    const i18n = {
      services: {
        logger: {
          forward: forwardSpy,
        },
      },
    };

    warn(i18n, 'TEST_CODE', 'Test message', { extra: 'data' });

    expect(forwardSpy).toHaveBeenCalledWith(
      ['Test message', { code: 'TEST_CODE', extra: 'data' }],
      'warn',
      'react-i18next::',
      true,
    );
  });

  it('should fall back to console.warn when no logger', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const i18n = {};

    warn(i18n, 'TEST_CODE', 'Test message');

    expect(consoleSpy).toHaveBeenCalledWith(
      'react-i18next:: Test message',
      expect.objectContaining({ code: 'TEST_CODE' }),
    );

    consoleSpy.mockRestore();
  });
});

describe('hasLoadedNamespace', () => {
  it('should warn and return true when i18n has no languages', () => {
    const warnSpy = vi.fn();
    const i18n = {
      languages: [],
      services: {
        logger: {
          warn: warnSpy,
        },
      },
    };

    const result = hasLoadedNamespace('translation', i18n);

    expect(result).toBe(true);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('should check namespace when languages exist', () => {
    const hasLoadedNamespaceSpy = vi.fn().mockReturnValue(true);
    const i18n = {
      languages: ['en'],
      hasLoadedNamespace: hasLoadedNamespaceSpy,
    };

    const result = hasLoadedNamespace('translation', i18n);

    expect(hasLoadedNamespaceSpy).toHaveBeenCalledWith(
      'translation',
      expect.objectContaining({ lng: undefined }),
    );
    expect(result).toBe(true);
  });

  it('should handle precheck function with languageChanging', () => {
    const loadNotPendingSpy = vi.fn().mockReturnValue(false);
    const hasLoadedNamespaceSpy = vi.fn((ns, opts) => {
      // Call the precheck to cover that branch
      const result = opts.precheck(
        {
          services: { backendConnector: { backend: {} } },
          isLanguageChangingTo: 'de',
        },
        loadNotPendingSpy,
      );
      return result === false ? false : true;
    });

    const i18n = {
      languages: ['en'],
      hasLoadedNamespace: hasLoadedNamespaceSpy,
    };

    hasLoadedNamespace('translation', i18n, {
      bindI18n: 'languageChanging',
    });

    expect(loadNotPendingSpy).toHaveBeenCalledWith('de', 'translation');
  });
});

import { describe, it, expect, vi } from 'vitest';
import { createInstance } from 'i18next';
import {
  isString,
  isObject,
  warn,
  warnOnce,
  hasLoadedNamespace,
  loadNamespaces,
} from '../src/utils.js';

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
  it('should use console.warn when i18n logger is not available', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    warn(null, 'TEST_CODE', 'Test message');

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('react-i18next::'),
      expect.objectContaining({ code: 'TEST_CODE' }),
    );

    consoleWarnSpy.mockRestore();
  });
});

describe('warnOnce', () => {
  it('should warn once per instance, not once per process', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const a = {};
    const b = {};

    warnOnce(a, 'TEST_CODE', 'once per instance');
    warnOnce(a, 'TEST_CODE', 'once per instance');
    warnOnce(b, 'TEST_CODE', 'once per instance');
    warnOnce(undefined, 'TEST_CODE', 'once per instance');
    warnOnce(undefined, 'TEST_CODE', 'once per instance');

    expect(consoleWarnSpy).toHaveBeenCalledTimes(3);
    consoleWarnSpy.mockRestore();
  });

  it('should warn once per logger: each instance has its own', () => {
    const withLogger = () => ({ services: { logger: { forward: vi.fn() } } });
    const a = withLogger();
    const b = withLogger();

    warnOnce(a, 'TEST_CODE', 'once per logger');
    warnOnce(a, 'TEST_CODE', 'once per logger');
    warnOnce(b, 'TEST_CODE', 'once per logger');

    expect(a.services.logger.forward).toHaveBeenCalledTimes(1);
    expect(b.services.logger.forward).toHaveBeenCalledTimes(1);
  });

  it('should not repeat a warning for every clone of an instance', async () => {
    const parent = createInstance();
    await parent.init({ lng: 'en', resources: { en: { translation: {} } } });
    const forward = vi.spyOn(parent.services.logger, 'forward');
    const warnings = () =>
      forward.mock.calls.filter(([args]) => args[1]?.code === 'TEST_CODE').length;

    warnOnce(parent, 'TEST_CODE', 'once for the clones too');
    warnOnce(parent.cloneInstance(), 'TEST_CODE', 'once for the clones too');
    warnOnce(parent.cloneInstance(), 'TEST_CODE', 'once for the clones too');

    expect(warnings()).toBe(1);
    forward.mockRestore();
  });
});

describe('loadNamespaces', () => {
  it('should wait for an instance that is not initialized yet, and not keep listening', async () => {
    const instance = createInstance();
    const cb = vi.fn();
    loadNamespaces(instance, ['translation'], cb);
    expect(cb).not.toHaveBeenCalled();

    await instance.init({ lng: 'en', resources: { en: { translation: {} } } });
    expect(cb).toHaveBeenCalledTimes(1);
    expect(instance.observers.initialized?.size ?? 0).toBe(0);
  });
});

describe('hasLoadedNamespace', () => {
  it('should handle when languages is undefined', () => {
    const mockI18n = {
      languages: undefined,
      hasLoadedNamespace: () => true,
    };

    const result = hasLoadedNamespace('test', mockI18n);
    expect(result).toBe(true);
  });

  it('should handle empty languages array', () => {
    const mockI18n = {
      languages: [],
      hasLoadedNamespace: () => true,
    };

    const result = hasLoadedNamespace('test', mockI18n);
    expect(result).toBe(true);
  });

  it('should handle language changing check', () => {
    const mockI18n = {
      languages: ['en'],
      isLanguageChangingTo: 'de',
      services: {
        backendConnector: {
          backend: true,
        },
      },
      hasLoadedNamespace: (ns, options) => {
        if (options.precheck) {
          const precheckResult = options.precheck(mockI18n, () => false);
          if (precheckResult === false) return false;
        }
        return true;
      },
    };

    const result = hasLoadedNamespace('test', mockI18n, {
      bindI18n: 'languageChanging loaded',
    });

    expect(result).toBe(false);
  });
});

import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { createInstance } from 'i18next';

// what a Server Component gets for `react`: no createContext, useContext, useState, useEffect,
// useSyncExternalStore
vi.mock('react', () => {
  const require = createRequire(import.meta.url);
  const react = require(
    require.resolve('react/package.json').replace(/package\.json$/, 'react.react-server.js'),
  );
  return { ...react, default: react };
});

const textOf = (node) => {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  return textOf(node.props?.children);
};

// React 18 has no react-server build (Server Components need React 19)
const reactServerBuild = createRequire(import.meta.url)
  .resolve('react/package.json')
  .replace(/package\.json$/, 'react.react-server.js');

describe.skipIf(!existsSync(reactServerBuild))('react-server entry', () => {
  let server;
  let i18n;

  beforeAll(async () => {
    server = await import('../src/index.react-server.js');
    i18n = createInstance();
    await i18n.init({
      lng: 'en',
      resources: { en: { translation: { hello: 'Hello <0>{{name}}</0> &amp; co' } } },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should only export what works without context and hooks', () => {
    expect(Object.keys(server).sort()).toEqual([
      'IcuTrans',
      'IcuTransWithoutContext',
      'Trans',
      'TransWithoutContext',
      'getDefaults',
      'getI18n',
      'initReactI18next',
      'nodesToString',
      'setDefaults',
      'setI18n',
    ]);
  });

  it('is needed: the client entry needs createContext at import time', async () => {
    await expect(import('../src/index.js')).rejects.toThrow(/createContext/);
  });

  it('should render Trans with an i18n prop', () => {
    const out = server.Trans({
      i18n,
      i18nKey: 'hello',
      values: { name: 'Tom' },
      components: [server.TransWithoutContext({ i18n, i18nKey: 'none', defaults: 'x' })],
    });
    expect(textOf(out)).toBe('Hello Tom & co');
  });

  it('should render IcuTrans with a t prop', () => {
    const out = server.IcuTrans({
      i18n,
      t: i18n.getFixedT('en'),
      i18nKey: 'missing',
      defaultTranslation: 'Hi <0>there</0>',
      content: [{ type: 'b' }],
    });
    expect(textOf(out)).toBe('Hi there');
  });

  it('should warn once in development when Trans falls back to the global instance', () => {
    const global = createInstance();
    global.init({ lng: 'en', resources: { en: { translation: { k: 'value' } } } });
    server.initReactI18next.init(global);
    const forward = vi.spyOn(global.services.logger, 'forward');
    const warnings = () =>
      forward.mock.calls.filter(([args]) => args[1]?.code === 'GLOBAL_INSTANCE_ON_SERVER').length;

    server.Trans({ i18n: global, i18nKey: 'k' });
    expect(warnings()).toBe(0);
    // a t alone carries no instance: options, formatting and the values' language still come
    // from the global instance
    expect(textOf(server.Trans({ t: global.getFixedT('en'), i18nKey: 'k' }))).toBe('value');
    expect(warnings()).toBe(1);
    expect(textOf(server.Trans({ i18nKey: 'k' }))).toBe('value');
    expect(warnings()).toBe(1);
  });
});

import { describe, it, expect, afterEach } from 'vitest';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import i18next from 'i18next';
import { Trans } from '../src/Trans';

// https://github.com/i18next/react-i18next/issues/1950
// with children, a placeholder inside a value stays as it is (interpolation.skipOnVariables), as in t()
describe('Trans with children and values', () => {
  afterEach(cleanup);

  const setup = async (options = {}, plugins = []) => {
    const i18n = i18next.createInstance();
    plugins.forEach((plugin) => i18n.use(plugin));
    await i18n.init({
      lng: 'en',
      resources: {
        en: { translation: { 'Hello {{name}}': 'Hello {{name}}', greeting: 'Hi {{name}}' } },
      },
      ...options,
    });
    return i18n;
  };
  const text = (element) => render(element).container.textContent;
  const name = 'from children';

  it('does not fill a placeholder that came in with a value', async () => {
    const i18n = await setup();
    expect(
      text(
        <Trans i18n={i18n} values={{ name: '{{otherVar}}', otherVar: 'x' }}>
          Hello {{ name }}
        </Trans>,
      ),
    ).toBe('Hello {{otherVar}}');
  });

  it('fills a value that contains its own placeholder once', async () => {
    const i18n = await setup();
    expect(
      text(
        <Trans i18n={i18n} values={{ name: '{{name}} is my name' }}>
          Hello {{ name }}
        </Trans>,
      ),
    ).toBe('Hello {{name}} is my name');
  });

  it('does the same with count', async () => {
    const i18n = await setup();
    expect(
      text(
        <Trans i18n={i18n} count={2} values={{ name: '{{otherVar}}', otherVar: 'x' }}>
          Hello {{ name }}
        </Trans>,
      ),
    ).toBe('Hello {{otherVar}}');
  });

  it('still fills the variables of other object children', async () => {
    const i18n = await setup({
      resources: { en: { translation: { greeting: 'Hi {{name}}, <1>{{city}}</1>' } } },
    });
    expect(
      text(
        <Trans i18n={i18n} i18nKey="greeting" values={{ name: 'Joe' }}>
          Hi {{ name }}, <b>{{ city: 'Rome' }}</b>
        </Trans>,
      ),
    ).toBe('Hi Joe, Rome');
  });

  describe('fills the values when t() did not', () => {
    it('in cimode', async () => {
      const i18n = await setup({ lng: 'cimode' });
      expect(
        text(
          <Trans i18n={i18n} i18nKey="greeting" values={{ name: 'Joe' }}>
            Hello {{ name }}
          </Trans>,
        ),
      ).toBe('Hello Joe');
      expect(
        text(
          <Trans i18n={i18n} values={{ name: 'Joe' }}>
            Hello {{ name }}
          </Trans>,
        ),
      ).toBe('Hello Joe');
    });

    it('with a t that returns the key', async () => {
      const i18n = await setup();
      expect(
        text(
          <Trans i18n={i18n} t={(k) => k} i18nKey="greeting" values={{ name: 'Joe' }}>
            Hello {{ name }}
          </Trans>,
        ),
      ).toBe('Hello Joe');
    });

    it('with a t that returns the default value, as before the namespace is loaded', async () => {
      const i18n = await setup();
      expect(
        text(
          <Trans
            i18n={i18n}
            t={(k, o) => o.defaultValue}
            i18nKey="greeting"
            values={{ name: 'Joe' }}
          >
            Hello {{ name }}
          </Trans>,
        ),
      ).toBe('Hello Joe');
    });

    it('with skipInterpolation', async () => {
      const i18n = await setup();
      expect(
        text(
          <Trans
            i18n={i18n}
            i18nKey="greeting"
            values={{ name: 'Joe' }}
            tOptions={{ skipInterpolation: true }}
          >
            Hello {{ name }}
          </Trans>,
        ),
      ).toBe('Hi Joe');
    });

    it('with a format plugin', async () => {
      const formatPlugin = { type: 'i18nFormat', init() {}, parse: (res) => res };
      const i18n = await setup({}, [formatPlugin]);
      expect(
        text(
          <Trans i18n={i18n} i18nKey="greeting" values={{ name: 'Joe' }}>
            Hello {{ name }}
          </Trans>,
        ),
      ).toBe('Hi Joe');
    });
  });
});

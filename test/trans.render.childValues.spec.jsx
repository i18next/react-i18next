import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import i18next from 'i18next';
import { Trans } from '../src/Trans';

// Object children (`{{ name }}`) are interpolated after parsing. When Trans interpolates before parsing
// (count, values or defaultVariables), its t() call keeps their placeholders through a
// missingInterpolationHandler, so i18next >= 26.7 does not log them as missing variables.
describe('Trans with count and an object child', () => {
  afterEach(cleanup);

  const setup = async (options = {}) => {
    const warn = vi.fn();
    const i18n = i18next.createInstance();
    await i18n.use({ type: 'logger', log: () => {}, warn, error: () => {} }).init({
      debug: true,
      lng: 'en',
      fallbackLng: 'en',
      resources: {
        en: {
          translation: {
            inbox_one: 'Hello <1>{{name}}</1>, you have {{count}} message.',
            inbox_other: 'Hello <1>{{name}}</1>, you have {{count}} messages.',
          },
        },
      },
      ...options,
    });
    const t = vi.fn((...args) => i18n.t(...args));
    const missing = () =>
      warn.mock.calls
        .map((args) => args[0][0])
        .filter((m) => m.includes('missed to pass in variable'));
    return { i18n, t, missing };
  };

  const name = 'Ann';
  const renderInbox = ({ i18n, t }) =>
    render(
      <Trans i18n={i18n} t={t} i18nKey="inbox" count={2}>
        Hello <b>{{ name }}</b>, you have {{ count: 2 }} messages.
      </Trans>,
    );

  it('renders the child value and keeps its placeholder for after parsing', async () => {
    const ctx = await setup();
    const { container } = renderInbox(ctx);
    expect(container).toHaveTextContent('Hello Ann, you have 2 messages.');
    expect(container).toContainHTML('<b>Ann</b>');

    const handler = ctx.t.mock.calls[0][1].missingInterpolationHandler;
    expect(handler('Hello {{name}}', ['{{name}}', 'name'])).toBe('{{name}}');
    expect(ctx.missing()).toEqual([]);
  });

  it('leaves a handler of the user and skipOnVariables: false alone', async () => {
    const own = vi.fn(() => '');
    const withHandler = await setup({ missingInterpolationHandler: own });
    renderInbox(withHandler);
    expect(withHandler.t.mock.calls[0][1].missingInterpolationHandler).toBeUndefined();

    const noSkip = await setup({ interpolation: { skipOnVariables: false } });
    renderInbox(noSkip);
    expect(noSkip.t.mock.calls[0][1].missingInterpolationHandler).toBeUndefined();
  });

  it('adds no handler without object children', async () => {
    const ctx = await setup();
    render(<Trans i18n={ctx.i18n} t={ctx.t} i18nKey="inbox" count={1} values={{ name }} />);
    expect(ctx.t.mock.calls[0][1].missingInterpolationHandler).toBeUndefined();
  });

  it('renders a variable passed as undefined as empty, as without the handler', async () => {
    const ctx = await setup();
    const { container } = render(
      <Trans i18n={ctx.i18n} t={ctx.t} i18nKey="inbox" count={2} values={{ name: undefined }}>
        Hello <b>{{ name }}</b>, you have {{ count: 2 }} messages.
      </Trans>,
    );
    // an explicit undefined in values wins over the child, as without the handler
    expect(container).toContainHTML('<b></b>');
    expect(container).toHaveTextContent('Hello , you have 2 messages.');
    const handler = ctx.t.mock.calls[0][1].missingInterpolationHandler;
    expect(handler('Hi {{user}}', ['{{user}}', 'user'], { user: undefined })).toBe('');
    expect(handler('Hi {{- user}}', ['{{- user}}', ' user'], { user: undefined })).toBe('');
  });

  it('adds no handler when the escape would change a child placeholder', async () => {
    const ctx = await setup({
      interpolation: {
        escape: (str) => str.replace(/[^\x20-\x7e]/g, (c) => `&#${c.charCodeAt(0)};`),
      },
    });
    const prénom = 'Ann';
    render(
      <Trans i18n={ctx.i18n} t={ctx.t} i18nKey="inbox" count={2}>
        Hello <b>{{ prénom }}</b>, you have {{ count: 2 }} messages.
      </Trans>,
    );
    expect(ctx.t.mock.calls[0][1].missingInterpolationHandler).toBeUndefined();
  });
});

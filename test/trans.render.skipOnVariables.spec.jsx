import { describe, it, beforeAll, afterEach, expect } from 'vitest';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { createInstance } from 'i18next';
import { Trans } from '../src/Trans';

// https://github.com/i18next/react-i18next/issues/1950
// <Trans> with children must not resolve variables inside a substituted value
// when interpolation.skipOnVariables is left at its default (true), same as t() does.
describe('trans with children honors interpolation.skipOnVariables', () => {
  let i18n;

  beforeAll(() => {
    i18n = createInstance();
    i18n.init({
      lng: 'en',
      resources: { en: { translation: { 'Hello {{name}}': 'Hello {{name}}' } } },
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('does not resolve a variable referenced by a value passed via the values prop', () => {
    const name = 'from-children';
    const { container } = render(
      <Trans i18n={i18n} values={{ name: '{{otherVar}}', otherVar: 'another value' }}>
        Hello {{ name }}
      </Trans>,
    );
    expect(container.textContent).toBe('Hello {{otherVar}}');
  });

  it('substitutes a self-referential value only once', () => {
    const name = 'from-children';
    const { container } = render(
      <Trans i18n={i18n} values={{ name: '{{name}} is my name' }}>
        Hello {{ name }}
      </Trans>,
    );
    expect(container.textContent).toBe('Hello {{name}} is my name');
  });

  it('does not resolve a variable referenced by a value passed as an object child', () => {
    const { container } = render(
      <Trans i18n={i18n}>
        Hello {{ name: '{{otherVar}}' }}
        {{ otherVar: 'another value' }}
      </Trans>,
    );
    // the original {{otherVar}} placeholder is a real variable and resolves; the
    // one coming from the substituted value must stay literal
    expect(container.textContent).toBe('Hello {{otherVar}}another value');
  });

  it('still interpolates plain values passed via the values prop', () => {
    const name = 'from-children';
    const { container } = render(
      <Trans i18n={i18n} values={{ name: 'Goldloli' }}>
        Hello {{ name }}
      </Trans>,
    );
    expect(container.textContent).toBe('Hello Goldloli');
  });
});

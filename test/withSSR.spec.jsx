import { describe, it, vitest, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { createInstance } from 'i18next';
import i18n from './i18n';
import { setI18n } from '../src/context';
import { withSSR } from '../src/withSSR';
import { useTranslation } from '../src/useTranslation';

vitest.unmock('../src/withSSR');

describe('withSSR', () => {
  afterEach(() => {
    cleanup();
  });

  const instance = createInstance();
  instance.init({ lng: 'en', fallbackLng: false, resources: {}, react: { useSuspense: false } });

  function TestComponent() {
    useTranslation('ns1');
    return <div>SSR</div>;
  }

  TestComponent.getInitialProps = async () => ({ foo: 'bar' });

  beforeAll(() => {
    setI18n(instance);
  });

  afterAll(() => {
    setI18n(i18n);
  });

  it('should export wrapped component', () => {
    const HocElement = withSSR()(TestComponent);
    expect(HocElement.WrappedComponent).toBe(TestComponent);
  });

  it('should set values', () => {
    const HocElement = withSSR()(TestComponent);
    const { container } = render(
      <HocElement initialI18nStore={{ de: { ns1: { hello: 'Hallo' } } }} initialLanguage="de" />,
    );
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        SSR
      </div>
    `);
    expect(instance.language).toBe('de');
    expect(instance.services.resourceStore.data).toEqual({ de: { ns1: { hello: 'Hallo' } } });
  });

  it('should get initialProps', async () => {
    const HocElement = withSSR()(TestComponent);

    expect.assertions(1);
    const props = await HocElement.getInitialProps({});

    const expected = {
      foo: 'bar',
      initialI18nStore: {
        de: {
          ns1: { hello: 'Hallo' },
        },
      },
      initialLanguage: 'de',
    };

    expect(props).toEqual(expected);
  });
});

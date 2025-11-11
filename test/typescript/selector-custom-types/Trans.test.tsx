import { describe, it, expectTypeOf } from 'vitest';
import * as React from 'react';
import { Trans, useTranslation } from 'react-i18next';

describe('<Trans />', () => {
  describe('default namespace', () => {
    it('standard usage', () => {
      <Trans i18nKey={($) => (expectTypeOf($.foo).toMatchTypeOf<'foo'>, $.foo)} />;
    });

    it(`raises a TypeError given a key that doesn't exist`, () => {
      // @ts-expect-error
      <Trans i18nKey={($) => $.Nope} />;
    });
  });

  describe('named namespace', () => {
    it('standard usage', () => {
      <Trans ns="custom" i18nKey={($) => (expectTypeOf($.foo).toEqualTypeOf<'foo'>, $.foo)} />;
    });

    it(`raises a TypeError given a namespace that doesn't exist`, () => {
      expectTypeOf<React.ComponentProps<typeof Trans>>()
        .toHaveProperty('ns')
        .extract<'Nope'>()
        // @ts-expect-error
        .toMatchTypeOf<'Nope'>();
    });
  });

  describe('array namespace', () => {
    it('should work with array namespace', () => (
      <>
        <Trans
          ns={['alternate', 'custom']}
          i18nKey={($) => (expectTypeOf($.baz).toEqualTypeOf<'baz'>(), $.baz)}
        />
        <Trans
          ns={['alternate', 'custom']}
          i18nKey={($) => (expectTypeOf($.alternate.baz).toEqualTypeOf<'baz'>(), $.baz)}
        />
        <Trans
          ns={['alternate', 'custom']}
          i18nKey={($) => (expectTypeOf($.custom.bar).toEqualTypeOf<'bar'>(), $.custom.bar)}
        />
        <Trans
          ns={['custom', 'alternate']}
          i18nKey={($) => (expectTypeOf($.alternate.baz).toEqualTypeOf<'baz'>(), $.alternate.baz)}
        />
        <Trans
          ns={['custom', 'alternate']}
          i18nKey={($) => (expectTypeOf($.bar).toEqualTypeOf<'bar'>(), $.bar)}
        />
        <Trans
          ns={['custom', 'alternate']}
          i18nKey={($) => (expectTypeOf($.custom.bar).toEqualTypeOf<'bar'>(), $.bar)}
        />
        <Trans
          ns={['custom', 'alternate']}
          i18nKey={($) => (
            expectTypeOf($.alternate.foobar.deep.deeper.deeeeeper).toEqualTypeOf<'foobar'>(),
            $.alternate.foobar.deep.deeper.deeeeeper
          )}
        />
      </>
    ));

    it(`raises a TypeError given a key that's not present inside any namespace`, () => {
      <>
        {/* @ts-expect-error */}
        <Trans ns={['alternate', 'custom']} i18nKey={($) => $.bar} />
        {/* @ts-expect-error */}
        <Trans ns={['alternate', 'custom']} i18nKey={($) => $.custom.baz} />
      </>;
    });
  });

  describe('usage with `t` function', () => {
    it('should work when providing `t` function', () => {
      const { t } = useTranslation('alternate');
      <Trans
        t={t}
        i18nKey={($) => (expectTypeOf($.foobar.barfoo).toEqualTypeOf<'barfoo'>(), $.foobar.barfoo)}
      />;
    });

    it('should work when providing `t` function with a prefix', () => {
      const { t } = useTranslation('alternate', { keyPrefix: 'foobar.deep' });
      <Trans
        t={t}
        i18nKey={($) => (
          expectTypeOf($.deeper.deeeeeper).toEqualTypeOf<'foobar'>(),
          $.deeper.deeeeeper
        )}
      />;
    });

    it('raises a TypeError given a key-prefixed `t` function and an invalid key', () => {
      const { t } = useTranslation('alternate', { keyPrefix: 'foobar.deep' });
      // @ts-expect-error
      <Trans t={t} i18nKey={($) => $.xxx} />;
    });
  });

  describe('interpolation', () => {
    it('should work with text and interpolation', () => {
      expectTypeOf(Trans).toBeCallableWith({
        children: <>foo {{ var: '' }}</>,
      });
    });

    it('should work with Interpolation in HTMLElement', () => {
      expectTypeOf(Trans).toBeCallableWith({
        children: (
          <>
            foo <strong>{{ var: '' }}</strong>
          </>
        ),
      });
    });

    it('should work with text and interpolation as children of an  HTMLElement', () => {
      expectTypeOf(Trans).toBeCallableWith({
        children: <span>foo {{ var: '' }}</span>,
      });
    });
  });

  describe('values prop with interpolation type hints (Selector API)', () => {
    it('should accept correct values for interpolation with selector', () => {
      // <Trans i18nKey={($) => $.title} values={{ appName: 'My App' }} />
      <Trans i18nKey={($) => $.title} values={{ appName: 'My App' }} />;
    });

    it('should accept correct values with multiple interpolation variables', () => {
      // <Trans i18nKey={($) => $.message} values={{ count: 5, sender: 'John' }} />
      <Trans i18nKey={($) => $.message} values={{ count: 5, sender: 'John' }} />;
    });

    it('should work with keys that have no interpolation', () => {
      // Keys without interpolation accept empty values object
      <Trans i18nKey={($) => $.foo} values={{}} />;
    });

    it('should work with greeting key', () => {
      // <Trans i18nKey={($) => $.greeting} values={{ name: 'John' }} />
      <Trans i18nKey={($) => $.greeting} values={{ name: 'John' }} />;
    });

    // Note: Negative tests for Selector API are currently not working
    // because the type system cannot extract interpolation variables from
    // the SelectorFn return type. This is a known limitation.
    // The positive tests above verify that correct usage works.

    it('should work with t function and provide type hints', () => {
      const { t } = useTranslation('custom');

      // When using t function with selector, values prop gets same type hints
      <Trans t={t} i18nKey={($) => $.title} values={{ appName: 'My App' }} />;
    });

    it('should work with namespace selector', () => {
      // Test with explicit namespace
      <Trans ns="custom" i18nKey={($) => $.title} values={{ appName: 'My App' }} />;
    });

    it('should work with context key that has interpolation', () => {
      // Test with context namespace that has interpolation (using plural form)
      <Trans ns="context" i18nKey={($) => $.dessert_muffin} values={{ count: 5 }} count={5} />;
    });
  });
});

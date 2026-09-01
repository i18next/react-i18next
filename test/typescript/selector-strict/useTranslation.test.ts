import { describe, it, expectTypeOf, assertType } from 'vitest';
import { useTranslation } from 'react-i18next';

describe('useTranslation under enableSelector: "strict"', () => {
  describe('default namespace', () => {
    it('requires an explicit namespace prefix', () => {
      const [t] = useTranslation();

      expectTypeOf(t(($) => $.custom.foo)).toEqualTypeOf<'foo'>();
    });

    it('raises a TypeError given a flat-primary path (no ns prefix)', () => {
      const [t] = useTranslation();
      // @ts-expect-error
      assertType<string>(t(($) => $.foo));
    });
  });

  describe('named namespace', () => {
    it('still requires the namespace prefix', () => {
      const [t] = useTranslation('alternate');

      expectTypeOf(t(($) => $.alternate.baz)).toEqualTypeOf<'baz'>();
    });

    it('raises a TypeError given a key that is not in the namespace', () => {
      const [t] = useTranslation('alternate');
      // @ts-expect-error
      assertType<string>(t(($) => $.alternate.fake));
    });
  });

  describe('namespace as array', () => {
    it('exposes every namespace under its own prefix', () => {
      const [t] = useTranslation(['alternate', 'custom']);

      expectTypeOf(t(($) => $.alternate.baz)).toEqualTypeOf<'baz'>();
      expectTypeOf(t(($) => $.custom.foo)).toEqualTypeOf<'foo'>();
    });

    it('raises a TypeError given a flat-primary path', () => {
      const [t] = useTranslation(['alternate', 'custom']);
      // @ts-expect-error
      assertType<string>(t(($) => $.baz));
    });
  });

  describe('with `keyPrefix`', () => {
    it('should work with a selector keyPrefix', () => {
      const [t] = useTranslation('alternate', {
        keyPrefix: ($) => $.alternate.foobar.deep,
      });

      expectTypeOf(t(($) => $.deeper.deeeeeper)).toEqualTypeOf<'foobar'>();
    });

    it('should return objects from a selector keyPrefix', () => {
      const [t] = useTranslation('alternate', {
        keyPrefix: ($) => $.alternate.foobar,
      });

      expectTypeOf(t(($) => $.deep.deeper, { returnObjects: true })).toEqualTypeOf<{
        deeeeeper: 'foobar';
      }>();
    });

    it('raises a TypeError given a key outside the selector keyPrefix', () => {
      const [t] = useTranslation('alternate', {
        keyPrefix: ($) => $.alternate.foobar.deep,
      });
      // @ts-expect-error
      assertType<string>(t(($) => $.abc));
    });
  });
});

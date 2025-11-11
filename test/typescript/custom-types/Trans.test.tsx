import { describe, it, expectTypeOf } from 'vitest';
import * as React from 'react';
import { Trans, useTranslation } from 'react-i18next';

describe('<Trans />', () => {
  describe('default namespace', () => {
    it('standard usage', () => {
      // <Trans i18nKey="foo">foo</Trans>
      expectTypeOf(Trans).toBeCallableWith({
        i18nKey: 'foo',
      });
    });

    it('should trow if key do not exist', () => {
      expectTypeOf<React.ComponentProps<typeof Trans>>()
        .toHaveProperty('i18nKey')
        .extract<'Nope'>()
        // @ts-expect-error
        .toMatchTypeOf<'Nope'>();
    });
  });

  describe('named namespace', () => {
    it('standard usage', () => {
      // <Trans ns="custom" i18nKey="foo">foo</Trans>
      expectTypeOf(Trans).toBeCallableWith({
        ns: 'custom',
        i18nKey: 'foo',
      });
    });

    it('should trow if namespace do not exist', () => {
      expectTypeOf<React.ComponentProps<typeof Trans>>()
        .toHaveProperty('ns')
        .extract<'Nope'>()
        // @ts-expect-error
        .toMatchTypeOf<'Nope'>();
    });
  });

  describe('array namespace', () => {
    it('should work with array namespace', () => {
      // <Trans ns={['alternate', 'custom']} i18nKey={['alternate:baz', 'custom:bar']} />
      expectTypeOf(Trans).toBeCallableWith({
        ns: ['alternate', 'custom'],
        i18nKey: ['alternate:baz', 'custom:bar'],
      });
    });

    it('should throw error if key is not present inside namespaces', () => {
      // <Trans ns={['alternate', 'custom']} i18nKey={['alternate:baz', 'custom:bar']} />
      expectTypeOf(Trans).toBeCallableWith({
        ns: ['alternate', 'custom'],
        // @ts-expect-error
        i18nKey: ['alternate:baz', 'custom:bar2'],
      });
    });
  });

  describe('usage with `t` function', () => {
    it('should work when providing `t` function', () => {
      const { t } = useTranslation('alternate');

      // <Trans t={t} i18nKey="foobar.barfoo">foo</Trans>
      expectTypeOf(Trans).toBeCallableWith({
        t,
        i18nKey: 'foobar.barfoo',
      });
    });

    it('should work when providing `t` function with a prefix', () => {
      const { t } = useTranslation('alternate', { keyPrefix: 'foobar.deep' });

      // <Trans t={t} i18nKey="deeper.deeeeeper">foo</Trans>
      expectTypeOf<typeof Trans<'deeper.deeeeeper', 'alternate', 'foobar.deep'>>().toBeCallableWith(
        {
          t,
          i18nKey: 'deeper.deeeeeper',
        },
      );
    });

    it('should throw error with `t` function with key prefix and wrong `i18nKey`', () => {
      const { t } = useTranslation('alternate', { keyPrefix: 'foobar.deep' });

      // <Trans t={t} i18nKey="xxx">foo</Trans>
      expectTypeOf<typeof Trans<'deeper.deeeeeper', 'alternate', 'foobar.deep'>>().toBeCallableWith(
        {
          t,
          // @ts-expect-error
          i18nKey: 'xxx',
        },
      );
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

  describe('values prop with interpolation type hints', () => {
    it('should accept correct values for interpolation', () => {
      // <Trans i18nKey="title" values={{ appName: 'My App' }} />
      // The values prop now provides intellisense for the appName variable
      expectTypeOf(Trans).toBeCallableWith({
        i18nKey: 'title',
        values: { appName: 'My App' },
      });
    });

    it('should accept correct values with multiple interpolation variables', () => {
      // <Trans i18nKey="message" values={{ count: 5, sender: 'John' }} />
      // The values prop now provides intellisense for count and sender variables
      expectTypeOf(Trans).toBeCallableWith({
        i18nKey: 'message',
        values: { count: 5, sender: 'John' },
      });
    });

    it('should provide type hints for interpolation variables', () => {
      // The values prop type is now InterpolationMap<TFunctionReturn<...>>
      // which extracts variables from the translation string
      // This provides intellisense in IDEs showing: { appName: unknown }
      expectTypeOf(Trans).toBeCallableWith({
        i18nKey: 'title',
        values: { appName: 'My App' },
      });
    });

    it('should work with keys that have no interpolation', () => {
      // Keys without interpolation accept any values object
      expectTypeOf(Trans).toBeCallableWith({
        i18nKey: 'foo',
        values: {},
      });
    });

    it('should work with t function and provide type hints', () => {
      const { t } = useTranslation('custom');

      // When using t function, values prop gets same type hints
      expectTypeOf(Trans).toBeCallableWith({
        t,
        i18nKey: 'title',
        values: { appName: 'My App' },
      });
    });

    it('should work with greeting key', () => {
      // <Trans i18nKey="greeting" values={{ name: 'John' }} />
      expectTypeOf(Trans).toBeCallableWith({
        i18nKey: 'greeting',
        values: { name: 'John' },
      });
    });

    it('should reject incorrect interpolation variable names', () => {
      // Should fail: wrongName is not a valid interpolation variable for 'title'
      expectTypeOf(Trans).toBeCallableWith({
        i18nKey: 'title',
        // @ts-expect-error - wrongName is not a valid interpolation variable
        values: { wrongName: 'My App' },
      });
    });

    it('should reject missing required interpolation variables', () => {
      // Should fail: appName is required for 'title'
      // Test the values prop type directly
      type TitleProps = React.ComponentProps<typeof Trans<'title'>>;
      type ValuesType = TitleProps['values'];

      // @ts-expect-error - empty object should not be assignable when appName is required
      const invalidValues: ValuesType = {};

      expectTypeOf<ValuesType>().not.toMatchTypeOf<{}>();
    });

    it('should reject extra interpolation variables', () => {
      // Should fail: extra is not a valid interpolation variable for 'title'
      expectTypeOf(Trans).toBeCallableWith({
        i18nKey: 'title',
        // @ts-expect-error - extra is not a valid interpolation variable
        values: { appName: 'My App', extra: 'value' },
      });
    });
  });
});

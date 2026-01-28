import { describe, it, expectTypeOf, assertType } from 'vitest';
import { useTranslation } from 'react-i18next';
import { TFunction, i18n } from 'i18next';

describe('useTranslation with strictNoSuspense', () => {
  describe('with useSuspense: false', () => {
    it('should return strict discriminated union type', () => {
      const result = useTranslation('translation', { useSuspense: false });

      // The result should be a discriminated union
      expectTypeOf(result.ready).toEqualTypeOf<boolean>();
      // t should be TFunction | undefined when not narrowed
      expectTypeOf(result.t).toEqualTypeOf<TFunction<'translation', undefined> | undefined>();
    });

    it('should narrow t to TFunction when ready is checked', () => {
      const result = useTranslation('translation', { useSuspense: false });

      if (result.ready) {
        // After checking ready, t should be narrowed to TFunction
        expectTypeOf(result.t).toBeFunction();
        expectTypeOf(result.t).toBeCallableWith('foo');
      }
    });

    it('should narrow t to undefined when ready is false', () => {
      const result = useTranslation('translation', { useSuspense: false });

      if (!result.ready) {
        expectTypeOf(result.t).toBeUndefined();
      }
    });

    it('should work with inline ready check', () => {
      const result = useTranslation('translation', { useSuspense: false });

      // This pattern should work with narrowing
      result.ready && result.t('foo');
    });

    it('should error when accessing t without checking ready', () => {
      const result = useTranslation('translation', { useSuspense: false });

      // This should cause a type error because t might be undefined
      // @ts-expect-error - t is possibly undefined
      assertType<string>(result.t('foo'));
    });

    it('should work with array destructuring returning union types', () => {
      const [t, i18nInstance, ready] = useTranslation('translation', { useSuspense: false });

      // When destructured, t is the union type
      expectTypeOf(t).toEqualTypeOf<TFunction<'translation', undefined> | undefined>();
      expectTypeOf(ready).toEqualTypeOf<boolean>();
    });

    it('should work with alternate namespace', () => {
      const result = useTranslation('alternate', { useSuspense: false });

      if (result.ready) {
        expectTypeOf(result.t).toBeCallableWith('baz');
      }
    });

    it('should work with undefined namespace', () => {
      const result = useTranslation(undefined, { useSuspense: false });

      expectTypeOf(result.t).toEqualTypeOf<TFunction<'translation', undefined> | undefined>();

      if (result.ready) {
        expectTypeOf(result.t).toBeCallableWith('foo');
      }
    });
  });

  describe('with useSuspense: true (default)', () => {
    it('should return normal response type when useSuspense is true', () => {
      const result = useTranslation('translation', { useSuspense: true });

      // t should always be TFunction, not a union
      expectTypeOf(result.t).toBeFunction();
      expectTypeOf(result.ready).toBeBoolean();
    });

    it('should return normal response type when useSuspense is not specified', () => {
      const result = useTranslation('translation');

      // t should always be TFunction, not a union
      expectTypeOf(result.t).toBeFunction();
      expectTypeOf(result.ready).toBeBoolean();
    });

    it('should return normal response type with no options', () => {
      const result = useTranslation();

      // t should always be TFunction, not a union
      expectTypeOf(result.t).toBeFunction();
      expectTypeOf(result.ready).toBeBoolean();
    });
  });
});

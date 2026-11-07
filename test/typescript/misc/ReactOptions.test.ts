import { it, expectTypeOf, assertType } from 'vitest';
import i18next from 'i18next';
import type { InitOptions, ReactOptions as CoreReactOptions } from 'i18next';
import { useTranslation, getDefaults } from 'react-i18next';
import type { ReactOptions } from 'react-i18next';

it('ReactOptions is filled in by react-i18next, importable from both packages', () => {
  expectTypeOf<ReactOptions>().toEqualTypeOf<CoreReactOptions>();
  expectTypeOf<NonNullable<InitOptions['react']>>().toEqualTypeOf<ReactOptions>();
  expectTypeOf<ReactOptions>().toHaveProperty('useSuspense').toEqualTypeOf<boolean | undefined>();
  expectTypeOf(getDefaults()).toEqualTypeOf<ReactOptions>();
});

it('checks the react options in init()', () => {
  i18next.init({ react: { useSuspense: false, bindI18n: 'languageChanged loaded' } });
  // @ts-expect-error not a react option
  i18next.init({ react: { useSuspence: false } });
  // @ts-expect-error useSuspense is a boolean
  i18next.init({ react: { useSuspense: 'nope' } });
});

it('accepts bindI18nStore in the useTranslation options', () => {
  assertType(useTranslation('ns', { bindI18nStore: 'added removed' }));
});

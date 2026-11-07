import { it, expectTypeOf } from 'vitest';
import { useContext } from 'react';
import { i18n } from 'i18next';
import { I18nContext } from 'react-i18next';

it('context', () => {
  // undefined outside an I18nextProvider
  expectTypeOf(useContext(I18nContext)).toEqualTypeOf<
    { i18n: i18n; defaultNS?: string | string[] } | undefined
  >();
  expectTypeOf(useContext(I18nContext)!).toHaveProperty('i18n').toEqualTypeOf<i18n>();
});

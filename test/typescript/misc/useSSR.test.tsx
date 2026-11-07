import { it, expectTypeOf } from 'vitest';
import { useSSR } from 'react-i18next';
import { i18n, Resource } from 'i18next';

it('useSSR', () => {
  expectTypeOf(useSSR).parameter(0).toEqualTypeOf<Resource>();
  expectTypeOf(useSSR).parameter(1).toEqualTypeOf<string>();
  expectTypeOf(useSSR).parameter(2).toEqualTypeOf<{ i18n?: i18n } | undefined>();

  expectTypeOf(useSSR).returns.toBeVoid();
});

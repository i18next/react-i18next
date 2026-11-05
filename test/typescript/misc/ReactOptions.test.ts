import { it, expectTypeOf } from 'vitest';
import i18next from 'i18next';
import type { ReactOptions } from 'i18next';
import { getDefaults } from 'react-i18next';

// on i18next 27, which declares ReactOptions empty, react-i18next's declaration fills it in
it('types the react options from i18next 26 and 27', () => {
  expectTypeOf(getDefaults().useSuspense).toEqualTypeOf<boolean | undefined>();
  expectTypeOf<ReactOptions>()
    .toHaveProperty('bindI18n')
    .toEqualTypeOf<string | false | undefined>();
  i18next.init({ react: { useSuspense: false, transKeepBasicHtmlNodesFor: ['br'] } });
  // @ts-expect-error useSuspense is a boolean
  i18next.init({ react: { useSuspense: 'nope' } });
});

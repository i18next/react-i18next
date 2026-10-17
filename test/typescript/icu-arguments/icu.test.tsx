import { describe, it, expectTypeOf } from 'vitest';
import * as React from 'react';
import { useTranslation, Trans, IcuTrans } from 'react-i18next';
import type { IcuTransProps } from 'react-i18next';
import { IcuTransWithoutContext } from '../../../IcuTransWithoutContext';

describe("parseInterpolation: 'icu'", () => {
  it('checks useTranslation t', () => {
    const { t } = useTranslation();
    t('greeting', { name: 'Ada' });
    // @ts-expect-error missing options
    t('greeting');
    // @ts-expect-error misspelled argument
    t('rows', { cnt: 1 });

    const { t: tDeep } = useTranslation('custom', { keyPrefix: 'deep' });
    tDeep('inner', { value: 1 });
    // @ts-expect-error missing argument behind keyPrefix
    tDeep('inner', {});

    const { t: tMulti } = useTranslation(['other', 'custom']);
    tMulti('welcome', { user: 'Ada' });
    // @ts-expect-error misspelled argument in the primary namespace
    tMulti('welcome', { usr: 'Ada' });
  });

  it('checks Trans values', () => {
    <Trans i18nKey="greeting" values={{ name: 'Ada' }} />;
    // @ts-expect-error misspelled value
    <Trans i18nKey="greeting" values={{ nmae: 'Ada' }} />;
    // @ts-expect-error count must be a number
    <Trans i18nKey="rows" values={{ count: 'two' }} />;
  });

  it('types IcuTrans values from the key', () => {
    const p = { defaultTranslation: '', content: [{ type: 'strong' }] };
    <IcuTrans {...p} i18nKey="rich" values={{ name: 'Ada' }} />;
    <IcuTrans {...p} i18nKey="plain" />;
    // @ts-expect-error misspelled value
    <IcuTrans {...p} i18nKey="rich" values={{ nmae: 'Ada' }} />;
    // @ts-expect-error a value of another key
    <IcuTrans {...p} i18nKey="rich" values={{ count: 1 }} />;
    // @ts-expect-error count must be a number
    <IcuTrans {...p} i18nKey="rows" values={{ count: '2' }} />;
    <IcuTrans {...p} ns="other" i18nKey="welcome" values={{ user: 'Ada' }} />;
    // @ts-expect-error misspelled value in another namespace
    <IcuTrans {...p} ns="other" i18nKey="welcome" values={{ usr: 'Ada' }} />;

    expectTypeOf<NonNullable<IcuTransProps<'rich'>['values']>>().toEqualTypeOf<{
      name: string | number;
    }>();
    // values stay optional, as on Trans: a conditionally required prop needs an
    // intersection, which breaks React.ComponentProps<typeof IcuTrans>
    <IcuTrans {...p} i18nKey="rich" />;
  });

  it('types IcuTransWithoutContext values from the key', () => {
    const { t, i18n } = useTranslation();
    const p = { defaultTranslation: '', content: [], t, i18n };
    <IcuTransWithoutContext {...p} i18nKey="rich" values={{ name: 'Ada' }} />;
    // @ts-expect-error misspelled value
    <IcuTransWithoutContext {...p} i18nKey="rich" values={{ nmae: 'Ada' }} />;
  });
});

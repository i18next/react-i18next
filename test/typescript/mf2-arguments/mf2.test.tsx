import { describe, it } from 'vitest';
import * as React from 'react';
import { useTranslation, Trans, IcuTrans } from 'react-i18next';

describe("parseInterpolation: 'mf2'", () => {
  it('checks useTranslation t', () => {
    const { t } = useTranslation();
    t('greeting', { name: 'Ada' });
    // @ts-expect-error missing options
    t('greeting');
    // @ts-expect-error count must be a number
    t('rows', { count: 'one' });
  });

  it('checks Trans and IcuTrans values', () => {
    <Trans i18nKey="rich" values={{ name: 'Ada' }} />;
    // @ts-expect-error misspelled value
    <Trans i18nKey="rich" values={{ nmae: 'Ada' }} />;
    const p = { defaultTranslation: '', content: [] };
    <IcuTrans {...p} i18nKey="rich" values={{ name: 'Ada' }} />;
    // @ts-expect-error misspelled value
    <IcuTrans {...p} i18nKey="rich" values={{ nmae: 'Ada' }} />;
  });
});

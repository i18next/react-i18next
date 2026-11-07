import { describe, it, expectTypeOf, assertType } from 'vitest';
import * as React from 'react';
import { Trans, IcuTrans, useTranslation } from 'react-i18next';

describe('strictInterpolationChecks', () => {
  it('requires the variables in t()', () => {
    const { t } = useTranslation();
    assertType<string>(t('title', { appName: 'App' }));
    assertType<string>(t('plain'));
    // @ts-expect-error appName is missing
    t('title');
  });

  it('keeps values optional on Trans', () => {
    expectTypeOf(Trans).toBeCallableWith({ i18nKey: 'title' });
    assertType<React.ReactElement>(<Trans i18nKey="title" values={{ appName: 'App' }} />);
    // @ts-expect-error a wrong variable is still an error
    assertType<React.ReactElement>(<Trans i18nKey="title" values={{ appNme: 'App' }} />);
    assertType<React.ReactElement>(
      <Trans i18nKey="greeting">Hello {{ userName: 'Ann' } as unknown as React.ReactNode}</Trans>,
    );
  });

  it('keeps values optional on IcuTrans', () => {
    expectTypeOf(IcuTrans).toBeCallableWith({
      i18nKey: 'title',
      defaultTranslation: 'Title: <0>{appName}</0>',
      content: [{ type: 'strong' }],
    });
  });
});

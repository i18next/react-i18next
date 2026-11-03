import { describe, it, assertType } from 'vitest';
import * as React from 'react';
import { Trans, useTranslation } from 'react-i18next';

/**
 * Regression test for https://github.com/i18next/react-i18next/issues/1913
 *
 * The `values` prop of `Trans` was requiring ALL interpolation variables from
 * the entire namespace instead of only the variables for the specific `i18nKey`.
 */
describe('issue #1913 - values prop should only require variables for the given key', () => {
  it('should work in JSX without t', () => {
    assertType<React.ReactElement>(<Trans i18nKey="title" values={{ appName: 'My App' }} />);
  });

  it('should work in JSX with t from useTranslation', () => {
    const { t } = useTranslation();
    assertType<React.ReactElement>(<Trans t={t} i18nKey="title" values={{ appName: 'My App' }} />);
  });

  it('should work in JSX with t from array namespace', () => {
    const { t } = useTranslation(['custom']);
    assertType<React.ReactElement>(<Trans t={t} i18nKey="title" values={{ appName: 'My App' }} />);
  });

  it('should work in JSX with explicit ns', () => {
    const { t } = useTranslation(['custom']);
    assertType<React.ReactElement>(
      <Trans t={t} ns="custom" i18nKey="title" values={{ appName: 'My App' }} />,
    );
  });

  it('should reject variables of another key', () => {
    const { t } = useTranslation();
    assertType<React.ReactElement>(<Trans t={t} i18nKey="greeting" values={{ userName: 'Ann' }} />);
    // @ts-expect-error - 'userName' belongs to 'greeting', not to 'title'
    assertType<React.ReactElement>(<Trans t={t} i18nKey="title" values={{ userName: 'Ann' }} />);
    // @ts-expect-error - 'appName' belongs to 'title', not to 'greeting'
    assertType<React.ReactElement>(<Trans i18nKey="greeting" values={{ appName: 'My App' }} />);
  });
});

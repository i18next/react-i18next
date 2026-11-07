import { it, assertType } from 'vitest';
import * as React from 'react';
import { Trans, IcuTrans, useTranslation } from 'react-i18next';

it('joins a key prefix with "." when keySeparator is false, as getFixedT does', () => {
  const { t } = useTranslation('translation', { keyPrefix: 'nested' });
  assertType<string>(t('c', { name: 'Ann' }));
  // the variables of `nested.c` type the values of a Trans with that t
  assertType<React.ReactElement>(<Trans t={t} i18nKey="c" values={{ name: 'Ann' }} />);
  // @ts-expect-error not a variable of nested.c
  assertType<React.ReactElement>(<Trans t={t} i18nKey="c" values={{ nme: 'Ann' }} />);
  // and of an IcuTrans
  assertType<React.ReactElement>(
    <IcuTrans
      t={t}
      i18nKey="c"
      defaultTranslation="Hello {name}"
      content={[]}
      values={{ name: 'Ann' }}
    />,
  );
  assertType<React.ReactElement>(
    <IcuTrans
      t={t}
      i18nKey="c"
      defaultTranslation="Hello {name}"
      content={[]}
      // @ts-expect-error not a variable of nested.c
      values={{ nme: 'Ann' }}
    />,
  );
});

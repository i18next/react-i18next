import { it, assertType } from 'vitest';
import * as React from 'react';
import { Trans } from 'react-i18next';

it('leaves HTMLAttributes children alone unless augment-react is imported', () => {
  // objects directly inside Trans are fine
  assertType<React.ReactElement>(<Trans>Hello {{ name: 'Ann' }}</Trans>);
  assertType<React.ReactElement>(
    <Trans>
      {/* @ts-expect-error an object inside an HTML element needs the opt-in */}
      Hello <strong>{{ name: 'Ann' }}</strong>
    </Trans>,
  );
});

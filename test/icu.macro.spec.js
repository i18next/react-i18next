import pluginTester from 'babel-plugin-tester';
import plugin from 'babel-plugin-macros';

pluginTester({
  plugin,
  snapshot: true,
  babelOptions: { filename: __filename, parserOpts: { plugins: ['jsx'] } },
  tests: [
    `
      import { Trans } from '../icu.macro'

      const x = <Trans>Welcome, { name }!</Trans>
    `,

    `
      import { Trans } from '../icu.macro'

      const x = <Trans>Welcome, <strong>{ name }</strong>!</Trans>
    `,

    `
      import { Trans } from '../icu.macro'

      const x = <Trans>Trainers: { trainersCount, number }</Trans>
    `,

    `
      import { Trans } from '../icu.macro'

      const x = <Trans>Trainers: <strong>{ trainersCount, number }</strong>!</Trans>
    `,

    `
      import { Trans } from '../icu.macro'

      const x = <Trans>Caught on { catchDate, date, short }</Trans>
    `,

    `
      import { Trans } from '../icu.macro'

      const x = <Trans>Caught on <strong>{ catchDate, date, short }</strong>!</Trans>
    `,

    `
      import { Select } from '../icu.macro'

      const x = <Select
        switch={gender}
        male="He avoids bugs."
        female="She avoids bugs."
        other="They avoid bugs."
      />
    `,

    `
      import { Select } from '../icu.macro'

      const x = <Select
        switch={gender}
        male={<Trans><strong>He</strong> avoids bugs.</Trans>}
        female={<Trans><strong>She</strong> avoids bugs.</Trans>}
        other={<Trans><strong>They</strong> avoid bugs.</Trans>}
      />
    `,

    `
      import { Plural } from '../icu.macro'

      const x = <Plural
        count={itemsCount1}
        $0="There is no item."
        one="There is # item."
        other="There are # items."
      />
    `,

    `
      import { Plural } from '../icu.macro'

      const x = <Plural
        i18nKey="testKey"
        count={itemsCount3}
        $0={<Trans>There is <strong>no</strong> item.</Trans>}
        one={<Trans>There is <strong>#</strong> item.</Trans>}
        other={<Trans>There are <strong>#</strong> items.</Trans>}
      />
    `,
  ],
});

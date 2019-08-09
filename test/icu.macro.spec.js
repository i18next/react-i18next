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
      import { useTranslation } from 'react-i18next'

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
      import { Trans } from '../icu.macro'

      const x = <Trans defaults="Trainers: { trainersCount, number }" />
    `,

    `
      import { Trans } from '../icu.macro'

      const x = <Trans i18nKey="trainersWithDefaults" defaults="Trainers: <strong>{ trainersCount, number }</strong>!" />
    `,

    `
      import { Trans } from '../icu.macro'

      const x = <Trans i18nKey="caughtWithDefaults" defaults="Caught on { catchDate, date, short }" />
    `,

    `
      import { Trans } from '../icu.macro'

      const x = <Trans defaults="Caught on <strong>{ catchDate, date, short }</strong>!" />
    `,

    `
      import { Trans } from '../icu.macro'
      const Link = ({to, children}) => (<a href={to}>{children}</a>)
      
      const x = <Trans defaults="Caught on <Link to='/dest'>{ catchDate, date, short }</Link>!" values={{catchDate: Date.now()}}>This should be overridden by defaults</Trans>
    `,

    `
      import { Trans } from '../icu.macro'
      
      const x = <Trans i18nKey="trainersWithDefaults" values={{trainersCount}} defaults="Trainers: <strong>{ trainersCount, number }</strong>!" components={[]} />
    `,

    `
      import { Select } from '../icu.macro'

      const x = <Select
        i18nKey="selectExample"
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
        $0="There are no items."
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

    `
      import { SelectOrdinal } from '../icu.macro'

      const x = <SelectOrdinal
        count={position}
        zero="You are #th in line"
        one="You are #st in line"
        two="You are #nd in line"
        few="You are #rd in line"
        many="You are #th in line"
        other="You are #th in line"
        $7="You are in the lucky #th place in line"
      />
    `,

    `
      import { SelectOrdinal } from '../icu.macro'

      const x = <SelectOrdinal
        i18nKey="testKey"
        count={position}
        one={<Trans>You are <strong>#st in line</strong></Trans>}
        two={<Trans>You are <strong>#nd in line</strong></Trans>}
        few={<Trans>You are <strong>#rd in line</strong></Trans>}
        other={<Trans>You are <strong>#th in line</strong></Trans>}
        $0={<Trans>You are <strong>#th in line</strong></Trans>}
      />
    `,
  ],
});

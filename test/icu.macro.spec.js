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

    `
      import React from 'react'
      import { useTranslation } from 'react-i18next'
      import { Plural, Select, SelectOrdinal, Trans } from '../icu.macro'
      const Link = ({to, children}) => (<a href={to}>{children}</a>)
      
      export default function TestPage({count = 1}) {
        const [t] = useTranslation()
        const catchDate = Date.now()
        const completion = 0.75
        const gender = Math.random() < 0.5 ? 'female' : 'male'
        return (
          <>
            {t('sample.text', 'Some sample text with {word} {gender} {count, number} {catchDate, date} {completion, number, percent}', {word: 'interpolation', gender, count, catchDate, completion})}
            <Plural i18nKey="plural"
              count={count}
              values={{linkPath: "/item/" + count}}
              $0={<Trans><Link to='/cart'>Your cart</Link> is <strong>empty</strong>.</Trans>}
              one={<Trans>You have <strong># item</strong> in <Link to='/cart'>your cart</Link>.</Trans>}
              other={<Trans>You have <strong># items</strong> in <Link to='/cart'>your cart</Link>.</Trans>}
            />
            <Select
              i18nKey="select"
              switch={gender}
              female={<Trans>These are <Link to='/items'>her items</Link></Trans>}
              male={<Trans>These are <Link to='/items'>his items</Link></Trans>}
              other={<Trans>These are <Link to='/items'>their items</Link></Trans>}
            />
            <SelectOrdinal i18nKey="ordinal"
              count={itemIndex+1}
              values={{linkPath: "/item/" + itemIndex}}
              one={<Trans>Your <Link to={linkPath}><strong>#st</strong> item</Link></Trans>}
              two={<Trans>Your <Link to={linkPath}><strong>#nd</strong> item</Link></Trans>}
              few={<Trans>Your <Link to={linkPath}><strong>#rd</strong> item</Link></Trans>}
              other={<Trans>Your <Link to={linkPath}><strong>#th</strong> item</Link></Trans>}
            />
            <Trans i18nKey="percent" defaults="You&apos;ve completed <Link to='/tasks'>{completion, number, percent} of your tasks</Link>."/>
            <Trans i18nKey="date" defaults="Caught on <Link to='/dest'>{ catchDate, date, short }</Link>!"/>
            <SelectOrdinal
              i18nKey="ordinal.prettier"
              count={count}
              values={{ linkPath: \`/item/\${count}\`, type: 'item', prop }}
              one={
                <Trans>
                  Your{' '}
                  <Link to={linkPath}>
                    <strong>#st</strong> {type}
                  </Link>
                </Trans>
              }
              two={
                <Trans>
                  Your{' '}
                  <Link to={linkPath}>
                    <strong>#nd</strong> {type}
                  </Link>
                </Trans>
              }
              few={
                <Trans>
                  Your{' '}
                  <Link to={linkPath}>
                    <strong>#rd</strong> {type}
                  </Link>
                </Trans>
              }
              other={
                <Trans>
                  Your{' '}
                  <Link to={linkPath}>
                    <strong>#th</strong> {type}
                  </Link>
                </Trans>
              }
            />
            <Select
              i18nKey="select.expr.prettier"
              switch={\`\${gender}Person\`}
              values={{ linkPath: \`/users/\${number}\`, type: 'bugs' }}
              malePerson={
                <Trans>
                  <Link to={linkPath}>
                    <strong>He</strong>
                  </Link>{' '}
                  avoids {type}.
                </Trans>
              }
              femalePerson={
                <Trans>
                  <Link to={linkPath}>
                    <strong>She</strong>
                  </Link>{' '}
                  avoids {type}.
                </Trans>
              }
              other={
                <Trans>
                  <Link to={linkPath}>
                    <strong>They</strong>
                  </Link>{' '}
                  avoid {type}.
                </Trans>
              }
            />
          </>
        )
      }
    `,
  ],
});

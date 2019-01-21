import * as React from 'react'
import i18next from 'i18next'
import { translate, WithNamespaces } from "react-i18next";

interface ComponentProps extends WithNamespaces { }

const Component: React.FC<ComponentProps> = (props) => {
  const { t } = props;

  return <span>
    {t('test.key')}
  </span>
}

const TranslatedComponent = translate()(Component)

function describe(name: string, fn: () => void) {}
function test(name: string, fn: () => void) {}

describe('translated component', () => {
  test('renders correctly', () => {
    const props: WithNamespaces = {
      tReady: true,
      i18n: i18next,
      t: (key, options) => key
    }

    return <TranslatedComponent {...props}/>
  })
})
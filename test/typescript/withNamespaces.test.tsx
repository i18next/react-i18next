import * as React from 'react'
import { withNamespaces, WithNamespaces } from 'react-i18next'

interface WithInnerRefProps extends WithNamespaces {
  outerRef: (ref: WithInnerRef | null) => void;
}

class WithInnerRef extends React.Component<WithInnerRefProps> {
  render() {
    const { t } = this.props

    return (
      <div className="App">
        <h3>{t('content.header')}</h3>
        <div> {t('content.body')}</div>
      </div>
    )
  }
}
export default withNamespaces(undefined, {
  innerRef: (instance: WithInnerRef) => {
    if (instance && instance.props.outerRef) {
      instance.props.outerRef(instance);
    }
  }
})(WithInnerRef)

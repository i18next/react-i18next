import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

interface FooProps {
  bar: 'baz';
}

class Foo extends React.Component<FooProps & WithTranslation> {
  render() {
    const { t, i18n } = this.props;
    return <h2>{t('title')}</h2>;
  }
}
const TranslatedFoo = withTranslation()(Foo);

// page uses the hook
function usage() {
  return <TranslatedFoo bar="baz" />;
}

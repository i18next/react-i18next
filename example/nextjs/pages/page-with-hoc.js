import React from 'react';
import withNamespaces from '../lib/withNamespaces';

class PageWithHOC extends React.Component {
  render() {
    const { t } = this.props;
    return (
      <div>
        <h1>{t('page-with-hoc:title')}</h1>
      </div>
    );
  }
}

export default withNamespaces(['page-with-hoc'])(PageWithHOC);

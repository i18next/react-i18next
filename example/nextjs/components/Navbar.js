import React from 'react';
import withNamespaces from '../lib/withNamespaces';

class Navbar extends React.Component {
  render() {
    const { t } = this.props;
    return (
      <div>
        <h1>{t('navbar:title')}</h1>
      </div>
    );
  }
}

export default withNamespaces(['navbar'])(Navbar);

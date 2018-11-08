import React from 'react';

import Link from '../components/Link';
import LocaleSwitcher from '../components/LocaleSwitcher';
import Navbar from '../components/Navbar';

export default class Homepage extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <LocaleSwitcher />
        <Link href="/page-with-hoc">
          <a>Go to page with HOC</a>
        </Link>
      </React.Fragment>
    );
  }
}

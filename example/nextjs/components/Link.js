/*
  This `Link` component is a wrap of the standard
  NextJs `Link` component, with some simple lang
  redirect logic in place.

  If you haven't already, read this issue comment:
  https://github.com/zeit/next.js/issues/2833#issuecomment-414919347

  This component automatically provides this functionality:
  <Link href="/product?slug=something" as="/products/something">

  Wherein `slug` is actually our i18n lang, and it gets
  pulled automatically.

  Very important: if you import `Link` from NextJs directly,
  and not this file, your lang subpath routing will break.
*/

import React from 'react';
import NextLink from 'next/link';

import { translation } from '../config';
import withNamespaces from '../lib/withNamespaces';
import i18n from '../i18n';

class Link extends React.Component {
  render() {
    const { children, href } = this.props;
    const lng = i18n.languages[0];
    if (translation.localeSubpaths && lng !== translation.defaultLanguage) {
      return (
        <NextLink href={`${href}?lng=${lng}`} as={`/${lng}${href}`}>
          {children}
        </NextLink>
      );
    }
    return <NextLink href={href}>{children}</NextLink>;
  }
}

/*
  Usage of `withNamespaces` here is just to
  force `Link` to rerender on language change
*/
export default withNamespaces()(Link);

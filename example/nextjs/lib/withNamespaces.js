/*

  Here we are just returning the built-in `withNamespaces`
  HOC from `react-i18next` core, but with one added
  piece of functionality: we keep track of namespaces
  used by simply modifying an array on our i18n instance
  directly.

  We will use this nsFromReactTree array in SSR to
  serialize and send initial translation data to the client
  for exactly the namespaces we used.

  This allows you to wrap pages, components, and anything
  else with `withNamespaces`.

*/

import { withNamespaces } from 'react-i18next';

import i18n from '../i18n';

export default (namespaces = []) => {
  i18n.nsFromReactTree = [...new Set(i18n.nsFromReactTree.concat(namespaces))];
  return withNamespaces(namespaces);
};

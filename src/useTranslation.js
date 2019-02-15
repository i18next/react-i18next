import { useState, useEffect, useContext } from 'react';
import {
  getI18n,
  getDefaults,
  ReportNamespaces,
  getHasUsedI18nextProvider,
  I18nContext,
} from './context';
import { warnOnce, loadNamespaces, hasLoadedNamespace } from './utils';

export function useTranslation(ns, props = {}) {
  // assert we have the needed i18nInstance
  const { i18n: i18nFromProps } = props;
  const { i18n: i18nFromContext } = getHasUsedI18nextProvider() ? useContext(I18nContext) : {};
  const i18n = i18nFromProps || i18nFromContext || getI18n();
  if (i18n && !i18n.reportNamespaces) i18n.reportNamespaces = new ReportNamespaces();
  if (!i18n) {
    warnOnce('You will need pass in an i18next instance by using i18nextReactModule');
    const retNotReady = [k => k, {}, true];
    retNotReady.t = k => k;
    retNotReady.i18n = {};
    retNotReady.ready = true;
    return retNotReady;
  }
  const i18nOptions = { ...getDefaults(), ...i18n.options.react };

  // prepare having a namespace
  let namespaces = ns || (i18n.options && i18n.options.defaultNS);
  namespaces = typeof namespaces === 'string' ? [namespaces] : namespaces || ['translation'];

  // report namespaces as used
  if (i18n.reportNamespaces.addUsedNamespaces) i18n.reportNamespaces.addUsedNamespaces(namespaces);

  // are we ready? yes if all namespaces in first language are loaded already (either with data or empty objedt on failed load)
  const ready =
    (i18n.isInitialized || i18n.initializedStoreOnce) &&
    namespaces.every(n => hasLoadedNamespace(n, i18n));

  // set states
  const [t, setT] = useState({ t: i18n.getFixedT(null, namespaces[0]) }); // seems we can't have functions as value -> wrap it in obj

  function resetT() {
    setT({ t: i18n.getFixedT(null, namespaces[0]) });
  }

  useEffect(() => {
    // bind events to trigger change, like languageChanged
    if (i18nOptions.bindI18n && i18n) i18n.on(i18nOptions.bindI18n, resetT);

    // unbinding
    return () => {
      if (i18nOptions.bindI18n) {
        const p = i18nOptions.bindI18n.split(' ');
        p.forEach(f => i18n.off(f, resetT));
      }
    };
  });

  const ret = [t.t, i18n, ready];
  ret.t = t.t;
  ret.i18n = i18n;
  ret.ready = ready;

  // return hook stuff if ready
  if (ready) return ret;

  // not yet loaded namespaces -> load them -> and return if useSuspense option set false
  if (!ready && !i18nOptions.useSuspense) {
    loadNamespaces(i18n, namespaces, () => {
      resetT();
    });
    return ret;
  }

  // not yet loaded namespaces -> load them -> and trigger suspense
  throw new Promise(resolve => {
    loadNamespaces(i18n, namespaces, () => {
      resetT();
      resolve();
    });
  });
}

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
  const { i18n: i18nFromContext, defaultNS: defaultNSFromContext } = getHasUsedI18nextProvider()
    ? useContext(I18nContext) || {}
    : {};
  const i18n = i18nFromProps || i18nFromContext || getI18n();
  if (i18n && !i18n.reportNamespaces) i18n.reportNamespaces = new ReportNamespaces();
  if (!i18n) {
    warnOnce('You will need pass in an i18next instance by using initReactI18next');
    const retNotReady = [k => k, {}, true];
    retNotReady.t = k => k;
    retNotReady.i18n = {};
    retNotReady.ready = true;
    return retNotReady;
  }
  const i18nOptions = { ...getDefaults(), ...i18n.options.react };
  const { useSuspense = i18nOptions.useSuspense } = props;

  // prepare having a namespace
  let namespaces = ns || defaultNSFromContext || (i18n.options && i18n.options.defaultNS);
  namespaces = typeof namespaces === 'string' ? [namespaces] : namespaces || ['translation'];

  // report namespaces as used
  if (i18n.reportNamespaces.addUsedNamespaces) i18n.reportNamespaces.addUsedNamespaces(namespaces);

  // are we ready? yes if all namespaces in first language are loaded already (either with data or empty object on failed load)
  const ready =
    (i18n.isInitialized || i18n.initializedStoreOnce) &&
    namespaces.every(n => hasLoadedNamespace(n, i18n));

  // binding t function to namespace (acts also as rerender trigger)
  function getT() {
    return {
      t: i18n.getFixedT(null, i18nOptions.nsMode === 'fallback' ? namespaces : namespaces[0]),
    };
  }
  const [t, setT] = useState(getT()); // seems we can't have functions as value -> wrap it in obj

  useEffect(() => {
    let isMounted = true;
    const { bindI18n, bindI18nStore } = i18nOptions;

    // if not ready and not using suspense load the namespaces
    // in side effect and do not call resetT if unmounted
    if (!ready && !useSuspense) {
      loadNamespaces(i18n, namespaces, () => {
        if (isMounted) setT(getT());
      });
    }

    function boundReset() {
      if (isMounted) setT(getT());
    }

    // bind events to trigger change, like languageChanged
    if (bindI18n && i18n) i18n.on(bindI18n, boundReset);
    if (bindI18nStore && i18n) i18n.store.on(bindI18nStore, boundReset);

    // unbinding on unmount
    return () => {
      isMounted = false;
      if (bindI18n && i18n) bindI18n.split(' ').forEach(e => i18n.off(e, boundReset));
      if (bindI18nStore && i18n)
        bindI18nStore.split(' ').forEach(e => i18n.store.off(e, boundReset));
    };
  }, [namespaces.join()]); // re-run effect whenever list of namespaces changes

  const ret = [t.t, i18n, ready];
  ret.t = t.t;
  ret.i18n = i18n;
  ret.ready = ready;

  // return hook stuff if ready
  if (ready) return ret;

  // not yet loaded namespaces -> load them -> and return if useSuspense option set false
  if (!ready && !useSuspense) return ret;

  // not yet loaded namespaces -> load them -> and trigger suspense
  throw new Promise(resolve => {
    loadNamespaces(i18n, namespaces, () => {
      setT(getT());
      resolve();
    });
  });
}

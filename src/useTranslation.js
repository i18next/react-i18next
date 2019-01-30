import { useState, useEffect } from 'react';
import { getI18n, getDefaults, addUsedNamespaces } from './context';
import { warnOnce } from './utils';

function loadNamespaces(i18n, ns, cb) {
  i18n.loadNamespaces(ns, () => {
    // delay ready if not yet initialized i18n instance
    if (i18n.isInitialized) {
      cb();
    } else {
      const initialized = () => {
        // due to emitter removing issue in i18next we need to delay remove
        setImmediate(() => {
          i18n.off('initialized', initialized);
        });
        cb();
      };

      i18n.on('initialized', initialized);
    }
  });
}

export function useTranslation(ns, props = {}) {
  // assert we have the needed i18nInstance
  const { i18n: i18nFromProps } = props;
  const i18n = i18nFromProps || getI18n();
  if (!i18n) {
    warnOnce('You will need pass in an i18next instance by using i18nextReactModule');
    return [k => k, {}];
  }
  const i18nOptions = getDefaults();

  // prepare having a namespace
  let namespaces = ns || (i18n.options && i18n.options.defaultNS);
  namespaces = typeof namespaces === 'string' ? [namespaces] : namespaces || ['translation'];

  // report namespaces as used
  addUsedNamespaces(namespaces);

  // are we ready? yes if all namespaces in first language are loaded already (either with data or empty objedt on failed load)
  const ready =
    i18n.isInitialized &&
    namespaces.every(n => {
      const ret =
        i18n.hasResourceBundle(i18n.languages[0], n) || // we have the ns loaded for the favorite lng (chances are we do not have that lng so check for fallback or has tried to load that)
        (!i18n.services.backendConnector.backend &&
          i18n.hasResourceBundle(i18n.languages[i18n.languages.length - 1], n)) || // we have no backend (translation via init) but fallbackLng
        (i18n.services.backendConnector.backend &&
          i18n.services.backendConnector.state[`${i18n.languages[0]}|${n}`] &&
          i18n.services.backendConnector.state[`${i18n.languages[0]}|${n}`] !== 1 &&
          ((i18n.options && !i18n.options.fallbackLng) ||
            i18n.hasResourceBundle(i18n.languages[i18n.languages.length - 1], n))); // we have at least tried to load it and have a fallback if fallbackLng is set

      return ret;
    });

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

  // return hook stuff if ready or
  // not yet loaded namespaces -> load them -> and trigger suspense
  if (ready) {
    return [t.t, i18n];
  }
  throw new Promise(resolve => {
    loadNamespaces(i18n, namespaces, () => {
      resetT();
      resolve();
    });
  });
}

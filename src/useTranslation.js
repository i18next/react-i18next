import { useContext, useCallback, useMemo, useEffect, useRef, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { getI18n, getDefaults, ReportNamespaces, I18nContext } from './context.js';
import {
  warnOnce,
  loadNamespaces,
  loadLanguages,
  hasLoadedNamespace,
  isString,
  isObject,
} from './utils.js';

const notReadyT = (k, optsOrDefaultValue) => {
  if (isString(optsOrDefaultValue)) return optsOrDefaultValue;
  if (isObject(optsOrDefaultValue) && isString(optsOrDefaultValue.defaultValue))
    return optsOrDefaultValue.defaultValue;
  return Array.isArray(k) ? k[k.length - 1] : k;
};

const notReadySnapshot = { t: notReadyT, ready: false };
const dummySubscribe = () => () => {};

export const useTranslation = (ns, props = {}) => {
  const { i18n: i18nFromProps } = props;
  const { i18n: i18nFromContext, defaultNS: defaultNSFromContext } = useContext(I18nContext) || {};
  const i18n = i18nFromProps || i18nFromContext || getI18n();

  if (i18n && !i18n.reportNamespaces) i18n.reportNamespaces = new ReportNamespaces();

  if (!i18n) {
    warnOnce(
      i18n,
      'NO_I18NEXT_INSTANCE',
      'useTranslation: You will need to pass in an i18next instance by using initReactI18next',
    );
  }

  const i18nOptions = useMemo(
    () => ({ ...getDefaults(), ...i18n?.options?.react, ...props }),
    [i18n, props],
  );

  const { useSuspense, keyPrefix } = i18nOptions;

  const namespaces = useMemo(() => {
    const nsOrContext = ns || defaultNSFromContext || i18n?.options?.defaultNS;
    return isString(nsOrContext) ? [nsOrContext] : nsOrContext || ['translation'];
  }, [ns, defaultNSFromContext, i18n]);

  i18n?.reportNamespaces?.addUsedNamespaces?.(namespaces);

  const revisionRef = useRef(0);
  const subscribe = useCallback(
    (callback) => {
      if (!i18n) return dummySubscribe;
      const { bindI18n, bindI18nStore } = i18nOptions;

      const wrappedCallback = () => {
        revisionRef.current += 1;
        callback();
      };

      if (bindI18n) i18n.on(bindI18n, wrappedCallback);
      if (bindI18nStore) i18n.store.on(bindI18nStore, wrappedCallback);
      return () => {
        if (bindI18n) bindI18n.split(' ').forEach((e) => i18n.off(e, wrappedCallback));
        if (bindI18nStore)
          bindI18nStore.split(' ').forEach((e) => i18n.store.off(e, wrappedCallback));
      };
    },
    [i18n, i18nOptions],
  );

  const snapshotRef = useRef();
  const getSnapshot = useCallback(() => {
    if (!i18n) {
      return notReadySnapshot;
    }
    const calculatedReady =
      !!(i18n.isInitialized || i18n.initializedStoreOnce) &&
      namespaces.every((n) => hasLoadedNamespace(n, i18n, i18nOptions));
    const currentLng = props.lng || i18n.language;
    const currentRevision = revisionRef.current;

    const lastSnapshot = snapshotRef.current;
    if (
      lastSnapshot &&
      lastSnapshot.ready === calculatedReady &&
      lastSnapshot.lng === currentLng &&
      lastSnapshot.keyPrefix === keyPrefix &&
      lastSnapshot.revision === currentRevision // Check revision
    ) {
      return lastSnapshot;
    }

    const calculatedT = i18n.getFixedT(
      currentLng,
      i18nOptions.nsMode === 'fallback' ? namespaces : namespaces[0],
      keyPrefix,
    );

    const newSnapshot = {
      t: calculatedT,
      ready: calculatedReady,
      lng: currentLng,
      keyPrefix,
      revision: currentRevision, // Store revision
    };
    snapshotRef.current = newSnapshot;
    return newSnapshot;
  }, [i18n, namespaces, keyPrefix, i18nOptions, props.lng]);

  // We still need a state to manually trigger a re-render on load when the store doesn't emit an event.
  const [loadCount, setLoadCount] = useState(0);
  const { t, ready } = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    if (i18n && !ready && !useSuspense) {
      const onLoaded = () => setLoadCount((c) => c + 1);
      if (props.lng) {
        loadLanguages(i18n, props.lng, namespaces, onLoaded);
      } else {
        loadNamespaces(i18n, namespaces, onLoaded);
      }
    }
  }, [i18n, props.lng, namespaces, ready, useSuspense, loadCount]);

  const finalI18n = i18n || {};

  // cache one wrapper per hook caller and only recreate it when language changes
  const wrapperRef = useRef(null);
  const wrapperLangRef = useRef();

  // helper to create a wrapper instance (avoid duplicating descriptor logic)
  const createI18nWrapper = (original) => {
    const descriptors = Object.getOwnPropertyDescriptors(original);
    if (descriptors.__original) delete descriptors.__original;
    const wrapper = Object.create(Object.getPrototypeOf(original), descriptors);

    if (!Object.prototype.hasOwnProperty.call(wrapper, '__original')) {
      try {
        Object.defineProperty(wrapper, '__original', {
          value: original,
          writable: false,
          enumerable: false,
          configurable: false,
        });
      } catch (_) {
        /* ignore */
      }
    }

    return wrapper;
  };

  const ret = useMemo(() => {
    const original = finalI18n;
    const lang = original?.language;

    let i18nWrapper = original;

    if (original) {
      // if we already created a wrapper for this original instance
      if (wrapperRef.current && wrapperRef.current.__original === original) {
        // language changed -> create fresh wrapper so identity changes
        if (wrapperLangRef.current !== lang) {
          i18nWrapper = createI18nWrapper(original);

          wrapperRef.current = i18nWrapper;
          wrapperLangRef.current = lang;
        } else {
          // reuse existing wrapper when language didn't change
          i18nWrapper = wrapperRef.current;
        }
      } else {
        // first time for this original instance -> create wrapper
        i18nWrapper = createI18nWrapper(original);

        wrapperRef.current = i18nWrapper;
        wrapperLangRef.current = lang;
      }
    }

    const arr = [t, i18nWrapper, ready];
    arr.t = t;
    arr.i18n = i18nWrapper;
    arr.ready = ready;
    return arr;
  }, [t, finalI18n, ready, finalI18n.resolvedLanguage, finalI18n.language, finalI18n.languages]);

  if (i18n && useSuspense && !ready) {
    throw new Promise((resolve) => {
      const onLoaded = () => resolve();
      if (props.lng) {
        loadLanguages(i18n, props.lng, namespaces, onLoaded);
      } else {
        loadNamespaces(i18n, namespaces, onLoaded);
      }
    });
  }

  return ret;
};

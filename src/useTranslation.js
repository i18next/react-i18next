import {
  useContext,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { keyFromSelector } from 'i18next';
import { getI18n, getDefaults, ReportNamespaces, I18nContext } from './context.js';
import {
  warnOnce,
  loadNamespaces,
  loadLanguages,
  hasLoadedNamespace,
  isString,
  isObject,
  inDevelopment,
} from './utils.js';

const notReadyT = (k, optsOrDefaultValue) => {
  if (isString(optsOrDefaultValue)) return optsOrDefaultValue;
  if (isObject(optsOrDefaultValue) && isString(optsOrDefaultValue.defaultValue))
    return optsOrDefaultValue.defaultValue;
  // Selector functions and arrays of selector functions cannot be meaningfully resolved
  // before i18n is ready — return empty string rather than leaking a function reference.
  if (typeof k === 'function') return '';
  if (Array.isArray(k)) {
    const last = k[k.length - 1];
    return typeof last === 'function' ? '' : last;
  }
  return k;
};

// the wrapper's identity has to change whenever any of the language fields does (React
// Compiler, memo and effect dependencies compare it) - resolvedLanguage and languages change
// on their own when the resources for the current language only arrive later (until then
// i18next resolves to the fallback), and a wrapper keyed on `language` alone would keep
// handing that out
const languageKey = (inst) =>
  `${inst.language}|${inst.resolvedLanguage}|${inst.languages?.join(',')}`;

// a Proxy, not a copy: reads always see the instance's current state (a wrapper held across
// `await i18n.changeLanguage()` reports the new language) and writes reach the instance
const createI18nWrapper = (original) =>
  new Proxy(original, {
    get: (target, prop) => (prop === '__original' ? target : Reflect.get(target, prop)),
  });

const notReadySnapshot = { t: notReadyT, ready: false };
const dummySubscribe = () => () => {};

// the events that re-render: `bindI18n` on the instance, `bindI18nStore` on its store
const subscribeToEvents = (i18n, { bindI18n, bindI18nStore }, callback) => {
  if (bindI18n) i18n.on(bindI18n, callback);
  if (bindI18nStore) i18n.store.on(bindI18nStore, callback);
  return () => {
    if (bindI18n) i18n.off(bindI18n, callback);
    if (bindI18nStore) i18n.store.off(bindI18nStore, callback);
  };
};

// Re-renders the calling component on the instance's bindI18n/bindI18nStore events, as
// useTranslation does, without its loading and Suspense logic (used by Trans and IcuTrans)
export const useRerenderOnEvents = (i18n) => {
  const { bindI18n, bindI18nStore } = { ...getDefaults(), ...i18n?.options?.react };
  const revisionRef = useRef(0);
  const subscribe = useCallback(
    (callback) =>
      i18n
        ? subscribeToEvents(i18n, { bindI18n, bindI18nStore }, () => {
            revisionRef.current += 1;
            callback();
          })
        : () => {},
    [i18n, bindI18n, bindI18nStore],
  );
  // with the language state in the snapshot, React also re-renders for a change between this
  // render and the subscription (a parent's layout effect calling changeLanguage), which no
  // event reaches; bindI18n: '' keeps it off
  const getSnapshot = () =>
    bindI18n && i18n ? `${revisionRef.current}|${languageKey(i18n)}` : String(revisionRef.current);
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};

export const useTranslation = (ns, props = {}) => {
  const { i18n: i18nFromProps } = props;
  const { i18n: i18nFromContext, defaultNS: defaultNSFromContext } = useContext(I18nContext) || {};
  const i18n = i18nFromProps || i18nFromContext || getI18n();

  if (i18n && !i18n.reportNamespaces) i18n.reportNamespaces = new ReportNamespaces();

  if (!i18n) {
    warnOnce(
      i18n,
      'NO_I18NEXT_INSTANCE',
      'useTranslation: You will need to pass in an i18next instance by using initReactI18next or by passing it via props or context. In monorepo setups, make sure there is only one instance of react-i18next.',
    );
  }

  const i18nOptions = useMemo(
    () => ({ ...getDefaults(), ...i18n?.options?.react, ...props }),
    [i18n, props],
  );

  const { useSuspense, keyPrefix, bindI18n, bindI18nStore } = i18nOptions;

  const nsOrContext = ns || defaultNSFromContext || i18n?.options?.defaultNS;
  const unstableNamespaces = isString(nsOrContext) ? [nsOrContext] : nsOrContext || ['translation'];
  const namespacesKey = JSON.stringify(unstableNamespaces);
  const namespaces = useMemo(() => unstableNamespaces, [namespacesKey]);

  i18n?.reportNamespaces?.addUsedNamespaces?.(namespaces);

  const revisionRef = useRef(0);
  const subscribe = useCallback(
    (callback) => {
      if (!i18n) return dummySubscribe;

      const wrappedCallback = () => {
        revisionRef.current += 1;
        callback();
      };

      return subscribeToEvents(i18n, { bindI18n, bindI18nStore }, wrappedCallback);
    },
    // the event names, not `i18nOptions`: that object is rebuilt whenever `props` is a new
    // object (the `{}` default, inline options), and a new `subscribe` makes React
    // unsubscribe and resubscribe on every render
    [i18n, bindI18n, bindI18nStore],
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
    // an inline selector is a new function on every render, so compare the key it resolves
    // to (with the options getFixedT resolves it with), not the function itself
    const keyPrefixKey =
      typeof keyPrefix === 'function'
        ? keyFromSelector(keyPrefix, { ...i18n.options, ns: namespaces })
        : keyPrefix;

    const lastSnapshot = snapshotRef.current;
    if (
      lastSnapshot &&
      lastSnapshot.i18n === i18n &&
      lastSnapshot.ready === calculatedReady &&
      lastSnapshot.lng === currentLng &&
      lastSnapshot.namespaces === namespaces &&
      lastSnapshot.keyPrefix === keyPrefixKey &&
      lastSnapshot.revision === currentRevision // Check revision
    ) {
      return lastSnapshot;
    }

    // `scopeNs` (4th opts arg, i18next ≥ 26.0.10) gives the selector API access
    // to the full hook namespace list while `ns` (resolution-scope) stays at
    // the primary string. Without it, `t($ => $.secondaryNs.foo)` would silently
    // miss under default `nsMode` because `o.ns` is a single string and i18next's
    // selector rewrite only fires on multi-ns input.
    const calculatedT = i18n.getFixedT(
      currentLng,
      i18nOptions.nsMode === 'fallback' ? namespaces : namespaces[0],
      keyPrefix,
      { scopeNs: namespaces },
    );

    const newSnapshot = {
      t: calculatedT,
      i18n,
      ready: calculatedReady,
      lng: currentLng,
      namespaces,
      keyPrefix: keyPrefixKey,
      revision: currentRevision, // Store revision
    };
    snapshotRef.current = newSnapshot;
    return newSnapshot;
  }, [i18n, namespaces, keyPrefix, i18nOptions, props.lng]);

  // We still need a state to manually trigger a re-render on load when the store doesn't emit an event.
  const [loadCount, setLoadCount] = useState(0);
  let { t, ready } = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  let pendingTranslationLoad;
  if (i18n && useSuspense && !ready) {
    pendingTranslationLoad = new Promise((resolve) => {
      const onLoaded = () => resolve();
      if (props.lng) {
        loadLanguages(i18n, props.lng, namespaces, onLoaded);
      } else {
        loadNamespaces(i18n, namespaces, onLoaded);
      }
    });
    // Synchronous backends can finish during this call. Refresh the snapshot
    // before deciding whether React still needs to suspend.
    ({ t, ready } = getSnapshot());
  }

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

  // cache one wrapper per hook caller and only recreate it when the language state changes
  const wrapperRef = useRef(null);

  const ret = useMemo(() => {
    const original = finalI18n;
    const lang = languageKey(original);

    // a new wrapper for a new instance, or when the language state changed
    if (wrapperRef.current?.original !== original || wrapperRef.current.lang !== lang) {
      wrapperRef.current = { original, lang, wrapper: createI18nWrapper(original) };
    }
    const i18nWrapper = wrapperRef.current.wrapper;

    const effectiveT =
      !ready && !useSuspense
        ? (...args) => {
            warnOnce(
              i18n,
              'USE_T_BEFORE_READY',
              'useTranslation: t was called before ready. When using useSuspense: false, make sure to check the ready flag before using t.',
            );
            return t(...args);
          }
        : t;

    const arr = [effectiveT, i18nWrapper, ready];
    arr.t = effectiveT;
    arr.i18n = i18nWrapper;
    arr.ready = ready;
    return arr;
  }, [t, finalI18n, ready, finalI18n.resolvedLanguage, finalI18n.language, finalI18n.languages]);

  if (i18n && useSuspense && !ready) {
    if (inDevelopment()) {
      warnOnce(
        i18n,
        'SUSPENDED_WHILE_LOADING',
        'useTranslation: suspended while translations are loading (useSuspense is true by default). Add a <Suspense> boundary above this component, or set react.useSuspense: false in the i18next init options. https://react.i18next.com/latest/usetranslation-hook',
      );
    }
    throw pendingTranslationLoad;
  }

  return ret;
};

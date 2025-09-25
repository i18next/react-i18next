import { useState, useEffect, useContext, useRef, useCallback, useMemo } from 'react';
import { getI18n, getDefaults, ReportNamespaces, I18nContext } from './context.js';
import {
  warnOnce,
  loadNamespaces,
  loadLanguages,
  hasLoadedNamespace,
  isString,
  isObject,
} from './utils.js';

const usePrevious = (value, ignore) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = ignore ? ref.current : value;
  }, [value, ignore]);
  return ref.current;
};

const notReadyT = (k, optsOrDefaultValue) => {
  if (isString(optsOrDefaultValue)) return optsOrDefaultValue;
  if (isObject(optsOrDefaultValue) && isString(optsOrDefaultValue.defaultValue))
    return optsOrDefaultValue.defaultValue;
  return Array.isArray(k) ? k[k.length - 1] : k;
};

export const useTranslation = (ns, props = {}) => {
  // assert we have the needed i18nInstance
  const { i18n: i18nFromProps } = props;
  const { i18n: i18nFromContext, defaultNS: defaultNSFromContext } = useContext(I18nContext) || {};
  const i18n = i18nFromProps || i18nFromContext || getI18n();

  // Set up reportNamespaces if i18n exists
  if (i18n && !i18n.reportNamespaces) i18n.reportNamespaces = new ReportNamespaces();

  // Show warning if no i18n instance (but don't return early)
  if (!i18n) {
    warnOnce(
      i18n,
      'NO_I18NEXT_INSTANCE',
      'useTranslation: You will need to pass in an i18next instance by using initReactI18next',
    );
  }

  const i18nOptions = { ...getDefaults(), ...i18n?.options?.react, ...props };
  const { useSuspense, keyPrefix } = i18nOptions;

  const namespaces = useMemo(() => {
    const nsOrContext = ns || defaultNSFromContext || i18n?.options?.defaultNS;
    return isString(nsOrContext) ? [nsOrContext] : nsOrContext || ['translation'];
  }, [ns, defaultNSFromContext, i18n]);

  i18n?.reportNamespaces?.addUsedNamespaces?.(namespaces);

  const ready =
    !!i18n &&
    !!(i18n.isInitialized || i18n.initializedStoreOnce) &&
    !!namespaces.every((n) => hasLoadedNamespace(n, i18n, i18nOptions));

  const t = useCallback(
    i18n
      ? i18n.getFixedT(
          props.lng || i18n.language,
          i18nOptions.nsMode === 'fallback' ? namespaces : namespaces[0],
          keyPrefix,
        )
      : notReadyT,
    [i18n, props.lng, i18n?.language, namespaces, keyPrefix, i18nOptions.nsMode],
  );

  const [, setForceUpdate] = useState(0);

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    const { bindI18n, bindI18nStore } = i18nOptions;
    if (!i18n) return;

    if (!ready && !useSuspense) {
      const onLoaded = () => {
        if (isMounted.current) setForceUpdate((c) => c + 1);
      };
      if (props.lng) {
        loadLanguages(i18n, props.lng, namespaces, onLoaded);
      } else {
        loadNamespaces(i18n, namespaces, onLoaded);
      }
    }

    const boundReset = () => {
      if (isMounted.current) setForceUpdate((c) => c + 1);
    };

    if (bindI18n) i18n.on(bindI18n, boundReset);
    if (bindI18nStore) i18n.store.on(bindI18nStore, boundReset);

    return () => {
      isMounted.current = false;
      if (bindI18n && i18n) bindI18n.split(' ').forEach((e) => i18n.off(e, boundReset));
      if (bindI18nStore && i18n)
        bindI18nStore.split(' ').forEach((e) => i18n.store.off(e, boundReset));
    };
  }, [
    i18n,
    namespaces,
    props.lng,
    ready,
    useSuspense,
    i18nOptions.bindI18n,
    i18nOptions.bindI18nStore,
  ]);

  const previousI18n = usePrevious(i18n);
  const previousKeyPrefix = usePrevious(keyPrefix);
  useEffect(() => {
    // This is the fix: only trigger an update if `previousI18n` exists.
    // This prevents the effect from firing on the initial mount.
    if (previousI18n && (previousI18n !== i18n || previousKeyPrefix !== keyPrefix)) {
      if (isMounted.current) setForceUpdate((c) => c + 1);
    }
  }, [i18n, keyPrefix, previousI18n, previousKeyPrefix]);

  const finalI18n = i18n || {};

  const ret = useMemo(() => {
    const arr = [t, finalI18n, ready];
    arr.t = t;
    arr.i18n = finalI18n;
    arr.ready = ready;
    return arr;
  }, [t, finalI18n, ready]);

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

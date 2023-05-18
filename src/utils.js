export function warn(...args) {
  if (console && console.warn) {
    if (typeof args[0] === 'string') args[0] = `react-i18next:: ${args[0]}`;
    console.warn(...args);
  }
}

const alreadyWarned = {};
export function warnOnce(...args) {
  if (typeof args[0] === 'string' && alreadyWarned[args[0]]) return;
  if (typeof args[0] === 'string') alreadyWarned[args[0]] = new Date();
  warn(...args);
}

// not needed right now
//
// export function deprecated(...args) {
//   if (process && process.env && (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')) {
//     if (typeof args[0] === 'string') args[0] = `deprecation warning -> ${args[0]}`;
//     warnOnce(...args);
//   }
// }

const loadedClb = (i18n, cb) => () => {
  // delay ready if not yet initialized i18n instance
  if (i18n.isInitialized) {
    cb();
  } else {
    const initialized = () => {
      // due to emitter removing issue in i18next we need to delay remove
      setTimeout(() => {
        i18n.off('initialized', initialized);
      }, 0);
      cb();
    };
    i18n.on('initialized', initialized);
  }
};

export function loadNamespaces(i18n, ns, cb) {
  i18n.loadNamespaces(ns, loadedClb(i18n, cb));
}

// should work with I18NEXT >= v22.5.0
export function loadLanguages(i18n, lng, ns, cb) {
  // eslint-disable-next-line no-param-reassign
  if (typeof ns === 'string') ns = [ns];
  ns.forEach((n) => {
    if (i18n.options.ns.indexOf(n) < 0) i18n.options.ns.push(n);
  });
  i18n.loadLanguages(lng, loadedClb(i18n, cb));
}

// WAIT A LITTLE FOR I18NEXT BEING UPDATED IN THE WILD, before removing this old i18next version support
function oldI18nextHasLoadedNamespace(ns, i18n, options = {}) {
  const lng = i18n.languages[0];
  const fallbackLng = i18n.options ? i18n.options.fallbackLng : false;
  const lastLng = i18n.languages[i18n.languages.length - 1];

  // we're in cimode so this shall pass
  if (lng.toLowerCase() === 'cimode') return true;

  const loadNotPending = (l, n) => {
    const loadState = i18n.services.backendConnector.state[`${l}|${n}`];
    return loadState === -1 || loadState === 2;
  };

  // bound to trigger on event languageChanging
  // so set ready to false while we are changing the language
  // and namespace pending (depends on having a backend)
  if (
    options.bindI18n &&
    options.bindI18n.indexOf('languageChanging') > -1 &&
    i18n.services.backendConnector.backend &&
    i18n.isLanguageChangingTo &&
    !loadNotPending(i18n.isLanguageChangingTo, ns)
  )
    return false;

  // loaded -> SUCCESS
  if (i18n.hasResourceBundle(lng, ns)) return true;

  // were not loading at all -> SEMI SUCCESS
  if (
    !i18n.services.backendConnector.backend ||
    (i18n.options.resources && !i18n.options.partialBundledLanguages)
  )
    return true;

  // failed loading ns - but at least fallback is not pending -> SEMI SUCCESS
  if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;

  return false;
}

export function hasLoadedNamespace(ns, i18n, options = {}) {
  if (!i18n.languages || !i18n.languages.length) {
    warnOnce('i18n.languages were undefined or empty', i18n.languages);
    return true;
  }

  // ignoreJSONStructure was introduced in v20.0.0 (MARCH 2021)
  const isNewerI18next = i18n.options.ignoreJSONStructure !== undefined;
  if (!isNewerI18next) {
    // WAIT A LITTLE FOR I18NEXT BEING UPDATED IN THE WILD, before removing this old i18next version support
    return oldI18nextHasLoadedNamespace(ns, i18n, options);
  }

  // IN I18NEXT > v19.4.5 WE CAN (INTRODUCED JUNE 2020)
  return i18n.hasLoadedNamespace(ns, {
    lng: options.lng,
    precheck: (i18nInstance, loadNotPending) => {
      if (
        options.bindI18n &&
        options.bindI18n.indexOf('languageChanging') > -1 &&
        i18nInstance.services.backendConnector.backend &&
        i18nInstance.isLanguageChangingTo &&
        !loadNotPending(i18nInstance.isLanguageChangingTo, ns)
      )
        return false;
    },
  });
}

export function getDisplayName(Component) {
  return (
    Component.displayName ||
    Component.name ||
    (typeof Component === 'string' && Component.length > 0 ? Component : 'Unknown')
  );
}

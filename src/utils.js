/** @type {(i18n:any,code:import('../TransWithoutContext').ErrorCode,msg?:string, rest?:{[key:string]: any})=>void} */
export const warn = (i18n, code, msg, rest) => {
  const args = [msg, { code, ...(rest || {}) }];
  if (i18n?.services?.logger?.forward) {
    return i18n.services.logger.forward(args, 'warn', 'react-i18next::', true);
  }
  if (isString(args[0])) args[0] = `react-i18next:: ${args[0]}`;
  if (i18n?.services?.logger?.warn) {
    i18n.services.logger.warn(...args);
  } else if (console?.warn) {
    console.warn(...args);
  }
};
// deduped per logger, where the warning goes: each i18next instance has its own logger, and a
// clone shares its parent's, so a second instance (micro-frontends, tests) gets its own warnings
// and a clone per request does not repeat them; an instance without a logger yet counts itself,
// no instance at all is deduped per message
const warnedFor = new WeakMap();
const warnedWithoutInstance = new Set();
/** @type {typeof warn} */
export const warnOnce = (i18n, code, msg, rest) => {
  if (isString(msg)) {
    let warned = warnedWithoutInstance;
    const owner = i18n?.services?.logger || i18n;
    if (isObject(owner)) {
      warned = warnedFor.get(owner);
      if (!warned) warnedFor.set(owner, (warned = new Set()));
    }
    if (warned.has(msg)) return;
    warned.add(msg);
  }
  warn(i18n, code, msg, rest);
};

export const inDevelopment = () => {
  try {
    // statically replaced by bundlers (webpack/vite/metro define it, rollup replaces it
    // in our UMD builds); evaluated at runtime in Node
    return process.env.NODE_ENV !== 'production';
  } catch (e) {
    // no `process` in this runtime (raw ESM in the browser, some edge runtimes): stay quiet
    return false;
  }
};

const loadedClb = (i18n, cb) => () => {
  // delay ready if not yet initialized i18n instance
  if (i18n.isInitialized) {
    cb();
  } else {
    i18n.once('initialized', () => cb());
  }
};

export const loadNamespaces = (i18n, ns, cb) => {
  i18n.loadNamespaces(ns, loadedClb(i18n, cb));
};

export const loadLanguages = (i18n, lng, ns, cb) => {
  if (isString(ns)) ns = [ns];
  if (i18n.options.preload && i18n.options.preload.indexOf(lng) > -1)
    return loadNamespaces(i18n, ns, cb);
  ns.forEach((n) => {
    if (i18n.options.ns.indexOf(n) < 0) i18n.options.ns.push(n);
  });
  i18n.loadLanguages(lng, loadedClb(i18n, cb));
};

export const hasLoadedNamespace = (ns, i18n, options = {}) => {
  if (!i18n.languages || !i18n.languages.length) {
    warnOnce(i18n, 'NO_LANGUAGES', 'i18n.languages were undefined or empty', {
      languages: i18n.languages,
    });
    return true;
  }

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
};

export const getDisplayName = (Component) =>
  Component.displayName ||
  Component.name ||
  (isString(Component) && Component.length > 0 ? Component : 'Unknown');

export const isString = (obj) => typeof obj === 'string';

export const isObject = (obj) => typeof obj === 'object' && obj !== null;

// An i18nFormat plugin (i18next-icu, i18next-mf2, i18next-fluent) replaces the core interpolation, so
// interpolation.escapeValue does not apply to the values it inserts
export const getFormatPlugin = (i18n) => {
  const plugin = i18n?.services?.i18nFormat;
  return typeof plugin?.parse === 'function' ? plugin : undefined;
};

const htmlEscapes = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

// only strings: numbers, dates and objects reach the formatter unchanged
export const escapeStringValues = (values) => {
  if (!values) return values;
  const escaped = {};
  Object.keys(values).forEach((k) => {
    const v = values[k];
    escaped[k] = isString(v) ? v.replace(/[&<>"']/g, (c) => htmlEscapes[c]) : v;
  });
  return escaped;
};

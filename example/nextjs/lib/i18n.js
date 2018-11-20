function lngPathCorrection(config, i18n) {
  const { defaultLanguage, allLanguages } = config.translation;
  return function(currentRoute, currentLanguage = i18n.languages[0]) {
    if (!allLanguages.includes(currentLanguage)) {
      return currentRoute;
    }
  
    let href = currentRoute;
    let as = href;
  
    for (const lng of allLanguages) {
      if (href.startsWith(`/${lng}/`)) {
        href = href.replace(`/${lng}/`, '/');
        break;
      }
    }
  
    if (currentLanguage !== defaultLanguage) {
      as = `/${currentLanguage}${href}`;
      href += `?lng=${currentLanguage}`;
    } else {
      as = href;
    }
  
    return [href, as];
  }
}

function makeConfig() {
  const DEFAULT_LANGUAGE = 'en';
  const OTHER_LANGUAGES = ['de'];
  const DEFAULT_NAMESPACE = 'common';
  const LOCALE_PATH = 'static/locales';
  const LOCALE_STRUCTURE = '{{lng}}/{{ns}}';
  const LOCALE_SUBPATHS = false;

  /* Core Settings - only change if you understand what you're changing */
  const config = {
    translation: {
      allLanguages: OTHER_LANGUAGES.concat([DEFAULT_LANGUAGE]),
      defaultLanguage: DEFAULT_LANGUAGE,
      fallbackLng: DEFAULT_LANGUAGE,
      load: 'languageOnly',
      localesPath: `./${LOCALE_PATH}/`,
      localeSubpaths: LOCALE_SUBPATHS,
      ns: [DEFAULT_NAMESPACE],
      defaultNS: DEFAULT_NAMESPACE,
      interpolation: {
        escapeValue: false,
        formatSeparator: ',',
        format: (value, format) => (format === 'uppercase' ? value.toUpperCase() : value),
      },
      detection: {
        order: ['cookie', 'header', 'querystring'],
        caches: ['cookie'],
      },
      backend: {
        loadPath: `/${LOCALE_PATH}/${LOCALE_STRUCTURE}.json`,
        addPath: `/${LOCALE_PATH}/${LOCALE_STRUCTURE}.missing.json`,
      },
    },
  };
  return config
}

function getI18n(config) {
  const i18next = require('i18next');
  const i18nextXHRBackend = require('i18next-xhr-backend');
  const i18nextBrowserLanguageDetector = require('i18next-browser-languagedetector');
  const i18n = i18next.default ? i18next.default : i18next;
  i18n.nsFromReactTree = [];
  i18n.use(i18nextXHRBackend).use(i18nextBrowserLanguageDetector);

  if (!i18n.isInitialized) {
    i18n.init(config.translation);
  }
  return i18n
}


function registerI18n(i18n, config) {
  return function register(Router) {
    if (config.translation.localeSubpaths) {
      i18n.on('languageChanged', lng => {
        if (process.browser) {
          const originalRoute = window.location.pathname;
          const [href, as] = lngPathCorrection(config, i18n)(originalRoute, lng);
          if (as !== originalRoute) {
            Router.replace(href, as, { shallow: true });
          }
        }
      });
    }
    }
}

function withNs(namespaces=[]) {
  const { withNamespaces } = require('react-i18next')
  i18n.nsFromReactTree = [...new Set(i18n.nsFromReactTree.concat(namespaces))];
  return withNamespaces(namespaces);
}

const config = makeConfig()
const i18n = getI18n(config)

module.exports = {
  config,
  i18n,
  registerI18n: registerI18n(i18n, config),
  withNamespaces: withNs,
}

function lngPathDetector(config) {
  return function(req, res, cb) {
    const { allLanguages, defaultLanguage } = config.translation;
    if (req.i18n) {
      const language = req.i18n.languages[0];
      /*
        If a user has hit a subpath which does not
        match their language, give preference to
        the path, and change user language.
      */
      allLanguages.forEach(lng => {
        if (req.url.startsWith(`/${lng}/`) && language !== lng) {
          req.i18n.changeLanguage(lng);
        }
      });
      /*
        If a user has hit the root path and their
        language is not set to default, give
        preference to the path and reset their
        language.
      */
      if (language !== defaultLanguage && !req.url.startsWith(`/${language}/`)) {
        req.i18n.changeLanguage(defaultLanguage);
      }
      /*
        If a user has a default language prefix
        in their URL, strip it.
      */
      if (language === defaultLanguage && req.url.startsWith(`/${defaultLanguage}/`)) {
        res.redirect(301, req.url.replace(`/${defaultLanguage}/`, '/'));
      }
    }
    cb();
  };
}


function forceTrailingSlash(config) {
  return function(req, res, cb) {
    const parseURL = require('url').parse;
    const { allLanguages } = config.translation;
    const { pathname, search } = parseURL(req.url);
    allLanguages.forEach(lng => {
      if (pathname === `/${lng}`) {
        res.redirect(301, pathname.replace(`/${lng}`, `/${lng}/`) + (search || ''));
      }
    });
    cb();
  };
}

function makeConfig() {
  const PORT = process.env.PORT || 3000;
  const DEFAULT_LANGUAGE = 'en';
  const OTHER_LANGUAGES = ['de'];
  const DEFAULT_NAMESPACE = 'common';
  const LOCALE_PATH = 'static/locales';
  const LOCALE_STRUCTURE = '{{lng}}/{{ns}}';
  const LOCALE_SUBPATHS = false;

  /* Core Settings - only change if you understand what you're changing */
  const config = {
    port: PORT,
    translation: {
      allLanguages: OTHER_LANGUAGES.concat([DEFAULT_LANGUAGE]),
      defaultLanguage: DEFAULT_LANGUAGE,
      fallbackLng: process.env.NODE_ENV === 'production' ? DEFAULT_LANGUAGE : null,
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

  /* SSR Settings - only change if you understand what you're changing */
  const fs = require('fs');
  const path = require('path');

  const getAllNamespaces = p => fs.readdirSync(p).map(file => file.replace('.json', ''));

  config.translation = {
    ...config.translation,
    preload: config.translation.allLanguages,
    ns: getAllNamespaces(`${config.translation.localesPath}${config.translation.defaultLanguage}`),
    backend: {
      loadPath: path.join(__dirname, `${LOCALE_PATH}/${LOCALE_STRUCTURE}.json`),
      addPath: path.join(__dirname, `${LOCALE_PATH}/${LOCALE_STRUCTURE}.missing.json`),
    },
  };
  return config
}

function registerI18n(server) {
  const i18next = require('i18next');
  const config = makeConfig();
  const i18nextNodeBackend = require('i18next-node-fs-backend');
  const i18nextMiddleware = require('i18next-express-middleware');

  const i18n = i18next.default ? i18next.default : i18next;
  i18n.nsFromReactTree = [];
  const { allLanguages, localeSubpaths } = config.translation;
  i18n.use(i18nextNodeBackend).use(i18nextMiddleware.LanguageDetector);

  server.use(i18nextMiddleware.handle(i18n));
  if (localeSubpaths) {
    server.get('*', forceTrailingSlash(config));
    server.get(/^\/(?!_next|static).*$/, lngPathDetector);
    server.get(`/:lng(${allLanguages.join('|')})/*`, (req, res) => {
      const { lng } = req.params;
      app.render(req, res, req.url.replace(`/${lng}`, ''), { lng });
    });
  }

  if (!i18n.isInitialized) {
    i18n.init(config.translation);
  }
}

module.exports = registerI18n

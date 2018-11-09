/* User Settings - feel free to change */
const PORT = process.env.PORT || 3000;
const DEFAULT_LANGUAGE = 'en';
const OTHER_LANGUAGES = ['de'];
const DEFAULT_NAMESPACE = 'common';
const LOCALE_PATH = 'static/locales';
const LOCALE_STRUCTURE = '{{lng}}/{{ns}}';
const LOCALE_SUBPATHS = true;

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
if (!process.browser) {
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
}

module.exports = config;

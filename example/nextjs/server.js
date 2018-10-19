const express = require('express');
const path = require('path');
const next = require('next');
const parseURL = require('url').parse;

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const i18nextMiddleware = require('i18next-express-middleware');
const Backend = require('i18next-node-fs-backend');
const config = require('./config');
const i18n = require('./i18n');
const getAllNamespaces = require('./lib/getAllNamespaces');

const { localesPath, allLanguages, defaultLanguage, enableSubpaths } = config.translation;

const serverSideOptions = {
  fallbackLng: defaultLanguage,
  preload: allLanguages, // preload all langages
  ns: getAllNamespaces(`${localesPath}${defaultLanguage}`), // need to preload all the namespaces
  backend: {
    loadPath: path.join(__dirname, '/static/locales/{{lng}}/{{ns}}.json'),
    addPath: path.join(__dirname, '/static/locales/{{lng}}/{{ns}}.missing.json'),
  },
  detection: {
    order: ['path', 'session', 'querystring', 'cookie', 'header'], // all
    caches: ['localStorage', 'cookie']
  },
  whitelist: allLanguages,
};

// init i18next with serverside settings
// using i18next-express-middleware
i18n
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init(serverSideOptions, () => {
    // loaded translations we can bootstrap our routes
    app.prepare().then(() => {
      const server = express();

      // Force trailing slash on language subpaths
      if (enableSubpaths) {
        server.get('*', (req, res, cb) => {
          const { pathname, search } = parseURL(req.url);
          const searchString = search || '';
          allLanguages.forEach(lng => {
            if (pathname.startsWith(`/${lng}`) && !pathname.startsWith(`/${lng}/`)) {
              res.redirect(301, pathname.replace(`/${lng}`, `/${lng}/`) + searchString);
            }
          });
          cb();
        });
      }

      // enable middleware for i18next
      server.use(i18nextMiddleware.handle(i18n));

      // serve locales for client
      server.use('/locales', express.static(path.join(__dirname, '/locales')));

      // missing keys
      server.post('/locales/add/:lng/:ns', i18nextMiddleware.missingKeyHandler(i18n));

      // use next.js
      if (enableSubpaths) {
        server.get('*', (req, res) => {
          // If req.url contains a language subpath, remove
          // it so that NextJS will render the correct page
          let strippedRoute = req.url;
          for (const lng of allLanguages) {
            if (req.url.startsWith(`/${lng}/`)) {
              strippedRoute = strippedRoute.replace(`/${lng}/`, '/');
              break;
            }
          }
          if (strippedRoute !== req.url) {
            app.render(req, res, strippedRoute);
          } else {
            handle(req, res);
          }
        });
      } else {
        server.get('*', (req, res) => handle(req, res));
      }

      server.listen(3000, err => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
      });
    });
  });

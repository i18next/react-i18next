const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const i18nextMiddleware = require('i18next-express-middleware');
const locizeBackend = require('i18next-node-locize-backend');
const i18n = require('./i18n');
const locizeOptions = require('./locizeOptions.json');

locizeOptions.reloadInterval = dev ? 5 * 1000 : 60 * 60 * 1000;

// init i18next with serverside settings
// using i18next-express-middleware
i18n
  .use(locizeBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'de'], // preload all langages
    ns: ['common', 'home', 'page2'], // need to preload all the namespaces
    saveMissing: true,
    backend: locizeOptions
  }, (err) => {
    if (err) return console.error(err);

    // loaded translations we can bootstrap our routes
    app.prepare().then(() => {
      const server = express()

      // enable middleware for i18next
      server.use(i18nextMiddleware.handle(i18n));

      // use next.js
      server.get('*', (req, res) => handle(req, res))

      server.listen(3000, (err) => {
        if (err) return console.error(err);
        console.log('> Ready on http://localhost:3000')
      });
    });
  });

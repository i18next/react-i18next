/* eslint-disable import/no-dynamic-require */
import React from 'react';
import { StaticRouter, matchPath } from 'react-router-dom';

import express from 'express';
import path from 'path';
import fs from 'fs';
import { renderToString } from 'react-dom/server';

import { I18nextProvider } from 'react-i18next'; // has no proper import yet
import Backend from 'i18next-fs-backend';
import App from './App';
import i18n from './i18n';

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const appSrc = resolveApp('src');

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const i18nextMiddleware = require('i18next-http-middleware');

const server = express();

i18n
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init(
    {
      preload: ['en', 'de'],
      backend: {
        loadPath: `${appSrc}/locales/{{lng}}/{{ns}}.json`,
        addPath: `${appSrc}/locales/{{lng}}/{{ns}}.missing.json`,
      },
    },
    () => {
      server
        .disable('x-powered-by')
        .use(i18nextMiddleware.handle(i18n))
        .use('/locales', express.static(`${appSrc}/locales`))
        .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
        .get('/*', (req, res) => {
          const context = {};
          const markup = renderToString(
            <I18nextProvider i18n={req.i18n}>
              <StaticRouter context={context} location={req.url}>
                <App />
              </StaticRouter>
            </I18nextProvider>,
          );
          // This line must be placed after renderToString method
          // otherwise context won't be populated by App
          const { url } = context;
          if (url) {
            res.redirect(url);
          } else {
            const initialI18nStore = {};
            req.i18n.languages.forEach(l => {
              initialI18nStore[l] = req.i18n.services.resourceStore.data[l];
            });
            const initialLanguage = req.i18n.language;

            res.status(200).send(
              `<!doctype html>
        <html lang="">
        <head>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta charSet='utf-8' />
            <title>Welcome to Razzle</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            ${assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ''}
            <script src="${assets.client.js}" defer></script>
            <script>
              window.initialI18nStore = JSON.parse('${JSON.stringify(initialI18nStore)}');
              window.initialLanguage = '${initialLanguage}';
            </script>
        </head>
        <body>
            <div id="root">${markup}</div>
        </body>
    </html>`,
            );
          }
        });
    },
  );

export default server;

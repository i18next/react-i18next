import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import Backend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';
import i18n from './src/i18n.js';

const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;
const appSrc = path.resolve(import.meta.dirname, 'src');

const app = express();

await i18n
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    debug: false,
    preload: ['en', 'de'],
    ns: ['translations'],
    defaultNS: 'translations',
    backend: {
      loadPath: `${appSrc}/locales/{{lng}}/{{ns}}.json`,
      addPath: `${appSrc}/locales/{{lng}}/{{ns}}.missing.json`,
    },
  });

app
  .disable('x-powered-by')
  .use(i18nextMiddleware.handle(i18n))
  // saveMissing: the client posts missing keys here -> {{ns}}.missing.json
  .post('/locales/:lng/:ns', express.json(), i18nextMiddleware.missingKeyHandler(i18n))
  // serve translations for the clientside i18next-http-backend
  .use('/locales', express.static(`${appSrc}/locales`));

let vite;
if (isProd) {
  app.use(express.static(path.resolve(import.meta.dirname, 'dist/client'), { index: false }));
} else {
  vite = await (
    await import('vite')
  ).createServer({ server: { middlewareMode: true }, appType: 'custom' });
  app.use(vite.middlewares);
}

app.get('/{*splat}', async (req, res, next) => {
  try {
    let template;
    let render;
    if (isProd) {
      template = fs.readFileSync(path.resolve(import.meta.dirname, 'dist/client/index.html'), 'utf-8');
      ({ render } = await import('./dist/server/entry-server.js'));
    } else {
      template = fs.readFileSync(path.resolve(import.meta.dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(req.originalUrl, template);
      ({ render } = await vite.ssrLoadModule('/src/entry-server.jsx'));
    }

    const { html, initialI18nStore, initialLanguage } = render(req);

    // pass the used translations + language down to the client -> useSSR, no flickering
    const head = `<script>
      window.initialI18nStore = ${JSON.stringify(initialI18nStore).replace(/</g, '\\u003c')};
      window.initialLanguage = ${JSON.stringify(initialLanguage)};
    </script>`;

    res
      .status(200)
      .set({ 'Content-Type': 'text/html' })
      .send(template.replace('<!--app-head-->', head).replace('<!--app-html-->', html));
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    next(e);
  }
});

app.listen(port, () => {
  console.log(`> Started on port ${port}`);
});

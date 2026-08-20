import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: import.meta.dirname + '/public/locales/{{lng}}/{{ns}}.json',
      addPath: import.meta.dirname + '/public/locales/{{lng}}/{{ns}}.missing.json',
    },
    fallbackLng: 'en',
    // debug: true,
    saveMissing: true,
  });

// dev-server-only middleware: the browser's saveMissing POSTs land here
// and i18next-http-middleware writes them to public/locales/{{lng}}/{{ns}}.missing.json
const saveMissing = () => ({
  name: 'save-missing',
  configureServer(server) {
    const app = express();
    app.post('/locales/:lng/:ns', express.json(), i18nextMiddleware.missingKeyHandler(i18next));
    server.middlewares.use(app);
  },
});

export default defineConfig({
  plugins: [react(), saveMissing()],
});

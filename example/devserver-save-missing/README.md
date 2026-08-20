# Example using the Vite dev server to save missing translations

The browser-side i18next is configured with `saveMissing: true` and `addPath: '/locales/{{lng}}/{{ns}}'` (see `src/i18n.js`).
Whenever a translation key is missing, [i18next-http-backend](https://github.com/i18next/i18next-http-backend) POSTs it to the dev server.

A small Vite plugin in `vite.config.js` mounts an express handler on the dev server for `POST /locales/:lng/:ns` using
[i18next-http-middleware](https://github.com/i18next/i18next-http-middleware)'s `missingKeyHandler` together with
[i18next-fs-backend](https://github.com/i18next/i18next-fs-backend), which writes the missing keys to
`public/locales/{{lng}}/{{ns}}.missing.json`.

This project uses [Vite](https://vite.dev).

## Available Scripts

- `npm start` (or `npm run dev`): start the dev server at [http://localhost:5173](http://localhost:5173), open it and check `public/locales/en/translation.missing.json`
- `npm run build`: production build into `dist/`
- `npm run preview`: serve the production build locally (no save-missing handler, that's dev-server only)

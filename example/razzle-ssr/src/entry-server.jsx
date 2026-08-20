import React, { Suspense } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import App from './App';

// req.i18n is the per-request i18next instance created by i18next-http-middleware
export function render(req) {
  const html = renderToString(
    <I18nextProvider i18n={req.i18n}>
      <Suspense fallback={<div>Still loading i18n...</div>}>
        <StaticRouter location={req.originalUrl}>
          <App />
        </StaticRouter>
      </Suspense>
    </I18nextProvider>,
  );

  // First preferred language
  const initialLanguage = req.i18n.languages[0];

  // Fill initialI18nStore with only the necessary namespaces.
  const initialI18nStore = {};
  const usedNamespaces = req.i18n.reportNamespaces.getUsedNamespaces();

  req.i18n.languages.forEach((language) => {
    initialI18nStore[language] = {};

    usedNamespaces.forEach((namespace) => {
      initialI18nStore[language][namespace] =
        req.i18n.services.resourceStore.data[language][namespace];
    });
  });

  return { html, initialI18nStore, initialLanguage };
}

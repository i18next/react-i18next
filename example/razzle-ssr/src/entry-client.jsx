import React, { Suspense } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { useSSR } from 'react-i18next';
import App from './App';
import './i18n';

const BaseApp = () => {
  useSSR(window.initialI18nStore, window.initialLanguage);
  return (
    <Suspense fallback={<div>Still loading i18n...</div>}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Suspense>
  );
};

hydrateRoot(document.getElementById('root'), <BaseApp />);

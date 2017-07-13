import React from 'react';
import { translate } from 'react-i18next';
import i18n from '../i18n';

import PureComponent from '../components/PureComponent';
import ExtendedComponent from '../components/ExtendedComponent';

function myPage({ t, initialI18nStore }) {
  return (
    <div>
      {t('welcome')}
      <p>{t('integrates_react-i18next')}</p>
      <PureComponent t={t} />
      <ExtendedComponent />
    </div>
  );
}

const Extended = translate('common', { i18n, wait: process.browser })(myPage);

// Passing down initial translations
// use req.i18n instance on serverside to avoid overlapping requests set the language wrong
Extended.getInitialProps = async ({ req }) => {
  if (req && !process.browser) {
    req.i18n.toJSON = () => null; // do not serialize i18next instance and send to client

    const initialI18nStore = {};
    req.i18n.languages.forEach((l) => {
      initialI18nStore[l] = req.i18n.services.resourceStore.data[l];
    });

    return {
      i18n: req.i18n, // use the instance on req - fixed language on request (avoid issues in race conditions with lngs of different users)
      initialI18nStore,
      initialLanguage: req.i18n.language
    };
  }
  return {};
};

export default Extended;

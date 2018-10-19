import React from 'react';
import App, { Container } from 'next/app';
import Router from 'next/router';
import { NamespacesConsumer } from 'react-i18next';
import i18n from '../i18n';
import languagePathCorrection from '../lib/languagePathCorrection';
import { translation } from '../config';

const { enableSubpaths } = translation;

if (enableSubpaths) {
  Router.events.on('routeChangeStart', originalRoute => {
    const correctedPath = languagePathCorrection(originalRoute);
    if (correctedPath !== originalRoute) {
      Router.replace(correctedPath, correctedPath, { shallow: true });
    }
  });

  i18n.on('languageChanged', lng => {
    if (process.browser) {
      const originalRoute = window.location.pathname;
      const correctedPath = languagePathCorrection(originalRoute, lng);
      if (correctedPath !== originalRoute) {
        Router.replace(correctedPath, correctedPath, { shallow: true });
      }
    }
  });
}

// Using _app with translated content will give a warning:
// Warning: Did not expect server HTML to contain a <h1> in <div>.
// not sure - did neither find something wrong - nor seems the warning to make sense
export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <NamespacesConsumer
          {...pageProps}
          ns="common"
          i18n={(pageProps && pageProps.i18n) || i18n}
          wait={process.browser}
        >
          {t => (
            <React.Fragment>
              <h1>{t('common:integrates_react-i18next')}</h1>
              <button
                type="button"
                onClick={() => {
                  const lng = i18n.languages[0] === 'en' ? 'de' : 'en';
                  i18n.changeLanguage(lng);
                }}
              >
                Change locale
              </button>
              <Component {...pageProps} />
            </React.Fragment>
          )}
        </NamespacesConsumer>
      </Container>
    );
  }
}

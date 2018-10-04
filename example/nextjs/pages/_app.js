import React from 'react';
import App, { Container } from 'next/app';
import { NamespacesConsumer } from 'react-i18next';
import i18n from '../i18n';

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
          wait={false}
        >
          {t => (
            <React.Fragment>
              <h1>{t('common:integrates_react-i18next')}</h1>
              <Component {...pageProps} />
            </React.Fragment>
          )}
        </NamespacesConsumer>
      </Container>
    );
  }
}

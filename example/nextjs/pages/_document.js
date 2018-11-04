import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { translation } from '../config';

export default class MyApp extends Document {
  static async getInitialProps({ req }) {
    return {
      initialLanguage: req.language ? req.language : translation.defaultLanguage,
    };
  }

  render() {
    const { initialLanguage } = this.props;

    return (
      <html lang={initialLanguage}>
        <Head />
        <body>
          <Main initialLanguage={initialLanguage} />
          <NextScript />
        </body>
      </html>
    );
  }
}

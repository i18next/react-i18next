import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    const { t, i18n } = this.props;

    const changeLanguage = lng => {
      i18n.changeLanguage(lng);
    };

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>{t('title')}</h2>
          <button onClick={() => changeLanguage('de')}>de</button>
          <button onClick={() => changeLanguage('en')}>en</button>
        </div>
        <div className="App-intro">
          <Trans i18nKey="description_1">
            To get started, edit <code>src/App.js</code> and save to reload.
          </Trans>
        </div>
        <div>{t('description_2')}</div>
        <Trans i18nKey="emails" values={{ unreadEmails: 5 }}>
          You have <strong>one</strong> unread email.
        </Trans>
      </div>
    );
  }
}

export default withNamespaces('translations')(App);

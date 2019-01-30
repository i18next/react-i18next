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
          <h2>{t('Welcome to React')}</h2>
          <button onClick={() => changeLanguage('de')}>de</button>
          <button onClick={() => changeLanguage('en')}>en</button>
        </div>
        <div className="App-intro">
          <Trans>
            To get started, edit <code>src/App.js</code> and save to reload.
          </Trans>
        </div>
        <div>{t('will be added automatically to locize.')}</div>
      </div>
    );
  }
}

export default withNamespaces('translations')(App);

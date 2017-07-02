import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    const { t } = this.props;

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>{t('Welcome to React')}</h2>
        </div>
        <p className="App-intro">
          <Trans>
            To get started, edit <code>src/App.js</code> and save to reload.
          </Trans>
        </p>
      </div>
    );
  }
}

export default translate('translations')(App);

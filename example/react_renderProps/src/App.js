import React, { Component } from 'react';
import { NamespacesConsumer, Trans } from 'react-i18next';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <NamespacesConsumer ns="translations">
        {
          (t, { i18n }) => (
            <div className="App">
              <div className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h2>{t('title')}</h2>
                <button onClick={() => i18n.changeLanguage('de')}>de</button>
                <button onClick={() => i18n.changeLanguage('en')}>en</button>
              </div>
              <div className="App-intro">
                <Trans i18nKey="description.part1">
                  To get started, edit <code>src/App.js</code> and save to reload.
                </Trans>
              </div>
              <div>{t('description.part2')}</div>
            </div>
          )
        }
      </NamespacesConsumer>
    );
  }
}

export default App;

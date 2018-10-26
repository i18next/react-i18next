import React, { Component } from 'react';
import { useT, withT, Trans } from 'react-i18next/hooks';
import logo from './logo.svg';
import './App.css';


class LegacyWelcomeClass extends Component {
  render() {
    const { t, ready } = this.props;

    if (!ready) return null;

    return (
      <h2>{t('title')}</h2>
    )
  }
}
const Welcome = withT()(LegacyWelcomeClass)

// Component using the Trans component
function MyComponent() {
  return (
    <Trans i18nKey="description.part1">
      To get started, edit <code>src/App.js</code> and save to reload.
    </Trans>
  )
}


// the app gets passed in t and i18n by using same hoc withNamespaces
// using i18n.changeLanguage you can change the language programmatically
// (same is possible using the NamespacesConsumer render prop - just read the docs)
export default function App() {
  const [t, ready, i18n] = useT();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  }

  if (!ready) return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
    </div>
  )

  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Welcome />
        <button onClick={() => changeLanguage('de')}>de</button>
        <button onClick={() => changeLanguage('en')}>en</button>
      </div>
      <div className="App-intro">
        <MyComponent />
      </div>
      <div>{t('description.part2')}</div>
    </div>
  );
}



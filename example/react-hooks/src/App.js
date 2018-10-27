import React, { Component, Suspense } from 'react';
import { useT, withT, Trans } from 'react-i18next/hooks';
import logo from './logo.svg';
import './App.css';

// use hoc for class based components
class LegacyWelcomeClass extends Component {
  render() {
    const { t, ready } = this.props;

    if (!ready) return null;

    return <h2>{t('title')}</h2>;
  }
}
const Welcome = withT()(LegacyWelcomeClass);

// Component using the Trans component
function MyComponent() {
  return (
    <Trans i18nKey="description.part1">
      To get started, edit <code>src/App.js</code> and save to reload.
    </Trans>
  );
}

// page uses the hook
function Page() {
  const [t, i18n] = useT();

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="App">
      <Suspense fallback={<Loader />}>
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
      </Suspense>
    </div>
  );
}

// loading component for suspence fallback
const Loader = () => (
  <div className="App">
    <img src={logo} className="App-logo" alt="logo" />
  </div>
);

// here app catches the suspense from page in case translations are not yet loaded
export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Page />
    </Suspense>
  );
}

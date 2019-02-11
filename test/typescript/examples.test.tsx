import * as React from 'react';
import { useTranslation, withTranslation, Trans, WithTranslation } from 'react-i18next';

// use hoc for class based components
class LegacyWelcomeClass extends React.Component<WithTranslation> {
  render() {
    const { t, i18n } = this.props;
    return <h2>{t('title')}</h2>;
  }
}
const Welcome = withTranslation()(LegacyWelcomeClass);

// Component using the Trans component
function MyComponent() {
  return (
    <Trans i18nKey="description.part1">
      To get started, edit <code>src/App.js</code> and save to reload.
    </Trans>
  );
}

// Component using the Trans component without children (Self-closing)
function MyComponentWithoutChildren() {
  return (
    <Trans i18nKey="description.part1" />
  );
}

// page uses the hook
function Page() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="App">
      <React.Suspense fallback={<Loader />}>
        <div className="App-header">
          <Welcome />
          <button onClick={() => changeLanguage('de')}>de</button>
          <button onClick={() => changeLanguage('en')}>en</button>
        </div>
        <div className="App-intro">
          <MyComponent />
        </div>
        <div>{t('description.part2')}</div>
      </React.Suspense>
    </div>
  );
}

// loading component for suspence fallback
const Loader = () => <div className="App">Loading...</div>;

// here app catches the suspense from page in case translations are not yet loaded
export default function App() {
  return (
    <React.Suspense fallback={<Loader />}>
      <Page />
    </React.Suspense>
  );
}

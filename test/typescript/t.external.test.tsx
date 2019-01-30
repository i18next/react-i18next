import * as React from 'react';
import { NamespacesConsumer, Trans, withNamespaces, WithNamespaces } from 'react-i18next';

function Welcome() {
  return (
    <NamespacesConsumer>
      {(t, { i18n }) => (
        <h2>
          {t`title`}
          {t('title')}
          {t('title', { Opt: '' })}
        </h2>
      )}
    </NamespacesConsumer>
  );
}

function MyComponent({ t }: WithNamespaces) {
  return (
    <Trans i18nKey="description.part1">
      To get started, edit{' '}
      <code>
        {t`src/App.js`}
        {t('src/App.js')}
      </code>{' '}
      and save to reload.
    </Trans>
  );
}
const MyComponentWrapped = withNamespaces()(MyComponent);

class App extends React.Component<WithNamespaces> {
  render() {
    const { t, i18n } = this.props;

    const changeLanguage = (lng: string) => {
      i18n.changeLanguage(lng);
    };

    return (
      <div className="App">
        <div className="App-header">
          <Welcome />
          <button onClick={() => changeLanguage('de')}>de</button>
          <button onClick={() => changeLanguage('en')}>en</button>
        </div>
        <div className="App-intro">
          <MyComponentWrapped />
        </div>
        <div>{t`description.part2`}</div>
        <div>{t('description.part2')}</div>
        <div>{t('description.part2', { opt: '' })}</div>
      </div>
    );
  }
}
export default withNamespaces('translation')(App);

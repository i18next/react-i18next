import React, { Component, Suspense } from 'react';
import { storiesOf } from '@storybook/react';
import { useTranslation, withTranslation, Trans } from 'react-i18next';

import '../i18n';

// here catches the suspense from components not yet ready (still loading translations)
// alternative set useSuspense false on i18next.options.react when initializing i18next
export default function SuspenseWrapper({ children }) {
  return <Suspense fallback={<div>loading...</div>}>{children}</Suspense>;
}

class ClassComponent extends Component {
  render() {
    const { t } = this.props;
    return <h2>{t('title')}</h2>;
  }
}
const ComponentUsingHOC = withTranslation()(ClassComponent);

function ComponentUsingHook() {
  const { t, i18n } = useTranslation();

  return <div>{t('description.part2')}</div>;
}

function ComponentUsingTrans() {
  return (
    <Trans i18nKey="description.part1">
      To get started, edit <code>src/App.js</code> and save to reload.
    </Trans>
  );
}

storiesOf('Components', module)
  .addDecorator(story => <SuspenseWrapper>{story()}</SuspenseWrapper>)
  .add('mocking', () => <ClassComponent t={k => k} />)
  .add('class component using HOC', () => <ComponentUsingHOC />)
  .add('functional component using hook', () => <ComponentUsingHook />)
  .add('component using Trans component', () => <ComponentUsingTrans />);

import React from 'react';
import { storiesOf } from '@storybook/react';
import { NamespacesConsumer } from 'react-i18next';

// a pure component using the `t` function
const SayWelcomeComponent = ({ t }) => (
  <div>
    {t('Welcome to React')}
    <div style={{ marginTop: 40, fontSize: 14, color: '#666' }}>
      toggle language using the withI18nextProvider to see content in different languages
    </div>
  </div>
);

// passing t function using a render prop
const SayWelcome = () => (
  <NamespacesConsumer>{t => <SayWelcomeComponent t={t} />}</NamespacesConsumer>
);

// we just pass down a mock `t` funtion so the component works in stories
storiesOf('NamespacesConsumer', module).add('showing a component', () => <SayWelcome />);

// learn more
// https://react.i18next.com/components/namespacesconsumer

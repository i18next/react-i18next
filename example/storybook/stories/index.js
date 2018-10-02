import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import SayWelcome from './SayWelcome';

import App from '../src/App';
import { I18n, I18nextProvider } from 'react-i18next';
import i18n from '../src/i18n';
import '../src/i18n';

// Just a reminder. When you integrate with storybook, initializing is needed 
// since its environment is totally separated from the actual app

// If you can't use this.props.t from child components(from this example <App />) check if you wrapped <App /> with translate().
// example: export default translate()(App)
storiesOf('decorated component (having translate hoc)', module)
  .addDecorator(story => (
    <I18nextProvider i18n={i18n}>{story()}</I18nextProvider>
  ))
  .add('app view', () => <App />);

storiesOf(
  'undecorated component (no translate hoc just t function in props)',
  module
).add('showing a pure component', () => <SayWelcome t={key => key} />);

// If you see this error 'TypeError: Cannot read property 'options' of undefined' either
// 1. You forgot to do i18n.use(reactI18nextModule) at i18n.js file or
// 2. import '../src/i18n';
storiesOf('render prop style', module).add(
  'you can use t right away from render prop or can pass it to a component',
  () => (
    <I18n ns='translations'>
      {t => (
        <div>
          <p>{t('Welcome to React')}</p>
          <SayWelcome t={t} />
        </div>
      )}
    </I18n>
  )
);

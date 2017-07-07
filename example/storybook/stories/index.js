import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import SayWelcome from './SayWelcome';

import App from '../src/App';
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/i18n';

storiesOf('decorated component (having translate hoc)', module)
  .addDecorator(story => (
     <I18nextProvider i18n={ i18n }>
       {story()}
     </I18nextProvider>
   ))
  .add('app view', () => (
    <App />
  ))

  storiesOf('undecorated component (no translate hoc just t function in props)', module)
    .add('showing a pure component', () => (
      <SayWelcome t={key => key} />
    ))

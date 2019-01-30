import React from 'react';
import { storiesOf } from '@storybook/react';

import App from '../src/App';
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/i18n';

// for this case you might not have set i18n.use(reactI18nextModule) in '../src/i18n'
// we have done this to also show how it works with in the runAppUsingReactI18nextModule

// use a decorator to enclose your stories in a I18nextProvider
storiesOf('with I18nextProvider', module)
  .addDecorator(story => <I18nextProvider i18n={i18n}>{story()}</I18nextProvider>)
  .add('app view', () => <App />);

// learn more:
// https://react.i18next.com/components/overview#getting-the-t-function

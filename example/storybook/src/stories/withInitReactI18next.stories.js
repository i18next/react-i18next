import React from 'react';
import { storiesOf } from '@storybook/react';

import '../i18n';
import App from '../App';

// for this case we have set i18n.use(initReactI18next) in '../src/i18n' so no I18nextProvicer is needed to pass i18n down via context api

storiesOf('App with initReactI18next', module).add('app view', () => <App />);

// learn more:
// https://react.i18next.com/components/overview#getting-the-t-function

import React from 'react';
import { storiesOf } from '@storybook/react';

import App from '../src/App';

// for this case we have set i18n.use(reactI18nextModule) in '../src/i18n' so no I18nextProvicer is needed to pass i18n down via context api

storiesOf('with reactI18nextModule', module).add('app view', () => <App />);

// learn more:
// https://react.i18next.com/components/overview#getting-the-t-function

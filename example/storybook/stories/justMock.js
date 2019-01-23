import React from 'react';
import { storiesOf } from '@storybook/react';

// a pure component using the `t` function
const SayWelcome = ({ t }) => (
  <div>
    {t('Welcome to React')}
    <div style={{ marginTop: 40, fontSize: 14, color: '#666' }}>
      toggle language using the withI18nextProvider won't have an effect as this is just a mocked t
      function
    </div>
  </div>
);

// we just pass down a mock `t` funtion so the component works in stories
storiesOf('Mock "away"', module).add('showing a pure component', () => (
  <SayWelcome t={key => key} />
));

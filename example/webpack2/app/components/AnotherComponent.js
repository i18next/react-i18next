import React from 'react';
import { translate } from 'react-i18next';

function Component () {
  return <p>thing</p>
}

export default translate('view', { wait: true })(Component);

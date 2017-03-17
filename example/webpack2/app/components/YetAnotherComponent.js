import React from 'react';
import { translate } from 'react-i18next';

function Component({t}) {
  return <p>{t('usingDefaultNS', { /* options t options */ })}</p>
}

export default translate()(Component);

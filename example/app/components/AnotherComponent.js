import React from 'react';
import { translate } from 'react-i18next/lib';

function Component({t}) {
  return <p>{t('content.text', { /* options t options */ })}</p>
}

export default translate('view')(Component);

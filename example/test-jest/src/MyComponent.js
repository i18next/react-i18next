import React from 'react';
import { translate } from 'react-i18next';

export const CustomComponent = ({ t }) => {
  return <div>{t('description.part2')}</div>
};

export default translate('translations')(CustomComponent);

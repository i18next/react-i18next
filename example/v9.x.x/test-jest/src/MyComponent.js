import React from 'react';
import { withNamespaces } from 'react-i18next';

export const CustomComponent = ({ t }) => <div>{t('description.part2')}</div>;

export default withNamespaces('translations')(CustomComponent);

import { useContext } from 'react';
import i18next from 'i18next';
import { I18nContext } from 'react-i18next';

i18next.reportNamespaces.addUsedNamespaces(['translation']);
i18next.reportNamespaces.getUsedNamespaces();

function ContextConsumer() {
  const { i18n } = useContext(I18nContext);
}

import * as React from 'react';
import { useSSR } from 'react-i18next';
import { Resource } from 'i18next';
import { default as myI18n } from './i18n';

interface Props {
  initialI18nStore: Resource;
  initialLanguage: string;
}

function TestComponent({
  initialI18nStore = myI18n.store.data,
  initialLanguage = myI18n.language,
}: Props) {
  useSSR(initialI18nStore, initialLanguage);

  return <div />;
}

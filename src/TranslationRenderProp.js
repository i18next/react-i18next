import React from 'react';
import { useTranslation } from './useTranslation';

export function TranslationRenderProp(props) {
  const { ns, children } = props;
  const [t, i18n] = useTranslation(ns, props);

  return children(t, {
    i18n,
    t,
    lng: i18n.language,
  });
}

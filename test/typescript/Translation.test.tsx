import * as React from 'react';
import { Translation } from 'react-i18next';

function basic() {
  return <Translation>{(t, { i18n, lng }) => <div>{t('key1')}</div>}</Translation>;
}

function ready() {
  return (
    <Translation>
      {(t, { i18n, lng }, ready) => <div>{ready ? t('key1') : 'default'}</div>}
    </Translation>
  );
}

function ns() {
  return <Translation ns="foo">{(t, { i18n, lng }) => <div>{t('key1')}</div>}</Translation>;
}

function nsArray() {
  return (
    <Translation ns={['foo', 'bar']}>{(t, { i18n, lng }) => <div>{t('key1')}</div>}</Translation>
  );
}

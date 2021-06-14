import * as React from 'react';
import { Translation } from 'react-i18next';

function defaultNamespaceUsage() {
  return <Translation>{(t) => <>{t('foo')}</>}</Translation>;
}

function namedDefaultNamespaceUsage() {
  return <Translation ns="custom">{(t) => <>{t('foo')}</>}</Translation>;
}

function alternateNamespaceUsage() {
  return <Translation ns="alternate">{(t) => <>{t('baz')}</>}</Translation>;
}

function arrayNamespace() {
  return (
    <Translation ns={['alternate', 'custom']}>
      {(t) => (
        <>
          {t('alternate:baz')}
          {t('custom:foo')}
        </>
      )}
    </Translation>
  );
}

function expectErrorWhenNamespaceDoesNotExist() {
  // @ts-expect-error
  return <Translation ns="fake">{(t) => <>{t('foo')}</>}</Translation>;
}

function expectErrorWhenKeyNotInNamespace() {
  // @ts-expect-error
  return <Translation ns="custom">{(t) => <>{t('fake')}</>}</Translation>;
}

function expectErrorWhenUsingArrayNamespaceAndUnscopedKey() {
  // @ts-expect-error
  return <Translation ns={['custom']}>{(t) => <>{t('foo')}</>}</Translation>;
}

function expectErrorWhenUsingArrayNamespaceAndWrongKey() {
  // @ts-expect-error
  return <Translation ns={['custom']}>{(t) => <>{t('custom:fake')}</>}</Translation>;
}

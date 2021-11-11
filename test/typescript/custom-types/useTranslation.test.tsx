import * as React from 'react';
import { useTranslation } from 'react-i18next';

function defaultNamespaceUsage() {
  const { t } = useTranslation();

  return <>{t('foo')}</>;
}

function namedDefaultNamespaceUsage() {
  const [t] = useTranslation('custom');
  return <>{t('bar')}</>;
}

function alternateNamespaceUsage() {
  const [t] = useTranslation('alternate');
  return <>{t('baz')}</>;
}

function arrayNamespace() {
  const [t] = useTranslation(['alternate', 'custom']);
  return (
    <>
      {t('alternate:baz')}
      {t('custom:foo')}
    </>
  );
}

function readonlyArrayNamespace() {
  const namespaces = ['alternate', 'custom'] as const;
  const [t] = useTranslation(namespaces);
  return (
    <>
      {t('alternate:baz')}
      {t('custom:foo')}
    </>
  );
}

function keyPrefixOption() {
  const [t] = useTranslation('alternate', { keyPrefix: 'foobar' });
  return <>{t('barfoo')}</>;
}

function deepKeyPrefixOption() {
  const [t] = useTranslation('alternate', { keyPrefix: 'foobar.deep' });
  return (
    <>
      {t('deeper').deeeeeper}
      {t('deeper.deeeeeper')}
    </>
  );
}

function jsonFormatV4Plurals() {
  const [t] = useTranslation('plurals');
  return (
    <>
      {t('foo')}
      {t('foo_one')}
    </>
  );
}

function expectErrorWhenNamespaceDoesNotExist() {
  // @ts-expect-error
  const [t] = useTranslation('fake');
  return <>{t('foo')}</>;
}

function expectErrorWhenKeyNotInNamespace() {
  const [t] = useTranslation('custom');
  // @ts-expect-error
  return <>{t('fake')}</>;
}

function expectErrorWhenUsingArrayNamespaceAndUnscopedKey() {
  const [t] = useTranslation(['custom']);
  // @ts-expect-error
  return <>{t('foo')}</>;
}

function expectErrorWhenUsingArrayNamespaceAndWrongKey() {
  const [t] = useTranslation(['custom']);
  // @ts-expect-error
  return <>{t('custom:fake')}</>;
}

function expectErrorWhenUsingWrongKeyPrefixOption() {
  // @ts-expect-error
  const [t] = useTranslation('alternate', { keyPrefix: 'abc' });
  return <>{t('barfoo')}</>;
}

function expectErrorWhenUsingRightKeyPrefixOptionAndWrongKey() {
  const [t] = useTranslation('alternate', { keyPrefix: 'foobar' });
  // @ts-expect-error
  return <>{t('abc')}</>;
}

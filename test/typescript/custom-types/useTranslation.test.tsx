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

// Test Context

function fullKeyUsage() {
  const { t } = useTranslation('withContext');
  return t('animal.type_lion');
}

function arrayFullKeyUsage() {
  const [t] = useTranslation(['withContext']);
  return t('withContext:animal.type_lion');
}

function withoutContext() {
  const { t } = useTranslation('withContext');
  const result = t('animal.type');
  return result === 'Lion' || result === 'Penguin';
}

function contextUsage() {
  const { t } = useTranslation('withContext');
  return t('animal.type', { context: 'lion' }) === 'Lion';
}

function keyWithMultipleUnderscores() {
  const { t } = useTranslation('withContext');
  return t('key_with') === 'Multiple';
}

function pluralUsage() {
  const { t } = useTranslation('withContext');
  const result = t('person', { count: 1 });
  return result === 'Persons' || result === 'Person';
}

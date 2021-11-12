import * as React from 'react';
import { Trans, useTranslation } from 'react-i18next';

function defaultNamespaceUsage() {
  return <Trans i18nKey="foo">foo</Trans>;
}

function namedDefaultNamespaceUsage() {
  return (
    <Trans ns="custom" i18nKey="foo">
      foo
    </Trans>
  );
}

function alternateNamespaceUsage() {
  return (
    <Trans ns="alternate" i18nKey="baz">
      foo
    </Trans>
  );
}

function arrayNamespace() {
  return (
    <Trans ns={['alternate', 'custom']} i18nKey={['alternate:baz', 'custom:bar']}>
      foo
    </Trans>
  );
}

function withTfunction() {
  const { t } = useTranslation('alternate');

  return (
    <Trans t={t} i18nKey="foobar.barfoo">
      foo
    </Trans>
  );
}

function withTfunctionAndKeyPrefix() {
  const { t } = useTranslation('alternate', { keyPrefix: 'foobar.deep' });

  return (
    <Trans t={t} i18nKey="deeper.deeeeeper">
      foo
    </Trans>
  );
}

function expectErrorWhenNamespaceDoesNotExist() {
  return (
    // @ts-expect-error
    <Trans ns="fake" i18nKey="foo">
      foo
    </Trans>
  );
}

function expectErrorWhenKeyNotInNamespace() {
  return (
    // @ts-expect-error
    <Trans ns="custom" i18nKey="fake">
      foo
    </Trans>
  );
}

function expectErrorWhenUsingArrayNamespaceAndUnscopedKey() {
  return (
    // @ts-expect-error
    <Trans ns={['custom']} i18nKey={['foo']}>
      foo
    </Trans>
  );
}

function expectErrorWhenUsingArrayNamespaceAndWrongKey() {
  return (
    // @ts-expect-error
    <Trans ns={['custom']} i18nKey={['custom:fake']}>
      foo
    </Trans>
  );
}

function withTfunctionAndKeyPrefixAndWrongKey() {
  const { t } = useTranslation('alternate', { keyPrefix: 'foobar.deep' });

  return (
    // @ts-expect-error
    <Trans t={t} i18nKey="xxx">
      foo
    </Trans>
  );
}

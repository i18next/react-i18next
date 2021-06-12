import * as React from 'react';
import { Trans } from 'react-i18next';

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

import * as React from 'react';
import { Trans, useTranslation } from 'react-i18next';

function basic() {
  return <Trans>Foo</Trans>;
}

function children() {
  return (
    <Trans>
      <div />
    </Trans>
  );
}

function components() {
  return <Trans components={[<div />]}>Foo</Trans>;
}

function constComponents() {
  const constArray = [<div />] as const;
  return <Trans components={constArray}>Foo</Trans>;
}

function objectComponents() {
  return <Trans components={{ Btn: <button /> }} defaults="Hello <Btn />" />;
}

function MyComponent() {
  return <>world</>;
}

function objectCustomComponents() {
  return <Trans components={{ Btn: <MyComponent /> }} defaults="Hello <Btn />" />;
}

function constObjectComponents() {
  const constObject = {
    Btn: <button />,
  } as const;
  return <Trans components={constObject} defaults="Hello <Btn />" />;
}

function count() {
  return <Trans count={42}>Foo</Trans>;
}

function defaults() {
  return <Trans defaults={'defaults'}>Foo</Trans>;
}

function i18n() {
  const { i18n } = useTranslation();
  return <Trans i18n={i18n}>Foo</Trans>;
}

function i18nKey() {
  return <Trans i18nKey={'i18nKey'}>Foo</Trans>;
}

function ns() {
  return <Trans ns={'ns'}>Foo</Trans>;
}

function parent() {
  return <Trans parent="div">Foo</Trans>;
}

function tOptions() {
  return <Trans tOptions={{}}>Foo</Trans>;
}

function values() {
  return <Trans values={{}}>Foo</Trans>;
}

function t() {
  const { t } = useTranslation();
  return <Trans t={t}>Foo</Trans>;
}

function CustomRedComponent(props: { children: React.ReactNode }) {
  return <div style={{ color: 'red' }}>{props.children}</div>;
}

function extraDivProps() {
  return (
    <>
      <Trans parent="div" style={{ color: 'green' }}>
        Foo
      </Trans>
      {/* div is the default parent */}
      <Trans style={{ color: 'green' }}>Foo</Trans>
      <Trans parent={null}>No parent (overrides the default one)</Trans>
      <Trans parent={CustomRedComponent}>Use a custom component as parent</Trans>
    </>
  );
}

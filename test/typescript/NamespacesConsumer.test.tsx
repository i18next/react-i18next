import i18next from 'i18next';
import * as React from 'react';
import { NamespacesConsumer } from 'react-i18next';

function withi18nProp() {
  // const i18n = i18next.init({});
  return <NamespacesConsumer i18n={i18next}>{t => <h2>{t('title')}</h2>}</NamespacesConsumer>;
}

function workWithOptionalProps() {
  interface ControlProps {
    hint?: string;
  }
  function Control(props: ControlProps) {
    return <div>{props.hint === undefined ? 'undefined' : props.hint}</div>;
  }
  return (
    <NamespacesConsumer i18n={i18next}>{t => <Control hint={t('title')} />}</NamespacesConsumer>
  );
}

function workWithVariousResults() {
  return (
    <NamespacesConsumer i18n={i18next}>
      {(t, { i18n }) => {
        // sanity first - tests from i18next t.test
        const is: string = i18n.t('friend'); // same as <string>
        const io: object = i18n.t<object>('friend');
        const isa: string[] = i18n.t<string[]>('friend');
        const ioa: object[] = i18n.t<object[]>('friend');

        // now try t provided by NamespacesConsumer
        const s: string = t('friend'); // same as <string>
        const o: object = t<object>('friend');
        const sa: string[] = t<string[]>('friend');
        const oa: object[] = t<object[]>('friend');

        return <div>foo</div>;
      }}
    </NamespacesConsumer>
  );
}

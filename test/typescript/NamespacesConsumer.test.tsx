import i18next from "i18next";
import * as React from "react";
import { NamespacesConsumer } from "../../src/index";

function withi18nProp() {
  // const i18n = i18next.init({});
  return (
    <NamespacesConsumer i18n={i18next}>
      {(t) => <h2>{t("title")}</h2>}
    </NamespacesConsumer>
  );
}

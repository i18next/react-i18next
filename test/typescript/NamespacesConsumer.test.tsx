import i18next from "i18next";
import * as React from "react";
import { NamespacesConsumer } from "../../src/index";

type TKeys = "title" | "text";

function withi18nProp() {
  // const i18n = i18next.init({});
  return (
    <div>
      <NamespacesConsumer i18n={i18next}>
        {(t) =>
          <div>
            <h2>{t<TKeys>("title")}</h2>
            <div>{t<TKeys>("text")}</div>
            <div>{t("none")}</div>
          </div>
        }
      </NamespacesConsumer>
    </div>
  );
}

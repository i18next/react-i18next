import * as React from "react";
import {
  NamespacesConsumer,
  Trans,
  withNamespaces,
  WithNamespaces,
} from "../../src/index";

type TKeys = "title" | "text";

function NamespacesConsumerTest() {
  return (
    <NamespacesConsumer>
      {(t, { i18n }) =>
        <div>
          <h2>{t<TKeys>("title")}</h2>
          <span>{t("any")}</span>
          <span>{t<TKeys>("text")}</span>
          <span>{t<TKeys, {key: string}>("text", {key: "foo"})}</span>
        </div>
      }
    </NamespacesConsumer>
  );
}

function TransComponentTest({ t }: WithNamespaces) {
  return (
    <div>
      <Trans i18nKey="description.part1">
        To get started, edit <code>src/App.js</code> and save to reload.
      </Trans>
      <Trans i18nKey="description.part1">
        To get started, <strong title={t<TKeys>("title")}>{{name}}</strong>and save to reload.
      </Trans>
    </div>
  );
}

const MyComponentWrapped = withNamespaces()(TransComponentTest);

type ArticleKeys = "article.part1" | "article.part2";
type AnotherArticleKeys = "anotherArticle.part1" | "anotherArticle.part2";
class App extends React.Component<WithNamespaces> {
  public render() {
    const { t, i18n } = this.props;

    const changeLanguage = (lng: string) => {
      i18n.changeLanguage(lng);
    };

    return (
      <div className="App">
        <div className="App-header">
          <NamespacesConsumerTest />
          <button onClick={() => changeLanguage("de")}>de</button>
          <button onClick={() => changeLanguage("en")}>en</button>
        </div>
        <div className="App-intro">
          <MyComponentWrapped />
        </div>
        <article>
          <div>{t<ArticleKeys>("article.part1")}</div>
          <div>{t<ArticleKeys>("article.part2")}</div>
        </article>
        <article>
          <div>{t<AnotherArticleKeys>("anotherArticle.part1")}</div>
          <div>{t<AnotherArticleKeys>("anotherArticle.part2")}</div>
        </article>
      </div>
    );
  }
}
export default withNamespaces("translation")(App);

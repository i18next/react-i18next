import * as React from "react";
import {
  NamespacesConsumer,
  Trans,
  withNamespaces,
  WithNamespaces,
} from "../../src/index";

// Component using the render prop NamespacesConsumer
// get t function inside the component
// learn more: https://react.i18next.com/components/namespacesconsumer
function Welcome() {
  return (
    <NamespacesConsumer>
      {(t, { i18n }) => <h2>{t("title")}</h2>}
    </NamespacesConsumer>
  );
}

// Component using the higher order component withNamespaces
// pass t function via props into the component
// learn more: https://react.i18next.com/components/withnamespaces
function MyComponent({ t }: WithNamespaces) {
  return (
    <Trans i18nKey="description.part1">
      To get started, edit <code>src/App.js</code> and save to reload.
    </Trans>
  );
}
const MyComponentWrapped = withNamespaces()(MyComponent);

// the app gets passed in t and i18n by using same hoc withNamespaces
// using i18n.changeLanguage you can change the language programmatically
// (same is possible using the NamespacesConsumer render prop - just read the docs)
class App extends React.Component<WithNamespaces> {
  public render() {
    const { t, i18n } = this.props;

    const changeLanguage = (lng: string) => {
      i18n.changeLanguage(lng);
    };

    return (
      <div className="App">
        <div className="App-header">
          <Welcome />
          <button onClick={() => changeLanguage("de")}>de</button>
          <button onClick={() => changeLanguage("en")}>en</button>
        </div>
        <div className="App-intro">
          <MyComponentWrapped />
        </div>
        <div>{t("description.part2")}</div>
      </div>
    );
  }
}
export default withNamespaces("translation")(App);

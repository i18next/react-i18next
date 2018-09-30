import React, { Component } from "react";
import ReactDOM from "react-dom";
import i18n from "i18next";
import { withI18n, reactI18nextModule } from "react-i18next";

i18n
  .use(reactI18nextModule)
  .init({
    resources: {
      en: {
        translation: {
          "Welcome to React": "Welcome to React and react-i18next"
        }
      }
    },
    lng: "en",
    fallbackLng: "en",

    interpolation: {
      escapeValue: false
    }
  });

class App extends Component {
  render() {
    const { t } = this.props;

    return <h2>{t('Welcome to React')}</h2>;
  }
}
const AppWithI18n = withI18n()(App);

// append app to dom
ReactDOM.render(
  <AppWithI18n />,
  document.getElementById("root")
);
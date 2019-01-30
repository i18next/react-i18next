import React from 'react';
import { withNamespaces } from 'react-i18next';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import i18n from './js/i18n';
import Home from './js/pages/Home';
import Page2 from './js/pages/Page2';

const Stack = createStackNavigator({
  Home: { screen: Home },
  Page2: { screen: Page2 },
});

// Wrapping a stack with translation hoc asserts we get new render on language change
// the hoc is set to only trigger rerender on languageChanged
class WrappedStack extends React.Component {
  static router = Stack.router;
  render() {
    const { t } = this.props;
    return <Stack screenProps={{ t }} {...this.props} />;
  }
}
const ReloadAppOnLanguageChange = withNamespaces('common', {
  bindI18n: 'languageChanged',
  bindStore: false,
})(createAppContainer(WrappedStack));

// The entry point using a react navigation stack navigation
// gets wrapped by the I18nextProvider enabling using translations
// https://github.com/i18next/react-i18next#i18nextprovider
export default class App extends React.Component {
  render() {
    return <ReloadAppOnLanguageChange />;
  }
}

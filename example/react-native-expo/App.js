import React from 'react';
import { I18nextProvider, translate } from 'react-i18next';
import { StackNavigator } from 'react-navigation';
import i18n from './js/i18n';
import Home from './js/pages/Home';
import Page2 from './js/pages/Page2';

const Stack = StackNavigator({
  Home: { screen: Home },
  Page2: { screen: Page2 }
});

// Wrapping a stack with translation hoc asserts we get new render on language change
// the hoc is set to only trigger rerender on languageChanged
const WrappedStack = () => {
  return <Stack screenProps={{ t: i18n.getFixedT() }} />;
}
const ReloadAppOnLanguageChange = translate('common', {
  bindI18n: 'languageChanged',
  bindStore: false
})(WrappedStack);

// The entry point using a react navigation stack navigation
// gets wrapped by the I18nextProvider enabling using translations
// https://github.com/i18next/react-i18next#i18nextprovider
export default class App extends React.Component {
  render() {
    return (
      <I18nextProvider i18n={ i18n }>
        <ReloadAppOnLanguageChange />
      </I18nextProvider>
    );
  }
}

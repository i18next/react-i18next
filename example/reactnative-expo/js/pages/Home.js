import React from 'react';
import { withNamespaces } from 'react-i18next';
import { StyleSheet, Text, View, Button } from 'react-native';

// using the translation hoc to provie t function in props using home as default namespace
// https://github.com/i18next/react-i18next#translate-hoc
export class Home extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t('home:title'),
  });

  render() {
    const { t, i18n, navigation } = this.props;
    const { navigate } = navigation;

    return (
      <View style={styles.container}>
        <Text>{t('common:currentLanguage', { lng: i18n.language })}</Text>
        <Button
          onPress={() => {
            i18n.changeLanguage('en');
          }}
          title={t('common:actions.toggleToEnglish')}
        />
        <Button
          onPress={() => {
            i18n.changeLanguage('de');
          }}
          title={t('common:actions.toggleToGerman')}
        />
        <Text style={styles.separate}>{t('introduction')}</Text>
        <Button onPress={() => navigate('Page2')} title={t('common:actions.goToPage2')} />
      </View>
    );
  }
}

export default withNamespaces(['home', 'common'], { wait: true })(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separate: {
    marginTop: 50,
  },
});

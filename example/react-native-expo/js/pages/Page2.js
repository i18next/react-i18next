import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet, Text, View, Button } from 'react-native';


@translate(['page2', 'common'], { wait: true })
export default class Home extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t('page2:title')
  });

  render() {
    const { t, i18n } = this.props;

    return (
      <View style={styles.container}>
        <Text>{t('introduction')}</Text>
        <Text>{t('common:currentLanguage', { lng: i18n.language })}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

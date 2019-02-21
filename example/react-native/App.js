import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import i18next from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: cb => cb('en'),
  init: () => {},
  cacheUserLanguage: () => {},
};

i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    resources: {
      en: {
        translation: {
          hello: 'Hello world',
          change: 'Change language',
        },
      },
      sv: {
        translation: {
          hello: 'Hej världen',
          change: 'Byt språk',
        },
      },
    },
  });

export default function App() {
  const { t, i18n } = useTranslation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>{t('hello')}</Text>

      <TouchableOpacity onPress={() => i18n.changeLanguage(i18n.language === 'sv' ? 'en' : 'sv')}>
        <Text>{t('change')}</Text>
      </TouchableOpacity>
    </View>
  );
}

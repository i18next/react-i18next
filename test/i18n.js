import i18n from 'i18next';


i18n
  .init({
    lng: 'en',
    fallbackLng: 'en',

    resources: {
      en: {
        translation: {
          key1: 'test',
          interpolateKey: 'add {{insert}} {{up, uppercase}}'
        }
      }
    },

    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ',',
      format: function(value, format, lng) {
        if (format === 'uppercase') return value.toUpperCase();
        return value;
      }
    }
  });


export default i18n;

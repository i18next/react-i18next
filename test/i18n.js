import i18n from 'i18next';


i18n
  .init({
    lng: 'en',
    fallbackLng: 'en',

    resources: {
      en: {
        translation: {
          key1: 'test',
          interpolateKey: 'add {{insert}} {{up, uppercase}}',
          interpolateKey2: '<strong>add</strong> {{insert}} {{up, uppercase}}',
          transTest1: "Go <1>there</1>.",
          transTest2: "Hello <1><0>{{name}}</0></1>, you have <3>{{count}}</3> message. Open <5>hear</5>.",
          transTest2_plural: "Hello <1><0>{{name}}</0></1>, you have <3>{{count}}</3> messages. Open <5>here</5>.",
          testTransKey1: "<0>{{numOfItems}}</0> item matched.",
          testTransKey1_plural: "<0>{{numOfItems}}</0> items matched.",
          testTransKey2: "<0><0>{{numOfItems}}</0></0> item matched.",
          testTransKey2_plural: "<0><0>{{numOfItems}}</0></0> items matched.",
          testTransKey3: "Result: <1><0>{{numOfItems}}</0></1> item matched.",
          testTransKey3_plural: "Result: <1><0>{{numOfItems}}</0></1> items matched."
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

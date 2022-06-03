import i18n from 'i18next';

// set instance on hooks stuff
// import { setI18n } from '../../src/context';
//
// setI18n(i18n);

i18n.init({
  lng: 'en',
  fallbackLng: 'en',

  resources: {
    en: {
      translation: {
        key1: 'test',
        interpolateKey: 'add {{insert}} {{up, uppercase}}',
        interpolateKey2: '<strong>add</strong> {{insert}} {{up, uppercase}}',
        transTest1: 'Go <1>there</1>.',
        transTest1_noParent: '<0>Go <1>there</1>.</0>',
        transTest1_customHtml: '<strong>Go</strong> <br/><1>there</1>.',
        transTest1_customHtml2: '<strong>Go</strong> <br/> there.',
        transTest1_customHtml3:
          '<strong>Go</strong><video /><script>console.warn("test")</script> there.',
        transTest2:
          'Hello <1><0>{{name}}</0></1>, you have <3>{{count}}</3> message. Open <5>hear</5>.',
        transTest2_other:
          'Hello <1><0>{{name}}</0></1>, you have <3>{{count}}</3> messages. Open <5>here</5>.',
        transTest2InV2: 'Hello <1>{{name}}</1>, you have {{count}} message. Open <5>hear</5>.',
        transTest2InV2_other:
          'Hello <1>{{name}}</1>, you have {{count}} messages. Open <5>here</5>.',
        testTransKey1: '<0>{{numOfItems}}</0> item matched.',
        testTransKey1_other: '<0>{{numOfItems}}</0> items matched.',
        testTransKey2: '<0><0>{{numOfItems}}</0></0> item matched.',
        testTransKey2_other: '<0><0>{{numOfItems}}</0></0> items matched.',
        testTransKey3: 'Result: <1><0>{{numOfItems}}</0></1> item matched.',
        testTransKey3_other: 'Result: <1><0>{{numOfItems}}</0></1> items matched.',
        testInvalidHtml: '<hello',
        testInvalidHtml2: '<hello>',
        testTrans4KeyWithNestedComponent: 'Result should be a list: <0></0>',
        testTrans5KeyWithNestedComponent: 'Result should be a list: <1></1>',
        testTrans5KeyWithValue: 'Result should be rendered within tag <0>{{testValue}}</0>',
        deepPath: {
          deepKey1: 'value1',
        },
      },
      other: {
        transTest1: 'Another go <1>there</1>.',
      },
    },
  },

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ',',
    format(value, format) {
      if (format === 'uppercase') return value.toUpperCase();
      return value;
    },
  },

  react: {
    defaultTransParent: 'div',
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
  },
});

export default i18n;

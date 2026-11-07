import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    keySeparator: false;
    // ICU, so the same messages also type IcuTrans values
    parseInterpolation: 'icu';
    resources: {
      translation: {
        'nested.c': 'Hello {name}';
        'nested.d': 'plain';
      };
    };
  }
}

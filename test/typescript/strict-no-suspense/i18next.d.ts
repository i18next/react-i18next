import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    strictNoSuspense: true;
    resources: {
      translation: {
        foo: 'foo';
        bar: 'bar';
      };
      alternate: {
        baz: 'baz';
      };
    };
  }
}

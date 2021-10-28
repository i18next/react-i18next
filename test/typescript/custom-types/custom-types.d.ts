import 'react-i18next';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'custom';
    resources: {
      custom: {
        foo: 'foo';
        bar: 'bar';
      };
      alternate: {
        baz: 'baz';
        foobar: {
          barfoo: 'barfoo';
        };
      };
    };
  }
}

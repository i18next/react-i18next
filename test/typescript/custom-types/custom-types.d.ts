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
          deep: {
            deeper: {
              deeeeeper: 'foobar';
            };
          };
        };
      };
      plurals: {
        foo_zero: 'foo';
        foo_one: 'foo';
        foo_two: 'foo';
        foo_many: 'foo';
        foo_other: 'foo';
      };
    };
  }
}

import 'i18next';
// allowObjectInHTMLChildren needs the opt-in augmentation of React's HTMLAttributes
import 'react-i18next/augment-react';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'custom';
    allowObjectInHTMLChildren: true;
    enableSelector: 'strict';
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
    };
  }
}

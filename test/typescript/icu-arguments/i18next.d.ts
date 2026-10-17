import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'custom';
    parseInterpolation: 'icu';
    resources: {
      custom: {
        greeting: 'Hello {name}!';
        rows: '{count, plural, one {# row} other {# rows}}';
        rich: 'Welcome back, <0>{name}</0>!';
        plain: 'Welcome <0>back</0>!';
        deep: { inner: 'Inner {value}' };
      };
      other: { welcome: 'Welcome {user}' };
    };
  }
}

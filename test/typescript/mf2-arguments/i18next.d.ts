import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'custom';
    parseInterpolation: 'mf2';
    resources: {
      custom: {
        greeting: 'Hello {$name}!';
        rows: '.input {$count :number}\n.match $count\none {{{$count} row}}\n* {{{$count} rows}}';
        rich: 'Welcome back, <0>{$name}</0>!';
      };
    };
  }
}

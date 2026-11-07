// Opt-in: lets HTML elements nested in <Trans> take interpolation objects as children,
// e.g. <Trans><strong>{{ name }}</strong></Trans>, when CustomTypeOptions sets
// allowObjectInHTMLChildren: true. Import it once, next to that declaration:
//
//   import 'react-i18next/augment-react';
//
// It widens React's HTMLAttributes['children'], which @types/react does not allow to be redeclared,
// so it needs skipLibCheck: true with current @types/react.
import type { TypeOptions } from 'i18next';
import type * as React from 'react';

type ObjectOrNever = TypeOptions['allowObjectInHTMLChildren'] extends true
  ? Record<string, unknown>
  : never;

type ReactI18NextChildren = React.ReactNode | ObjectOrNever;

declare module 'react' {
  interface HTMLAttributes<T> {
    // Without allowObjectInHTMLChildren this is React's own children type, so it follows @types/react.
    // The union is inspired by the typings for React.ReactNode. We do this to fix "This JSX tag's 'children' prop
    // expects a single child of type 'ReactI18NextChildren', but multiple children were provided":
    // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/5a1e9f91ed0143adede394adb3f540e650455f71/types/react/index.d.ts#L268
    children?: TypeOptions['allowObjectInHTMLChildren'] extends true
      ? ReactI18NextChildren | Iterable<ReactI18NextChildren>
      : DOMAttributes<T>['children'];
  }
}

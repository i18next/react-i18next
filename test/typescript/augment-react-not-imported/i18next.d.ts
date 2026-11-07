import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    // without `import 'react-i18next/augment-react'`, this alone does not change React's types
    allowObjectInHTMLChildren: true;
  }
}

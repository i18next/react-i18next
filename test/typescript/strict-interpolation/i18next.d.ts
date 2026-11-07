import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    // the default since i18next 27, set here so the project means the same on older cores
    strictInterpolationChecks: true;
    resources: {
      translation: {
        title: 'Title: <strong>{{appName}}</strong>';
        greeting: 'Hello {{userName}}';
        plain: 'plain';
      };
    };
  }
}

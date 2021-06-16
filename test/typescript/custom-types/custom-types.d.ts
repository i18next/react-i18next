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
      };
      withContext: {
        type_male: 'Man';
        type_female: 'Woman';
        person: 'Person';
        person_plural: 'Persons';
        key_with_multiple: 'Multiple';
        animal: {
          type_lion: 'Lion';
          type_penguin: 'Penguin';
        };
      };
    };
  }
}

import neostandard from 'neostandard';
import eslintReact from '@eslint-react/eslint-plugin';
import testingLibrary from 'eslint-plugin-testing-library';
import jestDom from 'eslint-plugin-jest-dom';

export default [
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'example/**',
      'react-i18next.js',
      'react-i18next.min.js',
      // ponytail: the .jsx tests were never linted (eslint 8 only picked up .js); lint them in their own change
      'test/**/*.jsx',
    ],
  },
  ...neostandard({ semi: true, noStyle: true }),
  {
    files: ['**/*.js'],
    ...eslintReact.configs.recommended,
  },
  {
    rules: {
      curly: 'off',
      // react >= 16.8 is supported, `use()` needs 19
      '@eslint-react/no-use-context': 'off',
      // Trans walks and clones its children by design
      '@eslint-react/no-clone-element': 'off',
      '@eslint-react/no-children-map': 'off',
      '@eslint-react/no-children-to-array': 'off',
      '@eslint-react/no-array-index-key': 'off',
    },
  },
  {
    files: ['test/**/*.js'],
    ...testingLibrary.configs['flat/react'],
    settings: { 'testing-library/custom-renders': 'off' },
  },
  {
    files: ['test/**/*.js'],
    ...jestDom.configs['flat/recommended'],
  },
  {
    files: ['test/**/*.js'],
    rules: {
      'testing-library/no-node-access': ['error', { allowContainerFirstChild: true }],
      'testing-library/no-manual-cleanup': 'off',
    },
  },
];

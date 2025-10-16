import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'runtime',
    dir: './test',
    exclude: ['**/typescript/**'],
    environment: 'happy-dom',
    setupFiles: ['./test/setup'],

    coverage: {
      reporter: ['text', 'html', 'json', 'lcov'],
      include: ['**/src/**/*.{js,jsx,ts}', '*.macro.js'],
      exclude: [
        '**/src/index.js',
        '**/src/shallowEqual.js',
        '**/src/icu.macro.ts',
        '**/src/icu.macro/imports.ts',
        '**/src/icu.macro/plural.ts',
        '**/src/icu.macro/select.ts',
        '**/src/icu.macro/trans.ts',
        '**/src/icu.macro/utils/transformers.ts',
        '**/src/icu.macro/utils/get-jsx-context.ts',
        '**/src/icu.macro/utils/index.ts',
        '**/src/icu.macro/utils/types.ts',
        '**/node_modules/**',
        '**/test/**',
        '**/example/**',
      ],
    },
  },
});

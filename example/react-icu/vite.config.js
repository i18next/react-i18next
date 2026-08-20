import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

export default defineConfig({
  // react-i18next/icu.macro needs babel-plugin-macros; @vitejs/plugin-react 6 has no babel option anymore
  plugins: [babel({ plugins: ['macros'] }), react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
});

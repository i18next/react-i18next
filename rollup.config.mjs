import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import yargs from 'yargs';

const { argv } = yargs(process.argv);

const format = argv.format || argv.f || 'iife';
const compress = argv.uglify;

const babelOptions = {
  presets: [
    [
      '@babel/preset-env',
      {
        // ES2020: the same browser versions as i18next's build (keep in sync with .babelrc)
        targets: 'chrome 80, edge 80, firefox 80, safari 14, ios 14, opera 67, samsung 13',
        // keep the ES2020 syntax, only work around engine bugs
        bugfixes: true,
      },
    ],
    '@babel/react',
  ],
  babelrc: false,
  comments: false,
};

const file = {
  umd: `dist/umd/react-i18next${compress ? '.min' : ''}.js`,
  iife: `dist/iife/react-i18next${compress ? '.min' : ''}.js`,
}[format];

export default {
  input: 'src/index.js',
  plugins: [
    babel(babelOptions),
    replace({
      'process.env.NODE_ENV': JSON.stringify(compress ? 'production' : 'development'),
    }),
    nodeResolve({ jsnext: true, main: true }),
    commonjs({}),
  ].concat(compress ? terser() : []),
  external: ['react', 'react-dom', 'i18next'],
  // moduleId: 'react-i18next',
  output: {
    name: 'ReactI18next',
    format,
    file,
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      i18next: 'i18next',
    },
  },
};

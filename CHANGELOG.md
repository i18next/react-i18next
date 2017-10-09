### 6.0.6
-remove PureComponent from Trans

### 6.0.5
- fixes support passing i18n and t to Trans as props [PR315](https://github.com/i18next/react-i18next/pull/315)

### 6.0.4
- fixes translate hoc build

### 6.0.3
- stop using PureComponent and use Component again...seems we get an issue with react-router v4 if using PureComponents
- recreate t function on i18next updates so PureComponents relying on t get an update triggered

### 6.0.2
- rebuild needed cause of uppercasing for components name was not reflected in last build

### 6.0.1
- remove react from dependencies - not sure how that came into the package.json

### 6.0.0
- **[BREAKING]** removes options to set translateFuncName in translate hoc (was not supported in Trans and Interpolate component anyway)
- setting i18n instance and defaults can now be done by i18next.use(reactI18nextModule) making I18nextProvider obsolete
- As an alternative to the translate hoc you now can use the I18n component supporting a render props (for details about render props https://www.youtube.com/watch?v=BcVAq3YFiuc)

### 5.4.1
- fixes AST implementation for preact

### 5.4.0
- replaces regex used to parse nodes from string to an ast implementation solving [#298](https://github.com/i18next/react-i18next/issues/298)

### 5.3.0
- Pass extra parameters to Trans parent component

### 5.2.0
- adds module export in package.json pointing to es dist files.


### 5.1.0
- you now can set i18n instance on translate hoc once using setI18n:

```
import translate from 'react-i18next';
import i18n from './i18n';

translate.setI18n(i18n);
```

### 5.0.0
- **[BREAKING]** we no longer accept wait to be specified on i18next init options like ``{ wait: true }`` -> all overrides for the translate hoc now have to be in child `react` like `{ react: { wait: true } }`
- you now can override all the default options for translate hoc by setting them on i18next.init (excluding `translateFuncName` as we need that upfront to define childContextTypes)

```
i18next.init({
  // ... other options
  react: {
    wait: false,
    withRef: false,
    bindI18n: 'languageChanged loaded',
    bindStore: 'added removed',
    nsMode: 'default'
  }
});
```

- you now can override all defaults for translate hoc options (including `translateFuncName`) by using:

```
import translate from 'react-i18next';

translate.setDefaults({
  wait: false,
  withRef: false,
  bindI18n: 'languageChanged loaded',
  bindStore: 'added removed',
  nsMode: 'default',
  translateFuncName: 't'
});
```


### 4.8.0
- make trans component work with preact and preact-compat
- add preact example

### 4.7.0
- Trans component parent element configurable [PR278](https://github.com/i18next/react-i18next/pull/278)

### 4.6.4
- optimize generated defaultValue for components not having children

### 4.6.3
- move react, prop-types, ... to peerDependency again

### 4.6.2
- optimize trans component output

### 4.6.1
- fixes issue in changeLanguage on set via translate hoc ssr

### 4.6.0
- allow passing initialI18nStore and initialLanguage to I18nextProvider via props to support simpler ssr
- adds a serverside rendering sample based on razzle

### 4.5.0
- pass i18n instance to context inside translate hoc to simplify usage in nextjs
- options.react.exposeNamespace will expose namespace on data-i18next-options for consuming in editors

### 4.4.0
- introduces Trans component which enables you to translate nested components incl. interpolation by resulting in one translatable string. [learn more](https://react.i18next.com/components/trans-component.html)

### 4.3.0
- allow passing down initialI18nStore and initialLanguage to translate hoc to support ssr scenario better see example/nextjs

### 4.2.0
- allow passing i18next instance in translate hoc options makes integration in nextjs easier

### 4.1.2
- Remove workaround to set ready if there was no initialized signal [PR263](https://github.com/i18next/react-i18next/pull/263)

### 4.1.1
- Fix react-i18next to work with TypeScript [PR261](https://github.com/i18next/react-i18next/pull/261)

### 4.1.0
- eslint cleanup
- a lot more tests
- flag nsMode: 'fallback' -> uses namespaces passed to translate hoc as fallbacks [#254](https://github.com/i18next/react-i18next/issues/254)

### 4.0.0
- deploys 3.1.1 as possible breaking: fixes issue in fixing t function - pass only first namespace not an array of namespaces (access other namespaces like: this.props.t('namespace:key'))

### 3.1.2
- reverts last change

### 3.1.1
- fixes issue in fixing t function - pass only first namespace not an array of namespaces

### 3.1.0
- fixes wrong warning of missing prop on interpolate with format
- the wait flag on translate hoc can now be set globally on i18next options `i18next.init({ wait: true })`

### 3.0.0
- [BREAKING] assert you install prop-types as a peerDependency based on changes in react >= 15.5.x
- update react to 15.5.x use prop-types module to remove react warnings [PR248](https://github.com/i18next/react-i18next/pull/248)
- update all dependencies
- move react, prop-types to peerDependencies

### 2.2.3
- try not access store if undefined for hmr

### 2.2.1
- fixes validation for missing prop in interpolate component

### 2.2.0
- support formatting inside interpolate component

### 2.1.0
- tanslate hoc: expose the i18n instance via props

### 2.0.0
- translate hoc wait option asserts now that i18next is initialized before rendering (waits for lng detection)
- [BREAKING] needs i18next >= 4.2.0

### 1.11.0
- pass style prop to interpolate component
- define i18next as a peerDependency

### 1.10.1
- Suppresses required context type warning if passing i18n as a prop [PR205](https://github.com/i18next/react-i18next/pull/205)

### 1.10.0
- allow passing i18next instance via props to translate hoc [PR203](https://github.com/i18next/react-i18next/pull/203)

### 1.9.0
- adds options bindI18n, bindStore can be set to false or string of events to bind for triggering updates

### 1.8.0
- allows to set a className on interpolate component
- update all dependencies and devDependencies

### 1.7.0
- add option to change t function name to something else [PR196](https://github.com/i18next/react-i18next/pull/196)
- Added an option of using the <Interpolate /> with a raw HTML [PR195](https://github.com/i18next/react-i18next/pull/195)

### 1.6.3
- only trigger loaded namespaces if mounted

### 1.6.2
- update for react 15.2, eliminates Unknown Prop Warning

### 1.6.1
- Added conditional warning on unmatched variable during interpolation [PR 160](https://github.com/i18next/react-i18next/pull/160

### 1.6.0
- Hoist non react statics [PR 150](https://github.com/i18next/react-i18next/pull/150

### 1.5.3
- Handle i18next added and removed resource events [PR 150](https://github.com/i18next/react-i18next/pull/150

### 1.5.2
- move ns loading to did mount

### 1.5.1
- possible fix for HRM issues

### 1.5.0
- adds wait option, which delays initial rendering until translations are loaded

### 1.4.2
- possible fix for HRM issues

### 1.4.1
- change global name

### 1.4.0
- adds getWrappedInstance() to translate wrapper

### 1.3.0
- Support for universal apps / server-side rendering [PR 52](https://github.com/i18next/react-i18next/pull/52)

### 1.2.2
- fixes bower json - bower publish only

### 1.2.0
- change build to rollup

### 1.1.0
- added WrappedComponent property to translate wrapper [PR 15](https://github.com/i18next/react-i18next/pull/15)

### 1.0.1
- fixing export of index

### 1.0.0
- change package.json main to `/lib/index.js`
- move build from gulp to npm run script

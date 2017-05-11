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

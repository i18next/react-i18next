# react-i18next

> Higher-order components and components for React when using [i18next](https://github.com/i18next/i18next).

[![NPM][npm-icon] ][npm-url]

[![Travis CI][travis-ci-image] ][travis-ci-url]
[![Coverage Status](https://coveralls.io/repos/github/i18next/react-i18next/badge.svg?branch=master)](https://coveralls.io/github/i18next/react-i18next?branch=master)
[![Quality][quality-badge] ][quality-url]
[![dependencies][dependencies-image] ][dependencies-url]
[![devdependencies][devdependencies-image] ][devdependencies-url]

[npm-icon]: https://nodei.co/npm/react-i18next.png?downloads=true
[npm-url]: https://npmjs.org/package/react-i18next
[travis-ci-image]: https://travis-ci.org/i18next/react-i18next.svg?branch=master
[travis-ci-url]: https://travis-ci.org/i18next/react-i18next

[dependencies-image]: https://david-dm.org/i18next/react-i18next.png
[dependencies-url]: https://david-dm.org/i18next/react-i18next
[devdependencies-image]: https://david-dm.org/i18next/react-i18next/dev-status.png
[devdependencies-url]: https://david-dm.org/i18next/react-i18next#info=devDependencies

[quality-badge]: http://npm.packagequality.com/shield/react-i18next.svg
[quality-url]: http://packagequality.com/#?package=react-i18next

### Installation

Source can be loaded via [npm](https://www.npmjs.com/package/react-i18next), bower or [downloaded](https://github.com/i18next/react-i18next/blob/master/react-i18next.min.js) from this repo.

```
# npm package
$ npm install react-i18next

# bower
$ bower install react-i18next
```

- If you don't use a module loader it will be added to `window.reactI18next`

### Examples

* [Example project](https://github.com/i18next/react-i18next/tree/master/example)

### Requirements

- react >= __0.14.0__
- i18next >= __2.0.0__

--------------
**NEWS: localization as a service - locize.com**

Needing a translation management? Want to edit your translations with an InContext Editor? Use the orginal provided to you by the maintainers of i18next!

![locize](http://i18next.com/img/locize_recap_medium_low.gif)

With using [locize](http://locize.com/) you directly support the future of i18next and react-i18next.

--------------

## Documentation

### I18nextProvider

It will add your i18n instance in context.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';

import App from './App'; // your entry page
import i18n from './i18n'; // initialized i18next instance

ReactDOM.render(
  <I18nextProvider i18n={ i18n }><App /></I18nextProvider>,
  document.getElementById('app')
);
```

You can safely set escapeValue to false in interpolation options as react take care of escaping, see the [sample](https://github.com/i18next/react-i18next/blob/master/example/app/i18n.js#L19).

### Translate HOC

__translate(namespaces, options)__: higher-order component to wrap a translatable component.

- All given namespaces will be loaded.
- props.t will default to first namespace in array of given namespaces (providing a string as namespace will convert automatically to array, providing no namespaces will default to `defaultNS`)
- used nested inside I18nextProvider (context.i18n) or by passing i18n as a prop
- passing `{ withRef: true }` to options store a ref to the wrapped component instance making it available via `getWrappedInstance()` method
- passing `{ translateFuncName: 'someFunctionName' }` will change the name of the property passed to the child component for the translation function (by default, the value is `t`). This is useful if you are already using a concrete function name for extracting the translation chains from your source files

options:

```js
{
  withRef: false,         // store a ref to the wrapped component
  translateFuncName: 't', // will change the name of translation prop default 't'
  wait: false,            // delay rendering until translations are loaded - wait can be set globally on i18next init too
  bindI18n: 'languageChanged loaded',   // which events trigger a rerender, can be set to false or string of events
  bindStore: 'added removed'            // which events on store trigger a rerender, can be set to false or string of events
}
```

```javascript
import React from 'react';
import { translate } from 'react-i18next';

function TranslatableView(props) {
  const { t } = props;

  return (
    <div>
      <h1>{t('keyFromDefault')}</h1>
      <p>{t('anotherNamespace:key.from.another.namespace', { /* options t options */ })}</p>
    </div>
  )
}

export default translate(['defaultNamespace', 'anotherNamespace'])(TranslatableView);

```

You can set options.wait to true per options in hoc or globally on i18next.init if you want to delay rendering until translation files are loaded:

```javascript
import React from 'react';
import { translate } from 'react-i18next';

function TranslatableView(props) {
  const { t } = props;

  return (
    <div>
      <h1>{t('keyFromDefault')}</h1>
      <p>{t('anotherNamespace:key.from.another.namespace', { /* options t options */ })}</p>
    </div>
  )
}

export default translate(['defaultNamespace', 'anotherNamespace'], { wait: true })(TranslatableView);

```



__getWrappedInstance()__: allows you to access to the component instance, wrapped into `translate()`.
Only available if you pass `{ withRef: true }` to the `translate()` options.

```javascript
import React, { Component } from 'react';
import { translate } from 'react-i18next';

class TranslatableView extends Component {

  foo() {
    // do something important
  }

  render() {
    const { t } = this.props;

    return (
      <div>
        <h1>{t('keyFromDefault')}</h1>
      </div>
    )
  }
}

export default translate(['defaultNamespace', 'anotherNamespace'], { withRef: true })(TranslatableView);
```

```javascript
import React, { Component } from 'react';
import ./TranslatableView;

class App extends Component {

  handleClick() {
    this.refs.translatedView.foo();
  }

  render() {
    return (
      <div>
        <TranslatableView ref="translatedView" />
        <button onClick={() => this.handleClick()}>Click</button>
      </div>
    )
  }
}
```

### Interpolate Component

__Interpolate__: component that allows to interpolate React Components or other props into translations.

- used nested inside I18nextProvider and translation hoc (context.i18n, context.t)

__props__:

- i18nKey: the key to lookup
- options: [options](http://i18next.com/docs/options/#t-options) to use for translation (exclude interpolation variables!)
- parent: optional component to wrap translation into (default 'span')
- useDangerouslySetInnerHTML: allows use of raw html tags in translation values
- dangerouslySetInnerHTMLPartElement: optional component to wrap parts of translation values into (default 'span'), used with `useDangerouslySetInnerHTML={true}` only
- ...props: values to interpolate into found translation (eg. `my value with {{replaceMe}} interpolation`)



```json
  {
    "interpolateSample": "you <strong>can</strong> interpolate {{value}} or {{component}} via interpolate component!"
  }
```

```javascript
import React from 'react';
import { translate, Interpolate } from 'react-i18next';

function TranslatableView(props) {
  const { t } = props;

  let interpolateComponent = <strong>a interpolated component</strong>;

  return (
    <div>
      <Interpolate i18nKey='ns:interpolateSample' value='"some string"' component={interpolateComponent} />
      {/*
        =>
        <span>
          you &lt;strong&gt;can&lt;/strong&gt; interpolate "some string" or <strong>a interpolated component</strong> via interpolate component!
        </span>
      */}


      <Interpolate i18nKey='ns:interpolateSample' useDangerouslySetInnerHTML={true} value='"some string"' component={interpolateComponent} />
      {/*
        =>
        <span>
          you <strong>can</strong> interpolate "some string" or <strong>a interpolated component</strong> via interpolate component!
        </span>
      */}
    </div>
  )
}
```

You can use formatting, see the [sample](https://github.com/i18next/react-i18next/blob/master/example/app/i18n.js#L20).

### Universal Rendering

__loadNamespaces__: Function that will pre-load all namespaces used by your components.  Works well with `react-router` `match` function

__props__:

- components: Components that need to have namespaces loaded.
- i18n: the i18n instance to load translations into

```javascript
import { I18nextProvider, loadNamespaces } from 'react-i18next';
import { match } from 'react-router';

match({...matchArguments}, (error, redirectLocation, renderProps) => {
   loadNamespaces({ ...renderProps, i18n: i18nInstance })
   .then(()=>{
      // All i18n namespaces required to render this route are loaded   
   })
});
```
When using [i18next-express-middleware](https://github.com/i18next/i18next-express-middleware), you can use `req.i18n` as the `i18next` instance for `I18nextProvider`:

```javascript
import { I18nextProvider } from 'react-i18next';
import i18n from './i18next'; // your own initialized i18next instance
import App from './app';

app.use((req, res) => {
   const component = (
      <I18nextProvider i18n={req.i18n}>
         <App />
      </I18nextProvider>
   );

   // render as desired now ...
});
```

Full [sample/boilerplate](https://github.com/simpleblack/react-redux-universal-hot-example) for universal rendering.

### Typescript users

For Typescript users, if you are running into issues, such as `Uncaught TypeError: Cannot read property 'off' of undefined`, it's possible that you have not exported your own initialized i18next instance correctly. Try the following:

```typescript
import * as i18n from 'i18next'
import * as XHR from 'i18next-xhr-backend'
import * as LanguageDetector from 'i18next-browser-languagedetector'
import config from '../src/config/config'

const instance = i18n
  .use(/* your settings */)
  .init({
    // your settings here
  })

export default instance
```

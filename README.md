# react-i18next

> Higher-order components and components for React when using [i18next](https://github.com/i18next/i18next).

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

### Translate HOC

__translate(namespaces)__: higher-order component to wrap a translatable component.

- All given namespaces will be loaded.
- props.t will default to first namespace in array of given namespaces (providing a string as namespace will convert automatically to array, providing no namespaces will default to `defaultNS`)
- used nested inside I18nextProvider (context.i18n)


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

### Interpolate Component

__Interpolate__: component that allows to interpolate React Components or other props into translations.

- used nested inside I18nextProvider and translation hoc (context.i18n, context.t)

__props__:

- i18nKey: the key to lookup
- options: [options](http://i18next.com/docs/options/#t-options) to use for translation (exclude interpolation variables!)
- parent: optional component to wrap translation into (default 'span')
- ...props: values to interpolate into found translation (eg. `my value with {{replaceMe}} interpolation`)



```json
  {
    "interpolateSample": "you can interpolate {{value}} or {{component}} via interpolate component!"
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
          you can interpolate "some string" or <strong>a interpolated component</strong> via interpolate component!
        </span>
      */}
    </div>
  )
}
```

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

Full [sample/boilerplate](https://github.com/simpleblack/react-redux-universal-hot-example) for universal rendering.

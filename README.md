# react-i18next

> Higher-order components and components for React when using [i18next](https://github.com/i18next/i18next).
### Installation

Source can be loaded via [npm](https://www.npmjs.com/package/react-i18next), bower or [downloaded](https://github.com/i18next/react-i18next/blob/master/react-i18next.min.js) from this repo.

```
# npm package
$ npm install react-i18next

# bower
$ bower install i18next/react-i18next
```

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
- props.t will default to first namespace in array of given namespaces (providing a string as namespace will convert automatically to array)


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

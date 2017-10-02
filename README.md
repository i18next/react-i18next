# react-i18next

> Higher-order components and components for React when using [i18next](https://www.i18next.com).

[![Travis CI][travis-ci-image] ][travis-ci-url]
[![Code Climate](https://codeclimate.com/github/codeclimate/codeclimate/badges/gpa.svg)](https://codeclimate.com/github/i18next/react-i18next)
[![Coverage Status](https://coveralls.io/repos/github/i18next/react-i18next/badge.svg?t=2)](https://coveralls.io/github/i18next/react-i18next)
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

### How will my code look like?

**Before:** Your react code would have looked something like:

```html
...
<div>Just simple content</div>
<div>
  Hello <strong title="this is your name">{name}</strong>, you have {count} unread message(s). <Link to="/msgs">Go to messages</Link>.
</div>
...
```

**After:** With the trans component just change it to:

```html
...
<div>{t('simpleContent')}</div>
<Trans i18nKey="userMessagesUnread" count={count}>
  Hello <strong title={t('nameTitle')}>{{name}}</strong>, you have {{count}} unread message. <Link to="/msgs">Go to messages</Link>.
</Trans>
...
```

Have a look at the interactive playground at [webpackbin](https://www.webpackbin.com/bins/-KoCD3kvA-4QJNaHpkxi).

[![video](https://raw.githubusercontent.com/i18next/react-i18next/master/example/locize-example/video_sample.png)](https://www.youtube.com/watch?v=9NOzJhgmyQE)

[watch the video](https://www.youtube.com/watch?v=9NOzJhgmyQE)

### Documentation

The documentation is published on [react.i18next.com](https://react.i18next.com)

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

* [Example react with render props](https://github.com/i18next/react-i18next/tree/master/example/react_renderProps)
* [Example react with hoc](https://github.com/i18next/react-i18next/tree/master/example/react_withHOC)
* [Example preact with render props](https://github.com/i18next/react-i18next/tree/master/example/preact_renderProps)
* [Example preact with hoc](https://github.com/i18next/react-i18next/tree/master/example/preact_withHOC)
* [Example react-native](https://github.com/i18next/react-i18next/tree/master/example/react-native-expo)
* [Example expo.io](https://github.com/i18next/react-i18next/tree/master/example/react-native-expo)
* [Example next.js](https://github.com/i18next/react-i18next/tree/master/example/nextjs)
* [Example razzle](https://github.com/i18next/react-i18next/tree/master/example/razzle-ssr)
* [Example hashbase / beaker browser](https://github.com/i18next/react-i18next/tree/master/example/dat)
* [Example storybook](https://github.com/i18next/react-i18next/tree/master/example/storybook)
* [Example locize.com](https://github.com/i18next/react-i18next/tree/master/example/locize-example)

### Requirements

- react >= __0.14.0__
- i18next >= __2.0.0__

--------------
**NEWS: localization as a service - locize.com**

Needing a translation management? Want to edit your translations with an InContext Editor? Use the orginal provided to you by the maintainers of i18next!

![locize](https://www.i18next.com/assets/img/locize_recap_big_low.gif)

With using [locize](http://locize.com/) you directly support the future of i18next and react-i18next.

--------------

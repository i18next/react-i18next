# react-i18next [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Awesome%20react-i18next%20for%20react.js%20based%20on%20i18next%20internationalization%20ecosystem%20&url=https://github.com/i18next/react-i18next&via=jamuhl&hashtags=i18n,reactjs,js,dev)

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

### Documentation

The documentation is published on [react.i18next.com](https://react.i18next.com)

### How will my code look like?

**Before:** Your react code would have looked something like:

```jsx
...
<div>Just simple content</div>
<div>
  Hello <strong title="this is your name">{name}</strong>, you have {count} unread message(s). <Link to="/msgs">Go to messages</Link>.
</div>
...
```

**After:** With the trans component just change it to:

```jsx
...
<div>{t('simpleContent')}</div>
<Trans i18nKey="userMessagesUnread" count={count}>
  Hello <strong title={t('nameTitle')}>{{name}}</strong>, you have {{count}} unread message. <Link to="/msgs">Go to messages</Link>.
</Trans>
...
```

Head over to the **interactive playground** at [codesandbox](https://codesandbox.io/s/8n252n822).

### 📖 What others say

- [I18n with React and i18next](https://alligator.io/react/i18n-with-react-and-i18next) via Alligator.io by Danny Hurlburt
- [Ultimate Localization of React (Mobx) App with i18next](https://itnext.io/ultimate-localization-of-react-mobx-app-with-i18next-efab77712149) via itnext.io by Viktor Shevchenko
- [Internationalization for react done right Using the i18next i18n ecosystem](https://reactjsexample.com/internationalization-for-react-done-right-using-the-i18next-i18n-ecosystem/) via reactjsexample.com
- [Using i18next to translate React.js application](https://codetain.co/2018/05/using-i18next-to-translate-reactjs-application/) via codetain.co by Kasia Dadek
- [Building i18n with Gatsby](https://www.gatsbyjs.org/blog/2017-10-17-building-i18n-with-gatsby/) via gatsby.ort by Samuel Goudie
- [Get your react.js application translated with style](https://medium.com/@jamuhl/get-your-react-js-application-translated-with-style-4ad090aefc2c) by Jan Mühlemann
- [Translate your expo.io / react-native mobile application](https://medium.com/@jamuhl/translate-your-expo-io-react-native-mobile-application-aa220b2362d2) by Jan Mühlemann
- you're welcome to share your story...

### Why i18next?

- **Simplicity:** no need to change your webpack configuration or adding additional babel transpilers, just use create-react-app and go
- **Production ready** we know there are more needs for production than just doing i18n on the clientside. So we offer wider support on [serverside](https://www.i18next.com/supported-frameworks.html) too (nodejs, php, ruby, .net, ...). **Learn once - translate everywhere**.
- **Beyond i18n** comes with [locize](https://locize.com) bridging the gap between developement and translations - covering the whole translation process.

<img src="https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-L9iS6Wm2hynS5H9Gj7j%2F-L9iS7LlT2W7wFtJH-2n%2F-L9iSBP9U65-bHJBRSDv%2Fi18next-ecosystem.jpg?generation=1523345318122913&alt=media" alt="i18next ecossystem" width="400">

### Localization workflow

Want to learn more about how seamless your internationalization and translation process can be?

[![video](https://raw.githubusercontent.com/i18next/react-i18next/master/example/locize-example/video_sample.png)](https://www.youtube.com/watch?v=9NOzJhgmyQE)

[watch the video](https://www.youtube.com/watch?v=9NOzJhgmyQE)

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
* [Example test with jest](https://github.com/i18next/react-i18next/tree/master/example/test-jest)

### Requirements

- react >= __0.14.0__ (in case of < v16 or preact you will need to define parent in [Trans component](https://react.i18next.com/components/trans-component.html#props) or globally in [i18next.react options](https://react.i18next.com/components/trans-component.html#additional-options-on-i18nextinit))
- i18next >= __2.0.0__

--------------

<h3 align="center">Gold Sponsors</h3>

<p align="center">
  <a href="https://locize.com/" target="_blank">
    <img src="https://raw.githubusercontent.com/i18next/i18next/master/assets/locize_sponsor_240.gif" width="240px">
  </a>
</p>

--------------
**localization as a service - locize.com**

Needing a translation management? Want to edit your translations with an InContext Editor? Use the orginal provided to you by the maintainers of i18next!

![locize](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-L9iS6Wm2hynS5H9Gj7j%2F-L9iS7LlT2W7wFtJH-2n%2F-L9iS9ueC7bW-EHR-Rev%2Flocize_recap_big_low.gif?generation=1523345308538611&alt=media)

With using [locize](http://locize.com/?utm_source=react_i18next_readme&utm_medium=github) you directly support the future of i18next and react-i18next.

--------------

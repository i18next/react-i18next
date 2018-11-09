export function warn(...args) {
  if (console && console.warn) {
    if (typeof args[0] === 'string') args[0] = `react-i18next:: ${args[0]}`;
    console.warn.apply(null, args);
  }
}

const alreadyWarned = {};
export function warnOnce(...args) {
  if (typeof args[0] === 'string' && alreadyWarned[args[0]]) return;
  if (typeof args[0] === 'string') alreadyWarned[args[0]] = new Date();
  warn(...args);
}

export function deprecated(...args) {
  if (process && process.env && (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')) {
    if (typeof args[0] === 'string') args[0] = `deprecation warning -> ${args[0]}`;
    warnOnce(...args);
  }
}

let initializedLanguageOnce = false;
let initializedStoreOnce = false;
export function initSSR(props, setIsInitialSSR) {
  // nextjs / SSR: getting data from next.js or other ssr stack
  if (!initializedStoreOnce && props.initialI18nStore) {
    props.i18n.services.resourceStore.data = props.initialI18nStore;
    if (setIsInitialSSR) props.i18n.options.isInitialSSR = true;
    if (props.i18nOptions) props.i18nOptions.wait = false; // we got all passed down already
    initializedStoreOnce = true;
  }
  if (!initializedLanguageOnce && props.initialLanguage) {
    props.i18n.changeLanguage(props.initialLanguage);
    initializedLanguageOnce = true;
  }
}

// --------------
// loadNamespaces
const objectEntries =
  Object.entries ||
  function(obj) {
    const ownProps = Object.keys(obj);

    let i = ownProps.length;

    const resArray = new Array(i); // preallocate the Array
    while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
  };

// Borrowed from https://github.com/Rezonans/redux-async-connect/blob/master/modules/ReduxAsyncConnect.js#L16
function eachComponents(components, iterator) {
  for (let i = 0, l = components.length; i < l; i++) {
    // eslint-disable-line id-length
    if (typeof components[i] === 'object') {
      for (const [key, value] of objectEntries(components[i])) {
        iterator(value, i, key);
      }
    } else {
      iterator(components[i], i);
    }
  }
}

function filterAndFlattenComponents(components) {
  const flattened = [];
  eachComponents(components, Component => {
    if (Component && Component.namespaces) {
      Component.namespaces.forEach(namespace => {
        if (flattened.indexOf(namespace) === -1) {
          flattened.push(namespace);
        }
      });
    }
  });
  return flattened;
}

export function loadNamespaces({ components, i18n }) {
  const allNamespaces = filterAndFlattenComponents(components);

  return new Promise(resolve => {
    i18n.loadNamespaces(allNamespaces, resolve);
  });
}

// -------------
// shallowEqual

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule shallowEqual
 * @typechecks
 * @flow
 */

/* eslint-disable no-self-compare */

const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  }
  // Step 6.a: NaN == NaN
  return x !== x && y !== y;
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
export function shallowEqual(objA, objB) {
  if (is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

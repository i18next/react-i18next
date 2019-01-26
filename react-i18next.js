(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = global || self, factory(global.ReactI18next = {}, global.React));
}(this, function (exports, React) { 'use strict';

  var React__default = 'default' in React ? React['default'] : React;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function warn() {
    if (console && console.warn) {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (typeof args[0] === 'string') args[0] = `react-i18next:: ${args[0]}`;
      console.warn.apply(null, args);
    }
  }
  const alreadyWarned = {};
  function warnOnce() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (typeof args[0] === 'string' && alreadyWarned[args[0]]) return;
    if (typeof args[0] === 'string') alreadyWarned[args[0]] = new Date();
    warn(...args);
  }
  function deprecated() {
    if (process && process.env && ("development" === 'development')) {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      if (typeof args[0] === 'string') args[0] = `deprecation warning -> ${args[0]}`;
      warnOnce(...args);
    }
  }
  let initializedLanguageOnce = false;
  let initializedStoreOnce = false;
  function initSSR(props, setIsInitialSSR) {
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
  } // --------------
  // loadNamespaces

  const objectEntries = Object.entries || function (obj) {
    const ownProps = Object.keys(obj);
    let i = ownProps.length;
    const resArray = new Array(i); // preallocate the Array

    while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
  }; // Borrowed from https://github.com/Rezonans/redux-async-connect/blob/master/modules/ReduxAsyncConnect.js#L16


  function eachComponents(components, iterator) {
    for (let i = 0, l = components.length; i < l; i++) {
      // eslint-disable-line id-length
      if (typeof components[i] === 'object') {
        for (const _ref of objectEntries(components[i])) {
          var _ref2 = _slicedToArray(_ref, 2);

          const key = _ref2[0];
          const value = _ref2[1];
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

  function loadNamespaces(_ref3) {
    let components = _ref3.components,
        i18n = _ref3.i18n;
    const allNamespaces = filterAndFlattenComponents(components);
    return new Promise(resolve => {
      i18n.loadNamespaces(allNamespaces, resolve);
    });
  } // -------------
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
    } // Step 6.a: NaN == NaN


    return x !== x && y !== y;
  }
  /**
   * Performs equality by iterating through keys on an object and returning false
   * when any key has values which are not strictly equal between the arguments.
   * Returns true when the values of all keys are strictly equal.
   */


  function shallowEqual(objA, objB) {
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
    } // Test for A's keys different from B.


    for (let i = 0; i < keysA.length; i++) {
      if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
        return false;
      }
    }

    return true;
  }

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var reactIs_development = createCommonjsModule(function (module, exports) {

  {
    (function () {

      Object.defineProperty(exports, '__esModule', {
        value: true
      }); // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
      // nor polyfill, then a plain number is used for performance.

      var hasSymbol = typeof Symbol === 'function' && Symbol.for;
      var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
      var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
      var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
      var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
      var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
      var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
      var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;
      var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
      var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
      var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
      var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
      var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
      var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;

      function isValidElementType(type) {
        return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
        type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE);
      }
      /**
       * Forked from fbjs/warning:
       * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
       *
       * Only change is we use console.warn instead of console.error,
       * and do nothing when 'console' is not supported.
       * This really simplifies the code.
       * ---
       * Similar to invariant but only logs a warning if the condition is not met.
       * This can be used to log issues in development environments in critical
       * paths. Removing the logging code for production environments will keep the
       * same logic and follow the same code paths.
       */


      var lowPriorityWarning = function lowPriorityWarning() {};

      {
        var printWarning = function printWarning(format) {
          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          var argIndex = 0;
          var message = 'Warning: ' + format.replace(/%s/g, function () {
            return args[argIndex++];
          });

          if (typeof console !== 'undefined') {
            console.warn(message);
          }

          try {
            // --- Welcome to debugging React ---
            // This error was thrown as a convenience so that you can use this stack
            // to find the callsite that caused this warning to fire.
            throw new Error(message);
          } catch (x) {}
        };

        lowPriorityWarning = function lowPriorityWarning(condition, format) {
          if (format === undefined) {
            throw new Error('`lowPriorityWarning(condition, format, ...args)` requires a warning ' + 'message argument');
          }

          if (!condition) {
            for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
              args[_key2 - 2] = arguments[_key2];
            }

            printWarning.apply(undefined, [format].concat(args));
          }
        };
      }
      var lowPriorityWarning$1 = lowPriorityWarning;

      function typeOf(object) {
        if (typeof object === 'object' && object !== null) {
          var $$typeof = object.$$typeof;

          switch ($$typeof) {
            case REACT_ELEMENT_TYPE:
              var type = object.type;

              switch (type) {
                case REACT_ASYNC_MODE_TYPE:
                case REACT_CONCURRENT_MODE_TYPE:
                case REACT_FRAGMENT_TYPE:
                case REACT_PROFILER_TYPE:
                case REACT_STRICT_MODE_TYPE:
                case REACT_SUSPENSE_TYPE:
                  return type;

                default:
                  var $$typeofType = type && type.$$typeof;

                  switch ($$typeofType) {
                    case REACT_CONTEXT_TYPE:
                    case REACT_FORWARD_REF_TYPE:
                    case REACT_PROVIDER_TYPE:
                      return $$typeofType;

                    default:
                      return $$typeof;
                  }

              }

            case REACT_LAZY_TYPE:
            case REACT_MEMO_TYPE:
            case REACT_PORTAL_TYPE:
              return $$typeof;
          }
        }

        return undefined;
      } // AsyncMode is deprecated along with isAsyncMode


      var AsyncMode = REACT_ASYNC_MODE_TYPE;
      var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
      var ContextConsumer = REACT_CONTEXT_TYPE;
      var ContextProvider = REACT_PROVIDER_TYPE;
      var Element = REACT_ELEMENT_TYPE;
      var ForwardRef = REACT_FORWARD_REF_TYPE;
      var Fragment = REACT_FRAGMENT_TYPE;
      var Lazy = REACT_LAZY_TYPE;
      var Memo = REACT_MEMO_TYPE;
      var Portal = REACT_PORTAL_TYPE;
      var Profiler = REACT_PROFILER_TYPE;
      var StrictMode = REACT_STRICT_MODE_TYPE;
      var Suspense = REACT_SUSPENSE_TYPE;
      var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

      function isAsyncMode(object) {
        {
          if (!hasWarnedAboutDeprecatedIsAsyncMode) {
            hasWarnedAboutDeprecatedIsAsyncMode = true;
            lowPriorityWarning$1(false, 'The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
          }
        }
        return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
      }

      function isConcurrentMode(object) {
        return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
      }

      function isContextConsumer(object) {
        return typeOf(object) === REACT_CONTEXT_TYPE;
      }

      function isContextProvider(object) {
        return typeOf(object) === REACT_PROVIDER_TYPE;
      }

      function isElement(object) {
        return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
      }

      function isForwardRef(object) {
        return typeOf(object) === REACT_FORWARD_REF_TYPE;
      }

      function isFragment(object) {
        return typeOf(object) === REACT_FRAGMENT_TYPE;
      }

      function isLazy(object) {
        return typeOf(object) === REACT_LAZY_TYPE;
      }

      function isMemo(object) {
        return typeOf(object) === REACT_MEMO_TYPE;
      }

      function isPortal(object) {
        return typeOf(object) === REACT_PORTAL_TYPE;
      }

      function isProfiler(object) {
        return typeOf(object) === REACT_PROFILER_TYPE;
      }

      function isStrictMode(object) {
        return typeOf(object) === REACT_STRICT_MODE_TYPE;
      }

      function isSuspense(object) {
        return typeOf(object) === REACT_SUSPENSE_TYPE;
      }

      exports.typeOf = typeOf;
      exports.AsyncMode = AsyncMode;
      exports.ConcurrentMode = ConcurrentMode;
      exports.ContextConsumer = ContextConsumer;
      exports.ContextProvider = ContextProvider;
      exports.Element = Element;
      exports.ForwardRef = ForwardRef;
      exports.Fragment = Fragment;
      exports.Lazy = Lazy;
      exports.Memo = Memo;
      exports.Portal = Portal;
      exports.Profiler = Profiler;
      exports.StrictMode = StrictMode;
      exports.Suspense = Suspense;
      exports.isValidElementType = isValidElementType;
      exports.isAsyncMode = isAsyncMode;
      exports.isConcurrentMode = isConcurrentMode;
      exports.isContextConsumer = isContextConsumer;
      exports.isContextProvider = isContextProvider;
      exports.isElement = isElement;
      exports.isForwardRef = isForwardRef;
      exports.isFragment = isFragment;
      exports.isLazy = isLazy;
      exports.isMemo = isMemo;
      exports.isPortal = isPortal;
      exports.isProfiler = isProfiler;
      exports.isStrictMode = isStrictMode;
      exports.isSuspense = isSuspense;
    })();
  }
  });

  unwrapExports(reactIs_development);
  var reactIs_development_1 = reactIs_development.typeOf;
  var reactIs_development_2 = reactIs_development.AsyncMode;
  var reactIs_development_3 = reactIs_development.ConcurrentMode;
  var reactIs_development_4 = reactIs_development.ContextConsumer;
  var reactIs_development_5 = reactIs_development.ContextProvider;
  var reactIs_development_6 = reactIs_development.Element;
  var reactIs_development_7 = reactIs_development.ForwardRef;
  var reactIs_development_8 = reactIs_development.Fragment;
  var reactIs_development_9 = reactIs_development.Lazy;
  var reactIs_development_10 = reactIs_development.Memo;
  var reactIs_development_11 = reactIs_development.Portal;
  var reactIs_development_12 = reactIs_development.Profiler;
  var reactIs_development_13 = reactIs_development.StrictMode;
  var reactIs_development_14 = reactIs_development.Suspense;
  var reactIs_development_15 = reactIs_development.isValidElementType;
  var reactIs_development_16 = reactIs_development.isAsyncMode;
  var reactIs_development_17 = reactIs_development.isConcurrentMode;
  var reactIs_development_18 = reactIs_development.isContextConsumer;
  var reactIs_development_19 = reactIs_development.isContextProvider;
  var reactIs_development_20 = reactIs_development.isElement;
  var reactIs_development_21 = reactIs_development.isForwardRef;
  var reactIs_development_22 = reactIs_development.isFragment;
  var reactIs_development_23 = reactIs_development.isLazy;
  var reactIs_development_24 = reactIs_development.isMemo;
  var reactIs_development_25 = reactIs_development.isPortal;
  var reactIs_development_26 = reactIs_development.isProfiler;
  var reactIs_development_27 = reactIs_development.isStrictMode;
  var reactIs_development_28 = reactIs_development.isSuspense;

  var reactIs = createCommonjsModule(function (module) {

  {
    module.exports = reactIs_development;
  }
  });

  /**
   * Copyright 2015, Yahoo! Inc.
   * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
   */



  var REACT_STATICS = {
    childContextTypes: true,
    contextType: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    getDerivedStateFromError: true,
    getDerivedStateFromProps: true,
    mixins: true,
    propTypes: true,
    type: true
  };
  var KNOWN_STATICS = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    callee: true,
    arguments: true,
    arity: true
  };
  var FORWARD_REF_STATICS = {
    '$$typeof': true,
    render: true,
    defaultProps: true,
    displayName: true,
    propTypes: true
  };
  var TYPE_STATICS = {};
  TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
  var defineProperty = Object.defineProperty;
  var getOwnPropertyNames = Object.getOwnPropertyNames;
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var getPrototypeOf = Object.getPrototypeOf;
  var objectPrototype = Object.prototype;

  function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
    if (typeof sourceComponent !== 'string') {
      // don't hoist over string (html) components
      if (objectPrototype) {
        var inheritedComponent = getPrototypeOf(sourceComponent);

        if (inheritedComponent && inheritedComponent !== objectPrototype) {
          hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
        }
      }

      var keys = getOwnPropertyNames(sourceComponent);

      if (getOwnPropertySymbols) {
        keys = keys.concat(getOwnPropertySymbols(sourceComponent));
      }

      var targetStatics = TYPE_STATICS[targetComponent['$$typeof']] || REACT_STATICS;
      var sourceStatics = TYPE_STATICS[sourceComponent['$$typeof']] || REACT_STATICS;

      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];

        if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
          var descriptor = getOwnPropertyDescriptor(sourceComponent, key);

          try {
            // Avoid failures from read-only properties
            defineProperty(targetComponent, key, descriptor);
          } catch (e) {}
        }
      }

      return targetComponent;
    }

    return targetComponent;
  }

  var hoistNonReactStatics_cjs = hoistNonReactStatics;

  let defaultOptions = {
    wait: false,
    withRef: false,
    bindI18n: 'languageChanged loaded',
    bindStore: 'added removed',
    translateFuncName: 't',
    nsMode: 'default',
    usePureComponent: false,
    omitBoundRerender: true,
    transEmptyNodeValue: ''
  };
  let i18nInstance;
  function setDefaults() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    defaultOptions = _objectSpread({}, defaultOptions, options);
  }
  function getDefaults() {
    return defaultOptions;
  }
  function setI18n(instance) {
    i18nInstance = instance;
  }
  function getI18n() {
    return i18nInstance;
  }
  const reactI18nextModule = {
    type: '3rdParty',

    init(instance) {
      setDefaults(instance.options.react);
      setI18n(instance);
    }

  };
  const I18nContext = React__default.createContext(); // hoc for context

  function withContext() {
    return function Wrapper(WrappedComponent) {
      class WithContext extends React.Component {
        render() {
          const _this$props = this.props,
                innerRef = _this$props.innerRef,
                rest = _objectWithoutProperties(_this$props, ["innerRef"]);

          if (innerRef) rest.ref = innerRef;
          return React__default.createElement(I18nContext.Consumer, null, ctx => React__default.createElement(WrappedComponent, _objectSpread({}, ctx, rest)));
        }

      }

      return WithContext;
    };
  }

  function getDisplayName(component) {
    return component.displayName || component.name || 'Component';
  }
  /* eslint-disable react/no-multi-comp */


  function withI18n() {
    return function Wrapper(WrappedComponent) {
      class WithMergedOptions extends React.Component {
        render() {
          const _this$props2 = this.props,
                innerRef = _this$props2.innerRef,
                rest = _objectWithoutProperties(_this$props2, ["innerRef"]);

          if (innerRef) rest.ref = innerRef; // merged extra props

          const extraProps = {};
          let i18nOptions = this.props.i18nOptions || this.i18nOptions; // as default we add i18n, basic t function and i18nOptions from setI18n
          // those get overridden by values passed by I18nContext.Provider <- eg. set in I18nextProvider

          const i18n = this.props.i18n || getI18n();

          if (!i18nOptions) {
            const possibleI18nOptionsFromProps = Object.keys(defaultOptions).reduce((mem, k) => {
              if (this.props[k]) mem[k] = this.props[k];
              return mem;
            }, {});
            i18nOptions = _objectSpread({}, getDefaults(), i18n && i18n.options && i18n.options.react, possibleI18nOptionsFromProps);
            this.i18nOptions = i18nOptions;
          }

          if (i18n) {
            extraProps.i18n = i18n;
            extraProps.t = i18n.t.bind(i18n);
            extraProps.lng = i18n.language;
            extraProps.i18nOptions = i18nOptions;
          }

          return React__default.createElement(WrappedComponent, _objectSpread({}, extraProps, rest));
        }

      }

      const WithMergedOptionsWithContext = withContext()(WithMergedOptions);
      WithMergedOptionsWithContext.WrappedComponent = WrappedComponent;
      WithMergedOptionsWithContext.displayName = `WithMergedOptions(${getDisplayName(WrappedComponent)})`;
      return hoistNonReactStatics_cjs(WithMergedOptionsWithContext, WrappedComponent);
    };
  }

  let removedIsInitialSSR = false;
  class NamespacesConsumerComponent extends React.Component {
    constructor(props) {
      super(props);

      if (!props.i18n) {
        this.state = {
          i18nLoadedAt: null,
          ready: false
        };
        return warnOnce('You will need pass in an i18next instance either by props, using I18nextProvider or by using i18nextReactModule. Learn more https://react.i18next.com/components/overview#getting-the-i-18-n-function-into-the-flow');
      }

      if (typeof props.i18n.then === 'function') {
        this.state = {
          i18nLoadedAt: null,
          ready: false
        };
        return warnOnce('Detected a promise instead of an i18next instance. Probably you passed the return value of the i18next.init() function, this is not possible anymore with v13 of i18next. Just pass in the i18next instance directly.');
      } // nextjs / SSR: getting data from next.js or other ssr stack


      initSSR(props); // provider SSR: data was set in provider and ssr flag was set

      if (props.i18n.options && props.i18n.options.isInitialSSR) {
        props.i18nOptions.wait = false;
      } // reportNS if needed for SSR


      const namespaces = this.getNamespaces();

      if (props.reportNS) {
        namespaces.forEach(props.reportNS);
      } // check if we could flag this ready already as all is loaded


      const language = props.i18n.languages && props.i18n.languages[0];
      const ready = !!language && namespaces.every(ns => props.i18n.hasResourceBundle(language, ns));
      this.state = {
        i18nLoadedAt: null,
        ready
      };
      this.t = this.getI18nTranslate();
      this.onI18nChanged = this.onI18nChanged.bind(this);
      this.getI18nTranslate = this.getI18nTranslate.bind(this);
      this.namespaces = this.getNamespaces.bind(this);
    }

    componentDidMount() {
      this.loadNamespaces();
    }

    componentDidUpdate(prevProps) {
      // Note that dynamically loading additional namespaces after the initial mount will not block rendering – even if the `wait` option is true.
      if (this.props.ns && prevProps.ns !== this.props.ns) this.loadNamespaces();
    }

    componentWillUnmount() {
      const _this$props = this.props,
            i18n = _this$props.i18n,
            i18nOptions = _this$props.i18nOptions;
      this.mounted = false;

      if (this.onI18nChanged) {
        if (i18nOptions.bindI18n) {
          const p = i18nOptions.bindI18n.split(' ');
          p.forEach(f => i18n.off(f, this.onI18nChanged));
        }

        if (i18nOptions.bindStore) {
          const p = i18nOptions.bindStore.split(' ');
          p.forEach(f => i18n.store && i18n.store.off(f, this.onI18nChanged));
        }
      }
    }

    onI18nChanged() {
      const i18nOptions = this.props.i18nOptions;
      const ready = this.state.ready;
      if (!this.mounted) return;
      if (!ready && i18nOptions.omitBoundRerender) return;
      this.t = this.getI18nTranslate();
      this.setState({
        i18nLoadedAt: new Date()
      }); // rerender
    }

    getI18nTranslate() {
      const _this$props2 = this.props,
            i18n = _this$props2.i18n,
            i18nOptions = _this$props2.i18nOptions;
      const namespaces = this.getNamespaces();
      return i18n.getFixedT(null, i18nOptions.nsMode === 'fallback' ? namespaces : namespaces && namespaces.length ? namespaces[0] : 'translation');
    }

    getNamespaces() {
      const _this$props3 = this.props,
            i18n = _this$props3.i18n,
            ns = _this$props3.ns,
            defaultNS = _this$props3.defaultNS;
      const namespaces = typeof ns === 'function' ? ns(this.props) : ns || defaultNS || i18n.options && i18n.options.defaultNS;
      return typeof namespaces === 'string' ? [namespaces] : namespaces || [];
    }

    loadNamespaces() {
      const _this$props4 = this.props,
            i18n = _this$props4.i18n,
            i18nOptions = _this$props4.i18nOptions;
      const ready = this.state.ready;

      const bind = () => {
        if (i18nOptions.bindI18n && i18n) i18n.on(i18nOptions.bindI18n, this.onI18nChanged);
        if (i18nOptions.bindStore && i18n.store) i18n.store.on(i18nOptions.bindStore, this.onI18nChanged);
      };

      this.mounted = true;
      i18n.loadNamespaces(this.getNamespaces(), () => {
        const handleReady = () => {
          if (this.mounted && !ready) {
            this.setState({
              ready: true
            }, () => {
              if (!i18nOptions.wait) this.onI18nChanged();
            });
          }

          if (i18nOptions.wait && this.mounted) bind();
        };

        if (i18n.isInitialized) {
          handleReady();
        } else {
          const initialized = () => {
            // due to emitter removing issue in i18next we need to delay remove
            setTimeout(() => {
              i18n.off('initialized', initialized);
            }, 1000);
            handleReady();
          };

          i18n.on('initialized', initialized);
        }
      });
      if (!i18nOptions.wait) bind();
    }

    render() {
      const _this$props5 = this.props,
            children = _this$props5.children,
            i18n = _this$props5.i18n,
            defaultNS = _this$props5.defaultNS,
            reportNS = _this$props5.reportNS,
            i18nOptions = _this$props5.i18nOptions;

      const _ref = this.state || {
        ready: false
      },
            ready = _ref.ready; // fallback if state is null...unknown edge case https://github.com/i18next/react-i18next/issues/615


      const t = this.t;
      if (!ready && i18nOptions.wait) return null; // remove ssr flag set by provider - first render was done from now on wait if set to wait

      if (i18n.options && i18n.options.isInitialSSR && !removedIsInitialSSR) {
        removedIsInitialSSR = true;
        setTimeout(() => {
          delete i18n.options.isInitialSSR;
        }, 100);
      }

      return React__default.createElement(I18nContext.Provider, {
        value: {
          i18n,
          t,
          defaultNS,
          reportNS,
          lng: i18n && i18n.language
        }
      }, children(this.t, {
        i18n,
        t,
        lng: i18n.language,
        ready
      }));
    }

  }
  const NamespacesConsumer = withI18n()(NamespacesConsumerComponent);
  const I18n = NamespacesConsumer;

  function getDisplayName$1(component) {
    return component.displayName || component.name || 'Component';
  }

  function withNamespaces(namespaceArg) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return function Wrapper(WrappedComponent) {
      class LoadNamespace extends React.Component {
        shouldComponentUpdate(nextProps) {
          const i18nOptions = this.props.i18nOptions;

          if (!i18nOptions.usePureComponent && !options.usePureComponent) {
            return true;
          }

          return !shallowEqual(this.props, nextProps);
        }

        render() {
          const _this$props = this.props,
                namespaces = _this$props.namespaces,
                i18nOptions = _this$props.i18nOptions;

          const mergedI18nOptions = _objectSpread({}, i18nOptions, options);

          const extraProps = {};

          if (mergedI18nOptions.innerRef) {
            extraProps.ref = mergedI18nOptions.innerRef;
          }

          return React__default.createElement(NamespacesConsumer, _objectSpread({
            ns: namespaces || namespaceArg
          }, this.props, {
            i18nOptions: Object.keys(mergedI18nOptions).length > 0 ? mergedI18nOptions : null
          }), (t, _ref) => {
            let ready = _ref.ready,
                rest = _objectWithoutProperties(_ref, ["ready"]);

            return React__default.createElement(WrappedComponent, _objectSpread({
              tReady: ready
            }, this.props, extraProps, rest));
          });
        }

      }

      const LoadNamespaceWithContext = withI18n()(LoadNamespace);
      LoadNamespaceWithContext.WrappedComponent = WrappedComponent;
      LoadNamespaceWithContext.displayName = `LoadNamespace(${getDisplayName$1(WrappedComponent)})`;
      LoadNamespaceWithContext.namespaces = namespaceArg;
      return hoistNonReactStatics_cjs(LoadNamespaceWithContext, WrappedComponent);
    };
  }
  withNamespaces.setDefaults = setDefaults;
  withNamespaces.setI18n = setI18n;
  const translate = withNamespaces;

  /**
   * This file automatically generated from `pre-publish.js`.
   * Do not manually edit.
   */
  var voidElements = {
    "area": true,
    "base": true,
    "br": true,
    "col": true,
    "embed": true,
    "hr": true,
    "img": true,
    "input": true,
    "keygen": true,
    "link": true,
    "menuitem": true,
    "meta": true,
    "param": true,
    "source": true,
    "track": true,
    "wbr": true
  };

  var attrRE = /([\w-]+)|=|(['"])([.\s\S]*?)\2/g;



  var parseTag = function (tag) {
    var i = 0;
    var key;
    var expectingValueAfterEquals = true;
    var res = {
      type: 'tag',
      name: '',
      voidElement: false,
      attrs: {},
      children: []
    };
    tag.replace(attrRE, function (match) {
      if (match === '=') {
        expectingValueAfterEquals = true;
        i++;
        return;
      }

      if (!expectingValueAfterEquals) {
        if (key) {
          res.attrs[key] = key; // boolean attribute
        }

        key = match;
      } else {
        if (i === 0) {
          if (voidElements[match] || tag.charAt(tag.length - 2) === '/') {
            res.voidElement = true;
          }

          res.name = match;
        } else {
          res.attrs[key] = match.replace(/^['"]|['"]$/g, '');
          key = undefined;
        }
      }

      i++;
      expectingValueAfterEquals = false;
    });
    return res;
  };

  /*jshint -W030 */
  var tagRE = /(?:<!--[\S\s]*?-->|<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>)/g;

   // re-used obj for quick lookups of components


  var empty = Object.create ? Object.create(null) : {}; // common logic for pushing a child node onto a list

  function pushTextNode(list, html, level, start, ignoreWhitespace) {
    // calculate correct end of the content slice in case there's
    // no tag after the text node.
    var end = html.indexOf('<', start);
    var content = html.slice(start, end === -1 ? undefined : end); // if a node is nothing but whitespace, collapse it as the spec states:
    // https://www.w3.org/TR/html4/struct/text.html#h-9.1

    if (/^\s*$/.test(content)) {
      content = ' ';
    } // don't add whitespace-only text nodes if they would be trailing text nodes
    // or if they would be leading whitespace-only text nodes:
    //  * end > -1 indicates this is not a trailing text node
    //  * leading node is when level is -1 and list has length 0


    if (!ignoreWhitespace && end > -1 && level + list.length >= 0 || content !== ' ') {
      list.push({
        type: 'text',
        content: content
      });
    }
  }

  var parse = function parse(html, options) {
    options || (options = {});
    options.components || (options.components = empty);
    var result = [];
    var current;
    var level = -1;
    var arr = [];
    var byTag = {};
    var inComponent = false;
    html.replace(tagRE, function (tag, index) {
      if (inComponent) {
        if (tag !== '</' + current.name + '>') {
          return;
        } else {
          inComponent = false;
        }
      }

      var isOpen = tag.charAt(1) !== '/';
      var isComment = tag.indexOf('<!--') === 0;
      var start = index + tag.length;
      var nextChar = html.charAt(start);
      var parent;

      if (isOpen && !isComment) {
        level++;
        current = parseTag(tag);

        if (current.type === 'tag' && options.components[current.name]) {
          current.type = 'component';
          inComponent = true;
        }

        if (!current.voidElement && !inComponent && nextChar && nextChar !== '<') {
          pushTextNode(current.children, html, level, start, options.ignoreWhitespace);
        }

        byTag[current.tagName] = current; // if we're at root, push new base node

        if (level === 0) {
          result.push(current);
        }

        parent = arr[level - 1];

        if (parent) {
          parent.children.push(current);
        }

        arr[level] = current;
      }

      if (isComment || !isOpen || current.voidElement) {
        if (!isComment) {
          level--;
        }

        if (!inComponent && nextChar !== '<' && nextChar) {
          // trailing text node
          // if we're at the root, push a base text node. otherwise add as
          // a child to the current node.
          parent = level === -1 ? result : arr[level].children;
          pushTextNode(parent, html, level, start, options.ignoreWhitespace);
        }
      }
    }); // If the "html" passed isn't actually html, add it as a text node.

    if (!result.length && html.length) {
      pushTextNode(result, html, 0, 0, options.ignoreWhitespace);
    }

    return result;
  };

  function attrString(attrs) {
    var buff = [];

    for (var key in attrs) {
      buff.push(key + '="' + attrs[key] + '"');
    }

    if (!buff.length) {
      return '';
    }

    return ' ' + buff.join(' ');
  }

  function stringify(buff, doc) {
    switch (doc.type) {
      case 'text':
        return buff + doc.content;

      case 'tag':
        buff += '<' + doc.name + (doc.attrs ? attrString(doc.attrs) : '') + (doc.voidElement ? '/>' : '>');

        if (doc.voidElement) {
          return buff;
        }

        return buff + doc.children.reduce(stringify, '') + '</' + doc.name + '>';
    }
  }

  var stringify_1 = function (doc) {
    return doc.reduce(function (token, rootEl) {
      return token + stringify('', rootEl);
    }, '');
  };

  var htmlParseStringify2 = {
    parse: parse,
    stringify: stringify_1
  };

  function hasChildren(node) {
    return node && (node.children || node.props && node.props.children);
  }

  function getChildren(node) {
    return node && node.children ? node.children : node.props && node.props.children;
  }

  function nodesToString(mem, children, index) {
    if (!children) return '';
    if (Object.prototype.toString.call(children) !== '[object Array]') children = [children];
    children.forEach((child, i) => {
      // const isElement = React.isValidElement(child);
      // const elementKey = `${index !== 0 ? index + '-' : ''}${i}:${typeof child.type === 'function' ? child.type.name : child.type || 'var'}`;
      const elementKey = `${i}`;

      if (typeof child === 'string') {
        mem = `${mem}${child}`;
      } else if (hasChildren(child)) {
        mem = `${mem}<${elementKey}>${nodesToString('', getChildren(child), i + 1)}</${elementKey}>`;
      } else if (React__default.isValidElement(child)) {
        mem = `${mem}<${elementKey}></${elementKey}>`;
      } else if (typeof child === 'object') {
        const clone = _objectSpread({}, child);

        const format = clone.format;
        delete clone.format;
        const keys = Object.keys(clone);

        if (format && keys.length === 1) {
          mem = `${mem}{{${keys[0]}, ${format}}}`;
        } else if (keys.length === 1) {
          mem = `${mem}{{${keys[0]}}}`;
        } else {
          // not a valid interpolation object (can only contain one value plus format)
          warn(`react-i18next: the passed in object contained more than one variable - the object should look like {{ value, format }} where format is optional.`, child);
        }
      } else {
        warn(`Trans: the passed in value is invalid - seems you passed in a variable like {number} - please pass in variables for interpolation as full objects like {{number}}.`, child);
      }
    });
    return mem;
  }

  function renderNodes(children, targetString, i18n) {
    if (targetString === '') return [];
    if (!children) return [targetString]; // v2 -> interpolates upfront no need for "some <0>{{var}}</0>"" -> will be just "some {{var}}" in translation file

    const data = {};

    function getData(childs) {
      if (Object.prototype.toString.call(childs) !== '[object Array]') childs = [childs];
      childs.forEach(child => {
        if (typeof child === 'string') return;
        if (hasChildren(child)) getData(getChildren(child));else if (typeof child === 'object' && !React__default.isValidElement(child)) Object.assign(data, child);
      });
    }

    getData(children);
    targetString = i18n.services.interpolator.interpolate(targetString, data, i18n.language); // parse ast from string with additional wrapper tag
    // -> avoids issues in parser removing prepending text nodes

    const ast = htmlParseStringify2.parse(`<0>${targetString}</0>`);

    function mapAST(reactNodes, astNodes) {
      if (Object.prototype.toString.call(reactNodes) !== '[object Array]') reactNodes = [reactNodes];
      if (Object.prototype.toString.call(astNodes) !== '[object Array]') astNodes = [astNodes];
      return astNodes.reduce((mem, node, i) => {
        if (node.type === 'tag') {
          const child = reactNodes[parseInt(node.name, 10)] || {};
          const isElement = React__default.isValidElement(child);

          if (typeof child === 'string') {
            mem.push(child);
          } else if (hasChildren(child)) {
            const inner = mapAST(getChildren(child), node.children);
            if (child.dummy) child.children = inner; // needed on preact!

            mem.push(React__default.cloneElement(child, _objectSpread({}, child.props, {
              key: i
            }), inner));
          } else if (typeof child === 'object' && !isElement) {
            const content = node.children[0] ? node.children[0].content : null; // v1
            // as interpolation was done already we just have a regular content node
            // in the translation AST while having an object in reactNodes
            // -> push the content no need to interpolate again

            if (content) mem.push(content);
          } else {
            mem.push(child);
          }
        } else if (node.type === 'text') {
          mem.push(node.content);
        }

        return mem;
      }, []);
    } // call mapAST with having react nodes nested into additional node like
    // we did for the string ast from translation
    // return the children of that extra node to get expected result


    const result = mapAST([{
      dummy: true,
      children
    }], ast);
    return getChildren(result[0]);
  }

  class TransComponent extends React__default.Component {
    render() {
      const _this$props = this.props,
            children = _this$props.children,
            count = _this$props.count,
            parent = _this$props.parent,
            i18nKey = _this$props.i18nKey,
            tOptions = _this$props.tOptions,
            values = _this$props.values,
            defaults = _this$props.defaults,
            components = _this$props.components,
            namespace = _this$props.ns,
            i18n = _this$props.i18n,
            tFromContextAndProps = _this$props.t,
            defaultNS = _this$props.defaultNS,
            reportNS = _this$props.reportNS,
            lng = _this$props.lng,
            i18nOptions = _this$props.i18nOptions,
            additionalProps = _objectWithoutProperties(_this$props, ["children", "count", "parent", "i18nKey", "tOptions", "values", "defaults", "components", "ns", "i18n", "t", "defaultNS", "reportNS", "lng", "i18nOptions"]);

      const t = tFromContextAndProps || i18n.t.bind(i18n);
      const reactI18nextOptions = i18n.options && i18n.options.react || {};
      const useAsParent = parent !== undefined ? parent : reactI18nextOptions.defaultTransParent;
      const defaultValue = defaults || nodesToString('', children, 0) || reactI18nextOptions.transEmptyNodeValue;
      const hashTransKey = reactI18nextOptions.hashTransKey;
      const key = i18nKey || (hashTransKey ? hashTransKey(defaultValue) : defaultValue);
      const interpolationOverride = values ? {} : {
        interpolation: {
          prefix: '#$?',
          suffix: '?$#'
        }
      };
      const translation = key ? t(key, _objectSpread({}, tOptions, values, interpolationOverride, {
        defaultValue,
        count,
        ns: namespace
      })) : defaultValue;

      if (reactI18nextOptions.exposeNamespace) {
        let ns = typeof t.ns === 'string' ? t.ns : t.ns[0];

        if (i18nKey && i18n.options && i18n.options.nsSeparator && i18nKey.indexOf(i18n.options.nsSeparator) > -1) {
          const parts = i18nKey.split(i18n.options.nsSeparator);
          ns = parts[0];
        }

        if (t.ns) additionalProps['data-i18next-options'] = JSON.stringify({
          ns
        });
      }

      if (!useAsParent) return renderNodes(components || children, translation, i18n);
      return React__default.createElement(useAsParent, additionalProps, renderNodes(components || children, translation, i18n));
    }

  }
  const Trans = withI18n()(TransComponent);

  class I18nextProvider extends React.Component {
    constructor(props) {
      super(props); // nextjs / SSR: getting data from next.js or other ssr stack

      initSSR(props, true);
    }

    render() {
      const _this$props = this.props,
            children = _this$props.children,
            i18n = _this$props.i18n,
            defaultNS = _this$props.defaultNS,
            reportNS = _this$props.reportNS;
      return React__default.createElement(I18nContext.Provider, {
        value: {
          i18n,
          defaultNS,
          reportNS,
          lng: i18n && i18n.language,
          t: i18n && i18n.t.bind(i18n)
        }
      }, children);
    }

  }

  class InterpolateComponent extends React.Component {
    constructor(props) {
      super(props);
      deprecated('Interpolate is deprecated and will be removed in the next major version (v9.0.0). Usage can be replaced by the "Trans" component');
    }

    render() {
      const _this$props = this.props,
            i18n = _this$props.i18n,
            t = _this$props.t,
            i18nKey = _this$props.i18nKey,
            options = _this$props.options,
            className = _this$props.className,
            style = _this$props.style;
      const parent = this.props.parent || 'span';
      const REGEXP = this.props.regexp || i18n.services.interpolator.regexp; // Set to true if you want to use raw HTML in translation values
      // See https://github.com/i18next/react-i18next/issues/189

      const useDangerouslySetInnerHTML = this.props.useDangerouslySetInnerHTML || false;
      const dangerouslySetInnerHTMLPartElement = this.props.dangerouslySetInnerHTMLPartElement || 'span';

      const tOpts = _objectSpread({}, {}, options, {
        interpolation: {
          prefix: '#$?',
          suffix: '?$#'
        }
      });

      const format = t(i18nKey, tOpts);
      if (!format || typeof format !== 'string') return React__default.createElement('noscript', null);
      const children = [];

      const handleFormat = (key, props) => {
        if (key.indexOf(i18n.options.interpolation.formatSeparator) < 0) {
          if (props[key] === undefined) i18n.services.logger.warn(`interpolator: missed to pass in variable ${key} for interpolating ${format}`);
          return props[key];
        }

        const p = key.split(i18n.options.interpolation.formatSeparator);
        const k = p.shift().trim();
        const f = p.join(i18n.options.interpolation.formatSeparator).trim();
        if (props[k] === undefined) i18n.services.logger.warn(`interpolator: missed to pass in variable ${k} for interpolating ${format}`);
        return i18n.options.interpolation.format(props[k], f, i18n.language);
      };

      format.split(REGEXP).reduce((memo, match, index) => {
        let child;

        if (index % 2 === 0) {
          if (match.length === 0) return memo;

          if (useDangerouslySetInnerHTML) {
            child = React__default.createElement(dangerouslySetInnerHTMLPartElement, {
              dangerouslySetInnerHTML: {
                __html: match
              }
            });
          } else {
            child = match;
          }
        } else {
          child = handleFormat(match, this.props);
        }

        memo.push(child);
        return memo;
      }, children);
      const additionalProps = {};

      if (i18n.options.react && i18n.options.react.exposeNamespace) {
        let ns = typeof t.ns === 'string' ? t.ns : t.ns[0];

        if (i18nKey && i18n.options.nsSeparator && i18nKey.indexOf(i18n.options.nsSeparator) > -1) {
          const parts = i18nKey.split(i18n.options.nsSeparator);
          ns = parts[0];
        }

        if (t.ns) additionalProps['data-i18next-options'] = JSON.stringify({
          ns
        });
      }

      if (className) additionalProps.className = className;
      if (style) additionalProps.style = style;
      return React__default.createElement.apply(this, [parent, additionalProps].concat(children));
    }

  }
  const Interpolate = withI18n()(InterpolateComponent);

  exports.loadNamespaces = loadNamespaces;
  exports.withNamespaces = withNamespaces;
  exports.translate = translate;
  exports.NamespacesConsumer = NamespacesConsumer;
  exports.I18n = I18n;
  exports.Trans = Trans;
  exports.I18nextProvider = I18nextProvider;
  exports.withI18n = withI18n;
  exports.I18nContext = I18nContext;
  exports.reactI18nextModule = reactI18nextModule;
  exports.setDefaults = setDefaults;
  exports.getDefaults = getDefaults;
  exports.setI18n = setI18n;
  exports.getI18n = getI18n;
  exports.Interpolate = Interpolate;

  Object.defineProperty(exports, '__esModule', { value: true });

}));

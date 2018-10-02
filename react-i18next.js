(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (factory((global['react-i18next'] = {}),global.React));
}(this, (function (exports,React) { 'use strict';

  var React__default = 'default' in React ? React['default'] : React;

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

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

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
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

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
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

      if (typeof args[0] === 'string') args[0] = "react-i18next:: ".concat(args[0]);
      console.warn.apply(null, args);
    }
  }
  var alreadyWarned = {};
  function warnOnce() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (typeof args[0] === 'string' && alreadyWarned[args[0]]) return;
    if (typeof args[0] === 'string') alreadyWarned[args[0]] = new Date();
    warn.apply(void 0, args);
  }
  function deprecated() {
    if (process && process.env && (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')) {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      if (typeof args[0] === 'string') args[0] = "deprecation warning -> ".concat(args[0]);
      warnOnce.apply(void 0, args);
    }
  }
  function initSSR(props) {
    // nextjs / SSR: getting data from next.js or other ssr stack
    if (props.initialI18nStore) {
      props.i18n.services.resourceStore.data = props.initialI18nStore;
      props.i18nOptions.wait = false; // we got all passed down already
    }

    if (props.initialLanguage) {
      props.i18n.changeLanguage(props.initialLanguage);
    }
  } // --------------
  // loadNamespaces

  var objectEntries = Object.entries || function (obj) {
    var ownProps = Object.keys(obj);
    var i = ownProps.length;
    var resArray = new Array(i); // preallocate the Array

    while (i--) {
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    }

    return resArray;
  }; // Borrowed from https://github.com/Rezonans/redux-async-connect/blob/master/modules/ReduxAsyncConnect.js#L16


  function eachComponents(components, iterator) {
    for (var i = 0, l = components.length; i < l; i++) {
      // eslint-disable-line id-length
      if (_typeof(components[i]) === 'object') {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = objectEntries(components[i])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2),
                key = _step$value[0],
                value = _step$value[1];

            iterator(value, i, key);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      } else {
        iterator(components[i], i);
      }
    }
  }

  function filterAndFlattenComponents(components) {
    var flattened = [];
    eachComponents(components, function (Component) {
      if (Component && Component.namespaces) {
        Component.namespaces.forEach(function (namespace) {
          if (flattened.indexOf(namespace) === -1) {
            flattened.push(namespace);
          }
        });
      }
    });
    return flattened;
  }

  function loadNamespaces(_ref) {
    var components = _ref.components,
        i18n = _ref.i18n;
    var allNamespaces = filterAndFlattenComponents(components);
    return new Promise(function (resolve) {
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

  var hasOwnProperty = Object.prototype.hasOwnProperty;
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

    if (_typeof(objA) !== 'object' || objA === null || _typeof(objB) !== 'object' || objB === null) {
      return false;
    }

    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
      return false;
    } // Test for A's keys different from B.


    for (var i = 0; i < keysA.length; i++) {
      if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
        return false;
      }
    }

    return true;
  }

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  /** @license React v16.5.2
   * react-is.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  var b = "function" === typeof Symbol && Symbol.for,
      c = b ? Symbol.for("react.element") : 60103,
      d = b ? Symbol.for("react.portal") : 60106,
      e = b ? Symbol.for("react.fragment") : 60107,
      f = b ? Symbol.for("react.strict_mode") : 60108,
      g = b ? Symbol.for("react.profiler") : 60114,
      h = b ? Symbol.for("react.provider") : 60109,
      k = b ? Symbol.for("react.context") : 60110,
      l = b ? Symbol.for("react.async_mode") : 60111,
      m = b ? Symbol.for("react.forward_ref") : 60112,
      n = b ? Symbol.for("react.placeholder") : 60113;

  function q(a) {
    if ("object" === _typeof(a) && null !== a) {
      var p = a.$$typeof;

      switch (p) {
        case c:
          switch (a = a.type, a) {
            case l:
            case e:
            case g:
            case f:
              return a;

            default:
              switch (a = a && a.$$typeof, a) {
                case k:
                case m:
                case h:
                  return a;

                default:
                  return p;
              }

          }

        case d:
          return p;
      }
    }
  }

  exports.typeOf = q;
  exports.AsyncMode = l;
  exports.ContextConsumer = k;
  exports.ContextProvider = h;
  exports.Element = c;
  exports.ForwardRef = m;
  exports.Fragment = e;
  exports.Profiler = g;
  exports.Portal = d;
  exports.StrictMode = f;

  exports.isValidElementType = function (a) {
    return "string" === typeof a || "function" === typeof a || a === e || a === l || a === g || a === f || a === n || "object" === _typeof(a) && null !== a && ("function" === typeof a.then || a.$$typeof === h || a.$$typeof === k || a.$$typeof === m);
  };

  exports.isAsyncMode = function (a) {
    return q(a) === l;
  };

  exports.isContextConsumer = function (a) {
    return q(a) === k;
  };

  exports.isContextProvider = function (a) {
    return q(a) === h;
  };

  exports.isElement = function (a) {
    return "object" === _typeof(a) && null !== a && a.$$typeof === c;
  };

  exports.isForwardRef = function (a) {
    return q(a) === m;
  };

  exports.isFragment = function (a) {
    return q(a) === e;
  };

  exports.isProfiler = function (a) {
    return q(a) === g;
  };

  exports.isPortal = function (a) {
    return q(a) === d;
  };

  exports.isStrictMode = function (a) {
    return q(a) === f;
  };

  var reactIs_production_min = /*#__PURE__*/Object.freeze({

  });

  /** @license React v16.5.2
   * react-is.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  if (process.env.NODE_ENV !== "production") {
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
      var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
      var REACT_PLACEHOLDER_TYPE = hasSymbol ? Symbol.for('react.placeholder') : 0xead1;

      function isValidElementType(type) {
        return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
        type === REACT_FRAGMENT_TYPE || type === REACT_ASYNC_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_PLACEHOLDER_TYPE || _typeof(type) === 'object' && type !== null && (typeof type.then === 'function' || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE);
      }

      function typeOf(object) {
        if (_typeof(object) === 'object' && object !== null) {
          var $$typeof = object.$$typeof;

          switch ($$typeof) {
            case REACT_ELEMENT_TYPE:
              var type = object.type;

              switch (type) {
                case REACT_ASYNC_MODE_TYPE:
                case REACT_FRAGMENT_TYPE:
                case REACT_PROFILER_TYPE:
                case REACT_STRICT_MODE_TYPE:
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

            case REACT_PORTAL_TYPE:
              return $$typeof;
          }
        }

        return undefined;
      }

      var AsyncMode = REACT_ASYNC_MODE_TYPE;
      var ContextConsumer = REACT_CONTEXT_TYPE;
      var ContextProvider = REACT_PROVIDER_TYPE;
      var Element = REACT_ELEMENT_TYPE;
      var ForwardRef = REACT_FORWARD_REF_TYPE;
      var Fragment = REACT_FRAGMENT_TYPE;
      var Profiler = REACT_PROFILER_TYPE;
      var Portal = REACT_PORTAL_TYPE;
      var StrictMode = REACT_STRICT_MODE_TYPE;

      function isAsyncMode(object) {
        return typeOf(object) === REACT_ASYNC_MODE_TYPE;
      }

      function isContextConsumer(object) {
        return typeOf(object) === REACT_CONTEXT_TYPE;
      }

      function isContextProvider(object) {
        return typeOf(object) === REACT_PROVIDER_TYPE;
      }

      function isElement(object) {
        return _typeof(object) === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
      }

      function isForwardRef(object) {
        return typeOf(object) === REACT_FORWARD_REF_TYPE;
      }

      function isFragment(object) {
        return typeOf(object) === REACT_FRAGMENT_TYPE;
      }

      function isProfiler(object) {
        return typeOf(object) === REACT_PROFILER_TYPE;
      }

      function isPortal(object) {
        return typeOf(object) === REACT_PORTAL_TYPE;
      }

      function isStrictMode(object) {
        return typeOf(object) === REACT_STRICT_MODE_TYPE;
      }

      exports.typeOf = typeOf;
      exports.AsyncMode = AsyncMode;
      exports.ContextConsumer = ContextConsumer;
      exports.ContextProvider = ContextProvider;
      exports.Element = Element;
      exports.ForwardRef = ForwardRef;
      exports.Fragment = Fragment;
      exports.Profiler = Profiler;
      exports.Portal = Portal;
      exports.StrictMode = StrictMode;
      exports.isValidElementType = isValidElementType;
      exports.isAsyncMode = isAsyncMode;
      exports.isContextConsumer = isContextConsumer;
      exports.isContextProvider = isContextProvider;
      exports.isElement = isElement;
      exports.isForwardRef = isForwardRef;
      exports.isFragment = isFragment;
      exports.isProfiler = isProfiler;
      exports.isPortal = isPortal;
      exports.isStrictMode = isStrictMode;
    })();
  }

  var reactIs_development = /*#__PURE__*/Object.freeze({

  });

  var reactIs = createCommonjsModule(function (module) {

  if (process.env.NODE_ENV === 'production') {
    module.exports = reactIs_production_min;
  } else {
    module.exports = reactIs_development;
  }
  });

  var _ReactIs$ForwardRef;

  function _defineProperty$1(obj, key, value) {
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
  /**
   * Copyright 2015, Yahoo! Inc.
   * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
   */






  var REACT_STATICS = {
    childContextTypes: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
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

  var TYPE_STATICS = _defineProperty$1({}, reactIs.ForwardRef, (_ReactIs$ForwardRef = {}, _defineProperty$1(_ReactIs$ForwardRef, '$$typeof', true), _defineProperty$1(_ReactIs$ForwardRef, 'render', true), _ReactIs$ForwardRef));

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

  exports.__esModule = true;

  var _react = require('react');

  var _react2 = _interopRequireDefault$1(_react);

  var _propTypes = require('prop-types');

  var _propTypes2 = _interopRequireDefault$1(_propTypes);

  var _gud = require('gud');

  var _gud2 = _interopRequireDefault$1(_gud);

  var _warning = require('fbjs/lib/warning');

  var _warning2 = _interopRequireDefault$1(_warning);

  function _interopRequireDefault$1(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck$1(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn$1(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (_typeof(call) === "object" || typeof call === "function") ? call : self;
  }

  function _inherits$1(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + _typeof(superClass));
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var MAX_SIGNED_31_BIT_INT = 1073741823; // Inlined Object.is polyfill.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is

  function objectIs(x, y) {
    if (x === y) {
      return x !== 0 || 1 / x === 1 / y;
    } else {
      return x !== x && y !== y;
    }
  }

  function createEventEmitter(value) {
    var handlers = [];
    return {
      on: function on(handler) {
        handlers.push(handler);
      },
      off: function off(handler) {
        handlers = handlers.filter(function (h) {
          return h !== handler;
        });
      },
      get: function get() {
        return value;
      },
      set: function set(newValue, changedBits) {
        value = newValue;
        handlers.forEach(function (handler) {
          return handler(value, changedBits);
        });
      }
    };
  }

  function onlyChild(children) {
    return Array.isArray(children) ? children[0] : children;
  }

  function createReactContext(defaultValue, calculateChangedBits) {
    var _Provider$childContex, _Consumer$contextType;

    var contextProp = '__create-react-context-' + (0, _gud2.default)() + '__';

    var Provider = function (_Component) {
      _inherits$1(Provider, _Component);

      function Provider() {
        var _temp, _this, _ret;

        _classCallCheck$1(this, Provider);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn$1(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.emitter = createEventEmitter(_this.props.value), _temp), _possibleConstructorReturn$1(_this, _ret);
      }

      Provider.prototype.getChildContext = function getChildContext() {
        var _ref;

        return _ref = {}, _ref[contextProp] = this.emitter, _ref;
      };

      Provider.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
          var oldValue = this.props.value;
          var newValue = nextProps.value;
          var changedBits = void 0;

          if (objectIs(oldValue, newValue)) {
            changedBits = 0; // No change
          } else {
            changedBits = typeof calculateChangedBits === 'function' ? calculateChangedBits(oldValue, newValue) : MAX_SIGNED_31_BIT_INT;

            if (process.env.NODE_ENV !== 'production') {
              (0, _warning2.default)((changedBits & MAX_SIGNED_31_BIT_INT) === changedBits, 'calculateChangedBits: Expected the return value to be a ' + '31-bit integer. Instead received: %s', changedBits);
            }

            changedBits |= 0;

            if (changedBits !== 0) {
              this.emitter.set(nextProps.value, changedBits);
            }
          }
        }
      };

      Provider.prototype.render = function render() {
        return this.props.children;
      };

      return Provider;
    }(_react.Component);

    Provider.childContextTypes = (_Provider$childContex = {}, _Provider$childContex[contextProp] = _propTypes2.default.object.isRequired, _Provider$childContex);

    var Consumer = function (_Component2) {
      _inherits$1(Consumer, _Component2);

      function Consumer() {
        var _temp2, _this2, _ret2;

        _classCallCheck$1(this, Consumer);

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn$1(this, _Component2.call.apply(_Component2, [this].concat(args))), _this2), _this2.state = {
          value: _this2.getValue()
        }, _this2.onUpdate = function (newValue, changedBits) {
          var observedBits = _this2.observedBits | 0;

          if ((observedBits & changedBits) !== 0) {
            _this2.setState({
              value: _this2.getValue()
            });
          }
        }, _temp2), _possibleConstructorReturn$1(_this2, _ret2);
      }

      Consumer.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        var observedBits = nextProps.observedBits;
        this.observedBits = observedBits === undefined || observedBits === null ? MAX_SIGNED_31_BIT_INT // Subscribe to all changes by default
        : observedBits;
      };

      Consumer.prototype.componentDidMount = function componentDidMount() {
        if (this.context[contextProp]) {
          this.context[contextProp].on(this.onUpdate);
        }

        var observedBits = this.props.observedBits;
        this.observedBits = observedBits === undefined || observedBits === null ? MAX_SIGNED_31_BIT_INT // Subscribe to all changes by default
        : observedBits;
      };

      Consumer.prototype.componentWillUnmount = function componentWillUnmount() {
        if (this.context[contextProp]) {
          this.context[contextProp].off(this.onUpdate);
        }
      };

      Consumer.prototype.getValue = function getValue() {
        if (this.context[contextProp]) {
          return this.context[contextProp].get();
        } else {
          return defaultValue;
        }
      };

      Consumer.prototype.render = function render() {
        return onlyChild(this.props.children)(this.state.value);
      };

      return Consumer;
    }(_react.Component);

    Consumer.contextTypes = (_Consumer$contextType = {}, _Consumer$contextType[contextProp] = _propTypes2.default.object, _Consumer$contextType);
    return {
      Provider: Provider,
      Consumer: Consumer
    };
  }

  exports.default = createReactContext;
  module.exports = exports['default'];

  var implementation = /*#__PURE__*/Object.freeze({

  });

  var lib = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;



  var _react2 = _interopRequireDefault(React__default);



  var _implementation2 = _interopRequireDefault(implementation);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createContext || _implementation2.default;
  module.exports = exports['default'];
  });

  var createReactContext$1 = unwrapExports(lib);

  var defaultOptions = {
    wait: false,
    withRef: false,
    bindI18n: 'languageChanged loaded',
    bindStore: 'added removed',
    translateFuncName: 't',
    nsMode: 'default',
    usePureComponent: false,
    omitBoundRerender: true
  };
  var i18nInstance;
  function setDefaults(options) {
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
  var reactI18nextModule = {
    type: '3rdParty',
    init: function init(instance) {
      setDefaults(instance.options.react);
      setI18n(instance);
    }
  };
  var I18nContext = createReactContext$1(); // hoc for context

  function withContext() {
    return function Wrapper(WrappedComponent) {
      var WithContext =
      /*#__PURE__*/
      function (_Component) {
        _inherits(WithContext, _Component);

        function WithContext() {
          _classCallCheck(this, WithContext);

          return _possibleConstructorReturn(this, _getPrototypeOf(WithContext).apply(this, arguments));
        }

        _createClass(WithContext, [{
          key: "render",
          value: function render() {
            var _this = this;

            return React__default.createElement(I18nContext.Consumer, null, function (ctx) {
              return React__default.createElement(WrappedComponent, _objectSpread({}, ctx, _this.props));
            });
          }
        }]);

        return WithContext;
      }(React.Component);

      return WithContext;
    };
  }
  /* eslint-disable react/no-multi-comp */

  function withI18n() {
    return function Wrapper(WrappedComponent) {
      var WithMergedOptions =
      /*#__PURE__*/
      function (_Component2) {
        _inherits(WithMergedOptions, _Component2);

        function WithMergedOptions() {
          _classCallCheck(this, WithMergedOptions);

          return _possibleConstructorReturn(this, _getPrototypeOf(WithMergedOptions).apply(this, arguments));
        }

        _createClass(WithMergedOptions, [{
          key: "render",
          value: function render() {
            var _this2 = this;

            // merged extra props
            var extraProps = {};
            var i18nOptions = this.props.i18nOptions; // as default we add i18n, basic t function and i18nOptions from setI18n
            // those get overridden by values passed by I18nContext.Provider <- eg. set in I18nextProvider

            var i18n = this.props.i18n || getI18n();

            if (!i18nOptions) {
              var possibleI18nOptionsFromProps = Object.keys(defaultOptions).reduce(function (mem, k) {
                if (_this2.props[k]) mem[k] = _this2.props[k];
                return mem;
              }, {});
              i18nOptions = _objectSpread({}, getDefaults(), i18n && i18n.options && i18n.options.react, possibleI18nOptionsFromProps);
            }

            if (i18n) {
              extraProps.i18n = i18n;
              extraProps.t = i18n.t.bind(i18n);
              extraProps.lng = i18n.language;
              extraProps.i18nOptions = i18nOptions;
            }

            return React__default.createElement(WrappedComponent, _objectSpread({}, extraProps, this.props));
          }
        }]);

        return WithMergedOptions;
      }(React.Component);

      return withContext()(WithMergedOptions);
    };
  }

  var removedIsInitialSSR = false;
  var NamespacesConsumerComponent =
  /*#__PURE__*/
  function (_Component) {
    _inherits(NamespacesConsumerComponent, _Component);

    function NamespacesConsumerComponent(props) {
      var _this;

      _classCallCheck(this, NamespacesConsumerComponent);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(NamespacesConsumerComponent).call(this, props));

      if (!props.i18n) {
        return _possibleConstructorReturn(_this, warnOnce('You will need pass in an i18next instance either by props, using I18nextProvider or by using i18nextReactModule. Learn more https://react.i18next.com/components/overview#getting-the-i-18-n-function-into-the-flow'));
      } // nextjs / SSR: getting data from next.js or other ssr stack


      initSSR(props); // provider SSR: data was set in provider and ssr flag was set

      if (props.i18n.options && props.i18n.options.isInitialSSR) {
        props.i18nOptions.wait = false;
      } // reportNS if needed for SSR


      var namespaces = _this.getNamespaces();

      if (props.reportNS) {
        namespaces.forEach(props.reportNS);
      } // check if we could flag this ready already as all is loaded


      var language = props.i18n.languages && props.i18n.languages[0];
      var ready = !!language && namespaces.every(function (ns) {
        return props.i18n.hasResourceBundle(language, ns);
      });
      _this.state = {
        i18nLoadedAt: null,
        ready: ready
      };
      _this.t = _this.getI18nTranslate();
      _this.onI18nChanged = _this.onI18nChanged.bind(_assertThisInitialized(_assertThisInitialized(_this)));
      _this.getI18nTranslate = _this.getI18nTranslate.bind(_assertThisInitialized(_assertThisInitialized(_this)));
      _this.namespaces = _this.getNamespaces.bind(_assertThisInitialized(_assertThisInitialized(_this)));
      return _this;
    }

    _createClass(NamespacesConsumerComponent, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.loadNamespaces();
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        // Note that dynamically loading additional namespaces after the initial mount will not block rendering – even if the `wait` option is true.
        if (this.props.ns && prevProps.ns !== this.props.ns) this.loadNamespaces();
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        var _this2 = this;

        var _this$props = this.props,
            i18n = _this$props.i18n,
            i18nOptions = _this$props.i18nOptions;
        this.mounted = false;

        if (this.onI18nChanged) {
          if (i18nOptions.bindI18n) {
            var p = i18nOptions.bindI18n.split(' ');
            p.forEach(function (f) {
              return i18n.off(f, _this2.onI18nChanged);
            });
          }

          if (i18nOptions.bindStore) {
            var _p = i18nOptions.bindStore.split(' ');

            _p.forEach(function (f) {
              return i18n.store && i18n.store.off(f, _this2.onI18nChanged);
            });
          }
        }
      }
    }, {
      key: "onI18nChanged",
      value: function onI18nChanged() {
        var i18nOptions = this.props.i18nOptions;
        var ready = this.state.ready;
        if (!this.mounted) return;
        if (!ready && i18nOptions.omitBoundRerender) return;
        this.t = this.getI18nTranslate();
        this.setState({
          i18nLoadedAt: new Date()
        }); // rerender
      }
    }, {
      key: "getI18nTranslate",
      value: function getI18nTranslate() {
        var _this$props2 = this.props,
            i18n = _this$props2.i18n,
            i18nOptions = _this$props2.i18nOptions;
        var namespaces = this.getNamespaces();
        return i18n.getFixedT(null, i18nOptions.nsMode === 'fallback' ? namespaces : namespaces && namespaces.length ? namespaces[0] : 'translation');
      }
    }, {
      key: "getNamespaces",
      value: function getNamespaces() {
        var _this$props3 = this.props,
            i18n = _this$props3.i18n,
            ns = _this$props3.ns,
            defaultNS = _this$props3.defaultNS;
        var namespaces = typeof ns === 'function' ? ns(this.props) : ns || defaultNS || i18n.options && i18n.options.defaultNS;
        return typeof namespaces === 'string' ? [namespaces] : namespaces || [];
      }
    }, {
      key: "loadNamespaces",
      value: function loadNamespaces$$1() {
        var _this3 = this;

        var _this$props4 = this.props,
            i18n = _this$props4.i18n,
            i18nOptions = _this$props4.i18nOptions;
        var ready = this.state.ready;

        var bind = function bind() {
          if (i18nOptions.bindI18n && i18n) i18n.on(i18nOptions.bindI18n, _this3.onI18nChanged);
          if (i18nOptions.bindStore && i18n.store) i18n.store.on(i18nOptions.bindStore, _this3.onI18nChanged);
        };

        this.mounted = true;
        i18n.loadNamespaces(this.getNamespaces(), function () {
          var handleReady = function handleReady() {
            if (_this3.mounted && !ready) {
              _this3.setState({
                ready: true
              }, function () {
                if (!i18nOptions.wait) _this3.onI18nChanged();
              });
            }

            if (i18nOptions.wait && _this3.mounted) bind();
          };

          if (i18n.isInitialized) {
            handleReady();
          } else {
            var initialized = function initialized() {
              // due to emitter removing issue in i18next we need to delay remove
              setTimeout(function () {
                i18n.off('initialized', initialized);
              }, 1000);
              handleReady();
            };

            i18n.on('initialized', initialized);
          }
        });
        if (!i18nOptions.wait) bind();
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props5 = this.props,
            children = _this$props5.children,
            i18n = _this$props5.i18n,
            defaultNS = _this$props5.defaultNS,
            reportNS = _this$props5.reportNS,
            i18nOptions = _this$props5.i18nOptions;
        var ready = this.state.ready;
        var t = this.t;
        if (!ready && i18nOptions.wait) return null; // remove ssr flag set by provider - first render was done from now on wait if set to wait

        if (i18n.options && i18n.options.isInitialSSR && !removedIsInitialSSR) {
          removedIsInitialSSR = true;
          setTimeout(function () {
            delete i18n.options.isInitialSSR;
          }, 100);
        }

        return React__default.createElement(I18nContext.Provider, {
          value: {
            i18n: i18n,
            t: t,
            defaultNS: defaultNS,
            reportNS: reportNS,
            lng: i18n && i18n.language
          }
        }, children(this.t, {
          i18n: i18n,
          t: t,
          lng: i18n.language,
          ready: ready
        }));
      }
    }]);

    return NamespacesConsumerComponent;
  }(React.Component);
  var NamespacesConsumer = withI18n()(NamespacesConsumerComponent);
  function I18n(props) {
    deprecated('I18n was renamed to "NamespacesConsumer" to make it more clear what the render prop does.');
    return React__default.createElement(NamespacesConsumer, props);
  }

  function getDisplayName(component) {
    return component.displayName || component.name || 'Component';
  }

  function withNamespaces(namespaceArg) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return function Wrapper(WrappedComponent) {
      var LoadNamespace =
      /*#__PURE__*/
      function (_Component) {
        _inherits(LoadNamespace, _Component);

        function LoadNamespace(props) {
          var _this;

          _classCallCheck(this, LoadNamespace);

          _this = _possibleConstructorReturn(this, _getPrototypeOf(LoadNamespace).call(this, props));
          _this.getWrappedInstance = _this.getWrappedInstance.bind(_assertThisInitialized(_assertThisInitialized(_this)));
          return _this;
        }

        _createClass(LoadNamespace, [{
          key: "shouldComponentUpdate",
          value: function shouldComponentUpdate(nextProps) {
            var i18nOptions = this.props.i18nOptions;

            if (!i18nOptions.usePureComponent && !options.usePureComponent) {
              return true;
            }

            return !shallowEqual(this.props, nextProps);
          }
        }, {
          key: "getWrappedInstance",
          value: function getWrappedInstance() {
            var i18nOptions = this.props.i18nOptions;

            if (!i18nOptions.withRef && !options.usePureComponent) {
              // eslint-disable-next-line no-console
              console.error('To access the wrapped instance, you need to specify ' + '{ withRef: true } as the second argument of the translate() call.');
            }
            /* eslint react/no-string-refs: 1 */


            return this.wrappedInstance;
          }
        }, {
          key: "render",
          value: function render() {
            var _this2 = this;

            var _this$props = this.props,
                namespaces = _this$props.namespaces,
                i18nOptions = _this$props.i18nOptions;

            var mergedI18nOptions = _objectSpread({}, i18nOptions, options);

            var extraProps = {};

            if (mergedI18nOptions.withRef) {
              extraProps.ref = function (c) {
                _this2.wrappedInstance = c;
              };
            }

            return React__default.createElement(NamespacesConsumer, _objectSpread({
              ns: namespaces || namespaceArg
            }, this.props, {
              i18nOptions: Object.keys(mergedI18nOptions).length > 0 ? mergedI18nOptions : null
            }), function (t, _ref) {
              var ready = _ref.ready,
                  rest = _objectWithoutProperties(_ref, ["ready"]);

              return React__default.createElement(WrappedComponent, _objectSpread({
                tReady: ready
              }, _this2.props, extraProps, rest));
            });
          }
        }]);

        return LoadNamespace;
      }(React.Component);

      var LoadNamespaceWithContext = withI18n()(LoadNamespace);
      LoadNamespaceWithContext.WrappedComponent = WrappedComponent;
      LoadNamespaceWithContext.displayName = "LoadNamespace(".concat(getDisplayName(WrappedComponent), ")");
      LoadNamespaceWithContext.namespaces = namespaceArg;
      return hoistNonReactStatics_cjs(LoadNamespaceWithContext, WrappedComponent);
    };
  }
  withNamespaces.setDefaults = setDefaults;
  withNamespaces.setI18n = setI18n;
  function translate(ns, opts) {
    deprecated('translate was renamed to "withNamespaces" to make it more clear what the HOC does.');
    return withNamespaces(ns, opts);
  }

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
    children.forEach(function (child, i) {
      // const isElement = React.isValidElement(child);
      // const elementKey = `${index !== 0 ? index + '-' : ''}${i}:${typeof child.type === 'function' ? child.type.name : child.type || 'var'}`;
      var elementKey = "".concat(i);

      if (typeof child === 'string') {
        mem = "".concat(mem).concat(child);
      } else if (hasChildren(child)) {
        mem = "".concat(mem, "<").concat(elementKey, ">").concat(nodesToString('', getChildren(child), i + 1), "</").concat(elementKey, ">");
      } else if (React__default.isValidElement(child)) {
        mem = "".concat(mem, "<").concat(elementKey, "></").concat(elementKey, ">");
      } else if (_typeof(child) === 'object') {
        var clone = _objectSpread({}, child);

        var format = clone.format;
        delete clone.format;
        var keys = Object.keys(clone);

        if (format && keys.length === 1) {
          mem = "".concat(mem, "{{").concat(keys[0], ", ").concat(format, "}}");
        } else if (keys.length === 1) {
          mem = "".concat(mem, "{{").concat(keys[0], "}}");
        } else {
          // not a valid interpolation object (can only contain one value plus format)
          warn("react-i18next: the passed in object contained more than one variable - the object should look like {{ value, format }} where format is optional.", child);
        }
      } else {
        warn("Trans: the passed in value is invalid - seems you passed in a variable like {number} - please pass in variables for interpolation as full objects like {{number}}.", child);
      }
    });
    return mem;
  }

  function renderNodes(children, targetString, i18n) {
    if (targetString === '') return [];
    if (!children) return [targetString]; // v2 -> interpolates upfront no need for "some <0>{{var}}</0>"" -> will be just "some {{var}}" in translation file

    var data = {};

    function getData(childs) {
      if (Object.prototype.toString.call(childs) !== '[object Array]') childs = [childs];
      childs.forEach(function (child) {
        if (typeof child === 'string') return;
        if (hasChildren(child)) getData(getChildren(child));else if (_typeof(child) === 'object' && !React__default.isValidElement(child)) Object.assign(data, child);
      });
    }

    getData(children);
    targetString = i18n.services.interpolator.interpolate(targetString, data, i18n.language); // parse ast from string with additional wrapper tag
    // -> avoids issues in parser removing prepending text nodes

    var ast = htmlParseStringify2.parse("<0>".concat(targetString, "</0>"));

    function mapAST(reactNodes, astNodes) {
      if (Object.prototype.toString.call(reactNodes) !== '[object Array]') reactNodes = [reactNodes];
      if (Object.prototype.toString.call(astNodes) !== '[object Array]') astNodes = [astNodes];
      return astNodes.reduce(function (mem, node, i) {
        if (node.type === 'tag') {
          var child = reactNodes[parseInt(node.name, 10)] || {};
          var isElement = React__default.isValidElement(child);

          if (typeof child === 'string') {
            mem.push(child);
          } else if (hasChildren(child)) {
            var inner = mapAST(getChildren(child), node.children);
            if (child.dummy) child.children = inner; // needed on preact!

            mem.push(React__default.cloneElement(child, _objectSpread({}, child.props, {
              key: i
            }), inner));
          } else if (_typeof(child) === 'object' && !isElement) {
            var content = node.children[0] ? node.children[0].content : null; // v1
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


    var result = mapAST([{
      dummy: true,
      children: children
    }], ast);
    return getChildren(result[0]);
  }

  var TransComponent =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(TransComponent, _React$Component);

    function TransComponent() {
      _classCallCheck(this, TransComponent);

      return _possibleConstructorReturn(this, _getPrototypeOf(TransComponent).apply(this, arguments));
    }

    _createClass(TransComponent, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
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

        var t = tFromContextAndProps || i18n.t.bind(i18n);
        var reactI18nextOptions = i18n.options && i18n.options.react || {};
        var useAsParent = parent !== undefined ? parent : reactI18nextOptions.defaultTransParent;
        var defaultValue = defaults || nodesToString('', children, 0);
        var hashTransKey = reactI18nextOptions.hashTransKey;
        var key = i18nKey || (hashTransKey ? hashTransKey(defaultValue) : defaultValue);
        var interpolationOverride = values ? {} : {
          interpolation: {
            prefix: '#$?',
            suffix: '?$#'
          }
        };
        var translation = key ? t(key, _objectSpread({}, tOptions, values, interpolationOverride, {
          defaultValue: defaultValue,
          count: count,
          ns: namespace
        })) : defaultValue;

        if (reactI18nextOptions.exposeNamespace) {
          var ns = typeof t.ns === 'string' ? t.ns : t.ns[0];

          if (i18nKey && i18n.options && i18n.options.nsSeparator && i18nKey.indexOf(i18n.options.nsSeparator) > -1) {
            var parts = i18nKey.split(i18n.options.nsSeparator);
            ns = parts[0];
          }

          if (t.ns) additionalProps['data-i18next-options'] = JSON.stringify({
            ns: ns
          });
        }

        if (!useAsParent) return renderNodes(components || children, translation, i18n);
        return React__default.createElement(useAsParent, additionalProps, renderNodes(components || children, translation, i18n));
      }
    }]);

    return TransComponent;
  }(React__default.Component);
  var Trans = withI18n()(TransComponent);

  var I18nextProvider =
  /*#__PURE__*/
  function (_Component) {
    _inherits(I18nextProvider, _Component);

    function I18nextProvider(props) {
      var _this;

      _classCallCheck(this, I18nextProvider);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(I18nextProvider).call(this, props)); // nextjs / SSR: getting data from next.js or other ssr stack

      initSSR(props);
      return _this;
    }

    _createClass(I18nextProvider, [{
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(nextProps) {
        if (this.props.i18n !== nextProps.i18n) {
          throw new Error('[react-i18next][I18nextProvider]does not support changing the i18n object.');
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props,
            children = _this$props.children,
            i18n = _this$props.i18n,
            defaultNS = _this$props.defaultNS,
            reportNS = _this$props.reportNS;
        return React__default.createElement(I18nContext.Provider, {
          value: {
            i18n: i18n,
            defaultNS: defaultNS,
            reportNS: reportNS,
            lng: i18n && i18n.language,
            t: i18n && i18n.t.bind(i18n)
          }
        }, children);
      }
    }]);

    return I18nextProvider;
  }(React.Component);

  var InterpolateComponent =
  /*#__PURE__*/
  function (_Component) {
    _inherits(InterpolateComponent, _Component);

    function InterpolateComponent(props) {
      var _this;

      _classCallCheck(this, InterpolateComponent);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(InterpolateComponent).call(this, props));
      deprecated('Interpolate is deprecated and will be removed in the next major version (v9.0.0). Usage can be replaced by the "Trans" component');
      return _this;
    }

    _createClass(InterpolateComponent, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$props = this.props,
            i18n = _this$props.i18n,
            t = _this$props.t,
            i18nKey = _this$props.i18nKey,
            options = _this$props.options,
            className = _this$props.className,
            style = _this$props.style;
        var parent = this.props.parent || 'span';
        var REGEXP = this.props.regexp || i18n.services.interpolator.regexp; // Set to true if you want to use raw HTML in translation values
        // See https://github.com/i18next/react-i18next/issues/189

        var useDangerouslySetInnerHTML = this.props.useDangerouslySetInnerHTML || false;
        var dangerouslySetInnerHTMLPartElement = this.props.dangerouslySetInnerHTMLPartElement || 'span';

        var tOpts = _objectSpread({}, {}, options, {
          interpolation: {
            prefix: '#$?',
            suffix: '?$#'
          }
        });

        var format = t(i18nKey, tOpts);
        if (!format || typeof format !== 'string') return React__default.createElement('noscript', null);
        var children = [];

        var handleFormat = function handleFormat(key, props) {
          if (key.indexOf(i18n.options.interpolation.formatSeparator) < 0) {
            if (props[key] === undefined) i18n.services.logger.warn("interpolator: missed to pass in variable ".concat(key, " for interpolating ").concat(format));
            return props[key];
          }

          var p = key.split(i18n.options.interpolation.formatSeparator);
          var k = p.shift().trim();
          var f = p.join(i18n.options.interpolation.formatSeparator).trim();
          if (props[k] === undefined) i18n.services.logger.warn("interpolator: missed to pass in variable ".concat(k, " for interpolating ").concat(format));
          return i18n.options.interpolation.format(props[k], f, i18n.language);
        };

        format.split(REGEXP).reduce(function (memo, match, index) {
          var child;

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
            child = handleFormat(match, _this2.props);
          }

          memo.push(child);
          return memo;
        }, children);
        var additionalProps = {};

        if (i18n.options.react && i18n.options.react.exposeNamespace) {
          var ns = typeof t.ns === 'string' ? t.ns : t.ns[0];

          if (i18nKey && i18n.options.nsSeparator && i18nKey.indexOf(i18n.options.nsSeparator) > -1) {
            var parts = i18nKey.split(i18n.options.nsSeparator);
            ns = parts[0];
          }

          if (t.ns) additionalProps['data-i18next-options'] = JSON.stringify({
            ns: ns
          });
        }

        if (className) additionalProps.className = className;
        if (style) additionalProps.style = style;
        return React__default.createElement.apply(this, [parent, additionalProps].concat(children));
      }
    }]);

    return InterpolateComponent;
  }(React.Component);
  var Interpolate = withI18n()(InterpolateComponent);

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

})));

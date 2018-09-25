(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('prop-types')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react', 'prop-types'], factory) :
	(factory((global.reactI18next = {}),global.React,global.PropTypes));
}(this, (function (exports,React,PropTypes) { 'use strict';

var React__default = 'default' in React ? React['default'] : React;
PropTypes = PropTypes && PropTypes.hasOwnProperty('default') ? PropTypes['default'] : PropTypes;

/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';

var REACT_STATICS = {
    childContextTypes: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
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

var defineProperty = Object.defineProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = getPrototypeOf && getPrototypeOf(Object);

var hoistNonReactStatics = function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
    if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components

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

        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (!REACT_STATICS[key] && !KNOWN_STATICS[key] && (!blacklist || !blacklist[key])) {
                var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
                try { // Avoid failures from read-only properties
                    defineProperty(targetComponent, key, descriptor);
                } catch (e) {}
            }
        }

        return targetComponent;
    }

    return targetComponent;
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
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
};









var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
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
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

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
  }
  // Step 6.a: NaN == NaN
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

  if ((typeof objA === 'undefined' ? 'undefined' : _typeof(objA)) !== 'object' || objA === null || (typeof objB === 'undefined' ? 'undefined' : _typeof(objB)) !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

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

var i18n = void 0;

function setDefaults(options) {
  defaultOptions = _extends({}, defaultOptions, options);
}

function getDefaults() {
  return defaultOptions;
}

function setI18n(instance) {
  i18n = instance;
}

function getI18n() {
  return i18n;
}

var reactI18nextModule = {
  type: '3rdParty',

  init: function init(instance) {
    setDefaults(instance.options.react);
    setI18n(instance);
  }
};

var removedIsInitialSSR = false;

var I18n = function (_Component) {
  inherits(I18n, _Component);

  function I18n(props, context) {
    classCallCheck(this, I18n);

    var _this = possibleConstructorReturn(this, (I18n.__proto__ || Object.getPrototypeOf(I18n)).call(this, props, context));

    _this.i18n = props.i18n || context.i18n || getI18n();

    var i18nOptions = _this.i18n && _this.i18n.options && _this.i18n.options.react || {};
    _this.options = _extends({}, getDefaults(), i18nOptions, props);

    // nextjs SSR: getting data from next.js or other ssr stack
    if (props.initialI18nStore) {
      _this.i18n.services.resourceStore.data = props.initialI18nStore;
      _this.options.wait = false; // we got all passed down already
    }
    if (props.initialLanguage) {
      _this.i18n.changeLanguage(props.initialLanguage);
    }

    // provider SSR: data was set in provider and ssr flag was set
    if (_this.i18n.options && _this.i18n.options.isInitialSSR) {
      _this.options.wait = false;
    }

    var language = _this.i18n.languages && _this.i18n.languages[0];
    var ready = !!language && _this.getNamespaces().every(function (ns) {
      return _this.i18n.hasResourceBundle(language, ns);
    });

    _this.state = {
      i18nLoadedAt: null,
      ready: ready
    };

    _this.t = _this.getI18nTranslate();

    _this.onI18nChanged = _this.onI18nChanged.bind(_this);
    _this.getI18nTranslate = _this.getI18nTranslate.bind(_this);
    _this.namespaces = _this.getNamespaces.bind(_this);
    return _this;
  }

  createClass(I18n, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        t: this.t,
        i18n: this.i18n
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadNamespaces();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      // Note that dynamically loading additional namespaces after the initial mount will not block rendering – even if the `wait` option is true.
      if (this.props.ns && prevProps.ns !== this.props.ns) this.loadNamespaces();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _this2 = this;

      this.mounted = false;
      if (this.onI18nChanged) {
        if (this.options.bindI18n) {
          var p = this.options.bindI18n.split(' ');
          p.forEach(function (f) {
            return _this2.i18n.off(f, _this2.onI18nChanged);
          });
        }
        if (this.options.bindStore) {
          var _p = this.options.bindStore.split(' ');
          _p.forEach(function (f) {
            return _this2.i18n.store && _this2.i18n.store.off(f, _this2.onI18nChanged);
          });
        }
      }
    }
  }, {
    key: 'onI18nChanged',
    value: function onI18nChanged() {
      if (!this.mounted) return;
      if (!this.state.ready && this.options.omitBoundRerender) return;

      this.t = this.getI18nTranslate();
      this.setState({ i18nLoadedAt: new Date() }); // rerender
    }
  }, {
    key: 'getI18nTranslate',
    value: function getI18nTranslate() {
      return this.i18n.getFixedT(null, this.options.nsMode === 'fallback' ? this.getNamespaces() : this.getNamespaces()[0]);
    }
  }, {
    key: 'getNamespaces',
    value: function getNamespaces() {
      var ns = this.props.ns || this.i18n.options && this.i18n.options.defaultNS;
      return typeof ns === 'string' ? [ns] : ns;
    }
  }, {
    key: 'loadNamespaces',
    value: function loadNamespaces() {
      var _this3 = this;

      var bind = function bind() {
        if (_this3.options.bindI18n && _this3.i18n) _this3.i18n.on(_this3.options.bindI18n, _this3.onI18nChanged);
        if (_this3.options.bindStore && _this3.i18n.store) _this3.i18n.store.on(_this3.options.bindStore, _this3.onI18nChanged);
      };

      this.mounted = true;
      this.i18n.loadNamespaces(this.getNamespaces(), function () {
        var ready = function ready() {
          if (_this3.mounted && !_this3.state.ready) _this3.setState({ ready: true });
          if (_this3.options.wait && _this3.mounted) bind();
        };

        if (_this3.i18n.isInitialized) {
          ready();
        } else {
          var initialized = function initialized() {
            // due to emitter removing issue in i18next we need to delay remove
            setTimeout(function () {
              _this3.i18n.off('initialized', initialized);
            }, 1000);
            ready();
          };

          _this3.i18n.on('initialized', initialized);
        }
      });

      if (!this.options.wait) bind();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var children = this.props.children;
      var ready = this.state.ready;


      if (!ready && this.options.wait) return null;

      // remove ssr flag set by provider - first render was done from now on wait if set to wait
      if (this.i18n.options && this.i18n.options.isInitialSSR && !removedIsInitialSSR) {
        removedIsInitialSSR = true;
        setTimeout(function () {
          delete _this4.i18n.options.isInitialSSR;
        }, 100);
      }

      return children(this.t, {
        i18n: this.i18n,
        t: this.t,
        lng: this.i18n.language,
        ready: ready
      });
    }
  }]);
  return I18n;
}(React.Component);

I18n.contextTypes = {
  i18n: PropTypes.object
};

I18n.childContextTypes = {
  t: PropTypes.func.isRequired,
  i18n: PropTypes.object
};

function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}

function translate(namespaceArg) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  return function Wrapper(WrappedComponent) {
    var Translate = function (_Component) {
      inherits(Translate, _Component);

      function Translate(props, context) {
        classCallCheck(this, Translate);

        var _this = possibleConstructorReturn(this, (Translate.__proto__ || Object.getPrototypeOf(Translate)).call(this, props, context));

        _this.i18n = props.i18n || options.i18n || context.i18n || getI18n();
        _this.namespaces = typeof namespaceArg === 'function' ? namespaceArg(props) : namespaceArg || context.defaultNS || _this.i18n.options && _this.i18n.options.defaultNS;
        if (typeof _this.namespaces === 'string') _this.namespaces = [_this.namespaces];

        var i18nOptions = _this.i18n && _this.i18n.options && _this.i18n.options.react || {};
        _this.options = _extends({}, getDefaults(), i18nOptions, options);

        if (context.reportNS) {
          var namespaces = _this.namespaces || [undefined];
          namespaces.forEach(context.reportNS);
        }

        _this.getWrappedInstance = _this.getWrappedInstance.bind(_this);
        return _this;
      }

      createClass(Translate, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
          if (!this.options.usePureComponent) {
            return true;
          }

          return !shallowEqual(this.props, nextProps);
        }
      }, {
        key: 'getWrappedInstance',
        value: function getWrappedInstance() {
          if (!this.options.withRef) {
            // eslint-disable-next-line no-console
            console.error('To access the wrapped instance, you need to specify ' + '{ withRef: true } as the second argument of the translate() call.');
          }

          /* eslint react/no-string-refs: 1 */
          return this.wrappedInstance;
        }
      }, {
        key: 'render',
        value: function render() {
          var _this2 = this;

          var extraProps = {};

          if (this.options.withRef) {
            extraProps.ref = function (c) {
              _this2.wrappedInstance = c;
            };
          }

          return React__default.createElement(I18n, _extends({ ns: this.namespaces }, this.options, this.props, { i18n: this.i18n }), function (t, _ref) {
            var ready = _ref.ready,
                context = objectWithoutProperties(_ref, ['ready']);
            return React__default.createElement(WrappedComponent, _extends({
              tReady: ready
            }, _this2.props, extraProps, context));
          });
        }
      }]);
      return Translate;
    }(React.Component);

    Translate.WrappedComponent = WrappedComponent;

    Translate.contextTypes = {
      i18n: PropTypes.object,
      defaultNS: PropTypes.string,
      reportNS: PropTypes.func
    };

    Translate.displayName = 'Translate(' + getDisplayName(WrappedComponent) + ')';

    Translate.namespaces = namespaceArg;

    return hoistNonReactStatics(Translate, WrappedComponent);
  };
}

translate.setDefaults = setDefaults;

translate.setI18n = setI18n;

var Interpolate = function (_Component) {
  inherits(Interpolate, _Component);

  function Interpolate(props, context) {
    classCallCheck(this, Interpolate);

    var _this = possibleConstructorReturn(this, (Interpolate.__proto__ || Object.getPrototypeOf(Interpolate)).call(this, props, context));

    _this.i18n = props.i18n || context.i18n;
    _this.t = props.t || context.t;
    return _this;
  }

  createClass(Interpolate, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var parent = this.props.parent || 'span';
      var REGEXP = this.props.regexp || this.i18n.services.interpolator.regexp;
      var _props = this.props,
          className = _props.className,
          style = _props.style;

      // Set to true if you want to use raw HTML in translation values
      // See https://github.com/i18next/react-i18next/issues/189

      var useDangerouslySetInnerHTML = this.props.useDangerouslySetInnerHTML || false;
      var dangerouslySetInnerHTMLPartElement = this.props.dangerouslySetInnerHTMLPartElement || 'span';

      var tOpts = _extends({}, this.props.options, { interpolation: { prefix: '#$?', suffix: '?$#' } });
      var format = this.t(this.props.i18nKey, tOpts);

      if (!format || typeof format !== 'string') return React__default.createElement('noscript', null);

      var children = [];

      var handleFormat = function handleFormat(key, props) {
        if (key.indexOf(_this2.i18n.options.interpolation.formatSeparator) < 0) {
          if (props[key] === undefined) _this2.i18n.services.logger.warn('interpolator: missed to pass in variable ' + key + ' for interpolating ' + format);
          return props[key];
        }

        var p = key.split(_this2.i18n.options.interpolation.formatSeparator);
        var k = p.shift().trim();
        var f = p.join(_this2.i18n.options.interpolation.formatSeparator).trim();

        if (props[k] === undefined) _this2.i18n.services.logger.warn('interpolator: missed to pass in variable ' + k + ' for interpolating ' + format);
        return _this2.i18n.options.interpolation.format(props[k], f, _this2.i18n.language);
      };

      format.split(REGEXP).reduce(function (memo, match, index) {
        var child = void 0;

        if (index % 2 === 0) {
          if (match.length === 0) return memo;
          if (useDangerouslySetInnerHTML) {
            child = React__default.createElement(dangerouslySetInnerHTMLPartElement, { dangerouslySetInnerHTML: { __html: match } });
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
      if (this.i18n.options.react && this.i18n.options.react.exposeNamespace) {
        var ns = typeof this.t.ns === 'string' ? this.t.ns : this.t.ns[0];
        if (this.props.i18nKey && this.i18n.options.nsSeparator && this.props.i18nKey.indexOf(this.i18n.options.nsSeparator) > -1) {
          var parts = this.props.i18nKey.split(this.i18n.options.nsSeparator);
          ns = parts[0];
        }
        if (this.t.ns) additionalProps['data-i18next-options'] = JSON.stringify({ ns: ns });
      }

      if (className) additionalProps.className = className;
      if (style) additionalProps.style = style;

      return React__default.createElement.apply(this, [parent, additionalProps].concat(children));
    }
  }]);
  return Interpolate;
}(React.Component);

Interpolate.propTypes = {
  className: PropTypes.string
};

Interpolate.defaultProps = {
  className: ''
};

Interpolate.contextTypes = {
  i18n: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

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
            key=match;
        } else {
            if (i === 0) {
                if (voidElements[match] || tag.charAt(tag.length - 2) === '/') {
                    res.voidElement = true;
                }
                res.name = match;
            } else {
                res.attrs[key] = match.replace(/^['"]|['"]$/g, '');
                key=undefined;
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
var empty = Object.create ? Object.create(null) : {};
// common logic for pushing a child node onto a list
function pushTextNode(list, html, level, start, ignoreWhitespace) {
    // calculate correct end of the content slice in case there's
    // no tag after the text node.
    var end = html.indexOf('<', start);
    var content = html.slice(start, end === -1 ? undefined : end);
    // if a node is nothing but whitespace, collapse it as the spec states:
    // https://www.w3.org/TR/html4/struct/text.html#h-9.1
    if (/^\s*$/.test(content)) {
        content = ' ';
    }
    // don't add whitespace-only text nodes if they would be trailing text nodes
    // or if they would be leading whitespace-only text nodes:
    //  * end > -1 indicates this is not a trailing text node
    //  * leading node is when level is -1 and list has length 0
    if ((!ignoreWhitespace && end > -1 && level + list.length >= 0) || content !== ' ') {
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
    var inComponent = false;

    html.replace(tagRE, function (tag, index) {
        if (inComponent) {
            if (tag !== ('</' + current.name + '>')) {
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
    });

    // If the "html" passed isn't actually html, add it as a text node.
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
    var elementKey = '' + i;

    if (typeof child === 'string') {
      mem = '' + mem + child;
    } else if (hasChildren(child)) {
      mem = mem + '<' + elementKey + '>' + nodesToString('', getChildren(child), i + 1) + '</' + elementKey + '>';
    } else if (React__default.isValidElement(child)) {
      mem = mem + '<' + elementKey + '></' + elementKey + '>';
    } else if ((typeof child === 'undefined' ? 'undefined' : _typeof(child)) === 'object') {
      var clone = _extends({}, child);
      var format = clone.format;
      delete clone.format;

      var keys = Object.keys(clone);
      if (format && keys.length === 1) {
        mem = mem + '<' + elementKey + '>{{' + keys[0] + ', ' + format + '}}</' + elementKey + '>';
      } else if (keys.length === 1) {
        mem = mem + '<' + elementKey + '>{{' + keys[0] + '}}</' + elementKey + '>';
      } else if (console && console.warn) {
        // not a valid interpolation object (can only contain one value plus format)
        console.warn('react-i18next: the passed in object contained more than one variable - the object should look like {{ value, format }} where format is optional.', child);
      }
    } else if (console && console.warn) {
      console.warn('react-i18next: the passed in value is invalid - seems you passed in a variable like {number} - please pass in variables for interpolation as full objects like {{number}}.', child);
    }
  });

  return mem;
}

function renderNodes(children, targetString, i18n) {
  if (targetString === "") return [];
  if (!children) return [targetString];

  // parse ast from string with additional wrapper tag
  // -> avoids issues in parser removing prepending text nodes
  var ast = htmlParseStringify2.parse('<0>' + targetString + '</0>');

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
          mem.push(React__default.cloneElement(child, _extends({}, child.props, { key: i }), inner));
        } else if ((typeof child === 'undefined' ? 'undefined' : _typeof(child)) === 'object' && !isElement) {
          var content = node.children[0] ? node.children[0].content : null;
          if (content) {
            var interpolated = i18n.services.interpolator.interpolate(node.children[0].content, child, i18n.language);
            mem.push(interpolated);
          }
        } else {
          mem.push(child);
        }
      } else if (node.type === 'text') {
        mem.push(node.content);
      }
      return mem;
    }, []);
  }

  // call mapAST with having react nodes nested into additional node like
  // we did for the string ast from translation
  // return the children of that extra node to get expected result
  var result = mapAST([{ dummy: true, children: children }], ast);
  return getChildren(result[0]);
}

var Trans = function (_React$Component) {
  inherits(Trans, _React$Component);

  function Trans() {
    classCallCheck(this, Trans);
    return possibleConstructorReturn(this, (Trans.__proto__ || Object.getPrototypeOf(Trans)).apply(this, arguments));
  }

  createClass(Trans, [{
    key: 'render',
    value: function render() {
      var contextAndProps = _extends({ i18n: this.context.i18n, t: this.context.t }, this.props);
      var children = contextAndProps.children,
          count = contextAndProps.count,
          parent = contextAndProps.parent,
          i18nKey = contextAndProps.i18nKey,
          tOptions = contextAndProps.tOptions,
          values = contextAndProps.values,
          defaults$$1 = contextAndProps.defaults,
          components = contextAndProps.components,
          namespace = contextAndProps.ns,
          i18n = contextAndProps.i18n,
          tFromContextAndProps = contextAndProps.t,
          additionalProps = objectWithoutProperties(contextAndProps, ['children', 'count', 'parent', 'i18nKey', 'tOptions', 'values', 'defaults', 'components', 'ns', 'i18n', 't']);

      var t = tFromContextAndProps || i18n.t.bind(i18n);

      var reactI18nextOptions = i18n.options && i18n.options.react || {};
      var useAsParent = parent !== undefined ? parent : reactI18nextOptions.defaultTransParent;

      var defaultValue = defaults$$1 || nodesToString('', children, 0);
      var hashTransKey = reactI18nextOptions.hashTransKey;
      var key = i18nKey || (hashTransKey ? hashTransKey(defaultValue) : defaultValue);
      var interpolationOverride = values ? {} : { interpolation: { prefix: '#$?', suffix: '?$#' } };
      var translation = key ? t(key, _extends({}, tOptions, values, interpolationOverride, { defaultValue: defaultValue, count: count, ns: namespace })) : defaultValue;

      if (reactI18nextOptions.exposeNamespace) {
        var ns = typeof t.ns === 'string' ? t.ns : t.ns[0];
        if (i18nKey && i18n.options && i18n.options.nsSeparator && i18nKey.indexOf(i18n.options.nsSeparator) > -1) {
          var parts = i18nKey.split(i18n.options.nsSeparator);
          ns = parts[0];
        }
        if (t.ns) additionalProps['data-i18next-options'] = JSON.stringify({ ns: ns });
      }

      if (!useAsParent) return renderNodes(components || children, translation, i18n);

      return React__default.createElement(useAsParent, additionalProps, renderNodes(components || children, translation, i18n));
    }
  }]);
  return Trans;
}(React__default.Component);

Trans.propTypes = {
  count: PropTypes.number,
  parent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  i18nKey: PropTypes.string,
  i18n: PropTypes.object,
  t: PropTypes.func
};

// Trans.defaultProps = {
//   parent: 'div'
// };

Trans.contextTypes = {
  i18n: PropTypes.object,
  t: PropTypes.func
};

var I18nextProvider = function (_Component) {
  inherits(I18nextProvider, _Component);

  function I18nextProvider(props, context) {
    classCallCheck(this, I18nextProvider);

    var _this = possibleConstructorReturn(this, (I18nextProvider.__proto__ || Object.getPrototypeOf(I18nextProvider)).call(this, props, context));

    _this.i18n = props.i18n;
    _this.defaultNS = props.defaultNS;
    if (props.initialI18nStore) {
      _this.i18n.services.resourceStore.data = props.initialI18nStore;
      _this.i18n.options.isInitialSSR = true; // if set will be deleted on first render in translate hoc
    }
    if (props.initialLanguage) {
      _this.i18n.changeLanguage(props.initialLanguage);
    }
    _this.reportNS = props.reportNS;
    return _this;
  }

  createClass(I18nextProvider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        i18n: this.i18n,
        defaultNS: this.defaultNS,
        reportNS: this.reportNS
      };
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.i18n !== nextProps.i18n) {
        throw new Error('[react-i18next][I18nextProvider]does not support changing the i18n object.');
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var children = this.props.children;

      return React.Children.only(children);
    }
  }]);
  return I18nextProvider;
}(React.Component);

I18nextProvider.propTypes = {
  i18n: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  defaultNS: PropTypes.string,
  reportNS: PropTypes.func
};

I18nextProvider.childContextTypes = {
  i18n: PropTypes.object.isRequired,
  defaultNS: PropTypes.string,
  reportNS: PropTypes.func
};

I18nextProvider.defaultProps = {
  defaultNS: undefined,
  reportNS: undefined
};

var objectEntries = Object.entries || function (obj) {
  var ownProps = Object.keys(obj),
      i = ownProps.length,
      resArray = new Array(i); // preallocate the Array
  while (i--) {
    resArray[i] = [ownProps[i], obj[ownProps[i]]];
  }return resArray;
};

// Borrowed from https://github.com/Rezonans/redux-async-connect/blob/master/modules/ReduxAsyncConnect.js#L16
function eachComponents(components, iterator) {
  for (var i = 0, l = components.length; i < l; i++) {
    // eslint-disable-line id-length
    if (_typeof(components[i]) === 'object') {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = objectEntries(components[i])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = slicedToArray(_step.value, 2),
              key = _step$value[0],
              value = _step$value[1];

          iterator(value, i, key);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
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
  eachComponents(components, function (Component$$1) {
    if (Component$$1 && Component$$1.namespaces) {

      Component$$1.namespaces.forEach(function (namespace) {
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
}

exports.translate = translate;
exports.I18n = I18n;
exports.Interpolate = Interpolate;
exports.Trans = Trans;
exports.I18nextProvider = I18nextProvider;
exports.loadNamespaces = loadNamespaces;
exports.reactI18nextModule = reactI18nextModule;
exports.setDefaults = setDefaults;
exports.getDefaults = getDefaults;
exports.setI18n = setI18n;
exports.getI18n = getI18n;

Object.defineProperty(exports, '__esModule', { value: true });

})));

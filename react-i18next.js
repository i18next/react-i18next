(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('prop-types')) :
	typeof define === 'function' && define.amd ? define('reactI18next', ['exports', 'react', 'prop-types'], factory) :
	(factory((global.reactI18next = global.reactI18next || {}),global.React,global.PropTypes));
}(this, (function (exports,React,PropTypes) { 'use strict';

var React__default = 'default' in React ? React['default'] : React;
PropTypes = 'default' in PropTypes ? PropTypes['default'] : PropTypes;

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
    mixins: true,
    propTypes: true,
    type: true
};

var KNOWN_STATICS = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    arguments: true,
    arity: true
};

var isGetOwnPropertySymbolsAvailable = typeof Object.getOwnPropertySymbols === 'function';

var index = function hoistNonReactStatics(targetComponent, sourceComponent, customStatics) {
    if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components
        var keys = Object.getOwnPropertyNames(sourceComponent);

        /* istanbul ignore else */
        if (isGetOwnPropertySymbolsAvailable) {
            keys = keys.concat(Object.getOwnPropertySymbols(sourceComponent));
        }

        for (var i = 0; i < keys.length; ++i) {
            if (!REACT_STATICS[keys[i]] && !KNOWN_STATICS[keys[i]] && (!customStatics || !customStatics[keys[i]])) {
                try {
                    targetComponent[keys[i]] = sourceComponent[keys[i]];
                } catch (error) {

                }
            }
        }
    }

    return targetComponent;
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











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





var defineProperty = function (obj, key, value) {
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
};

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

function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}

function translate(namespaces) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$withRef = options.withRef,
      withRef = _options$withRef === undefined ? false : _options$withRef,
      _options$bindI18n = options.bindI18n,
      bindI18n = _options$bindI18n === undefined ? 'languageChanged loaded' : _options$bindI18n,
      _options$bindStore = options.bindStore,
      bindStore = _options$bindStore === undefined ? 'added removed' : _options$bindStore,
      _options$translateFun = options.translateFuncName,
      translateFuncName = _options$translateFun === undefined ? 't' : _options$translateFun;
  var _options$wait = options.wait,
      wait = _options$wait === undefined ? false : _options$wait;


  return function Wrapper(WrappedComponent) {
    var Translate = function (_Component) {
      inherits(Translate, _Component);

      function Translate(props, context) {
        classCallCheck(this, Translate);

        var _this = possibleConstructorReturn(this, (Translate.__proto__ || Object.getPrototypeOf(Translate)).call(this, props, context));

        _this.i18n = context.i18n || props.i18n;
        namespaces = namespaces || _this.i18n.options.defaultNS;
        if (typeof namespaces === 'string') namespaces = [namespaces];

        if (!wait && _this.i18n.options.wait) wait = _this.i18n.options.wait;

        _this.state = {
          i18nLoadedAt: null,
          ready: false
        };

        _this.onI18nChanged = _this.onI18nChanged.bind(_this);
        return _this;
      }

      createClass(Translate, [{
        key: 'getChildContext',
        value: function getChildContext() {
          return defineProperty({}, translateFuncName, this[translateFuncName]);
        }
      }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
          this[translateFuncName] = this.i18n.getFixedT(null, namespaces);
        }
      }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
          var _this2 = this;

          var bind = function bind() {
            bindI18n && _this2.i18n.on(bindI18n, _this2.onI18nChanged);
            bindStore && _this2.i18n.store && _this2.i18n.store.on(bindStore, _this2.onI18nChanged);
          };

          this.mounted = true;
          this.i18n.loadNamespaces(namespaces, function () {
            var ready = function ready() {
              if (_this2.mounted) _this2.setState({ ready: true });
              if (wait && _this2.mounted) bind();
            };

            if (_this2.i18n.isInitialized) return ready();

            var initialized = function initialized() {
              // due to emitter removing issue in i18next we need to delay remove
              setTimeout(function () {
                _this2.i18n.off('initialized', initialized);
              }, 1000);
              ready();
            };
            _this2.i18n.on('initialized', initialized);
          });
          if (!wait) bind();
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          var _this3 = this;

          this.mounted = false;
          if (this.onI18nChanged) {
            if (bindI18n) {
              var p = bindI18n.split(' ');
              p.forEach(function (f) {
                return _this3.i18n.off(f, _this3.onI18nChanged);
              });
            }
            if (bindStore) {
              var _p = bindStore.split(' ');
              _p.forEach(function (f) {
                return _this3.i18n.store && _this3.i18n.store.off(f, _this3.onI18nChanged);
              });
            }
          }
        }
      }, {
        key: 'onI18nChanged',
        value: function onI18nChanged() {
          if (!this.mounted) return;

          this.setState({ i18nLoadedAt: new Date() });
        }
      }, {
        key: 'getWrappedInstance',
        value: function getWrappedInstance() {
          if (!withRef) {
            // eslint-disable-next-line no-console
            console.error('To access the wrapped instance, you need to specify ' + '{ withRef: true } as the second argument of the translate() call.');
          }

          return this.refs.wrappedInstance;
        }
      }, {
        key: 'render',
        value: function render() {
          var _extraProps;

          var _state = this.state,
              i18nLoadedAt = _state.i18nLoadedAt,
              ready = _state.ready;

          var extraProps = (_extraProps = { i18nLoadedAt: i18nLoadedAt }, defineProperty(_extraProps, translateFuncName, this[translateFuncName]), defineProperty(_extraProps, 'i18n', this.i18n), _extraProps);

          if (withRef) {
            extraProps.ref = 'wrappedInstance';
          }

          if (!ready && wait) return null;

          return React__default.createElement(WrappedComponent, _extends({}, this.props, extraProps));
        }
      }]);
      return Translate;
    }(React.Component);

    Translate.WrappedComponent = WrappedComponent;

    Translate.contextTypes = {
      i18n: PropTypes.object
    };

    Translate.childContextTypes = defineProperty({}, translateFuncName, PropTypes.func.isRequired);

    Translate.displayName = 'Translate(' + getDisplayName(WrappedComponent) + ')';

    Translate.namespaces = namespaces;

    return index(Translate, WrappedComponent);
  };
}

var Interpolate = function (_Component) {
  inherits(Interpolate, _Component);

  function Interpolate(props, context) {
    classCallCheck(this, Interpolate);

    var _this = possibleConstructorReturn(this, (Interpolate.__proto__ || Object.getPrototypeOf(Interpolate)).call(this, props, context));

    _this.i18n = context.i18n;
    _this.t = context.t;
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

      return React__default.createElement.apply(this, [parent, { className: className, style: style }].concat(children));
    }
  }]);
  return Interpolate;
}(React.Component);

Interpolate.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

Interpolate.contextTypes = {
  i18n: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

var I18nextProvider = function (_Component) {
  inherits(I18nextProvider, _Component);

  function I18nextProvider(props, context) {
    classCallCheck(this, I18nextProvider);

    var _this = possibleConstructorReturn(this, (I18nextProvider.__proto__ || Object.getPrototypeOf(I18nextProvider)).call(this, props, context));

    _this.i18n = props.i18n;
    return _this;
  }

  createClass(I18nextProvider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return { i18n: this.i18n };
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
  children: PropTypes.element.isRequired
};

I18nextProvider.childContextTypes = {
  i18n: PropTypes.object.isRequired
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
        for (var _iterator = Object.entries(components[i])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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

exports.loadNamespaces = loadNamespaces;
exports.translate = translate;
exports.Interpolate = Interpolate;
exports.I18nextProvider = I18nextProvider;

Object.defineProperty(exports, '__esModule', { value: true });

})));

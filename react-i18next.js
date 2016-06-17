(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define('reactI18next', ['exports', 'react'], factory) :
  (factory((global.reactI18next = global.reactI18next || {}),global.React));
}(this, function (exports,React) { 'use strict';

  var React__default = 'default' in React ? React['default'] : React;

  var babelHelpers = {};
  babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
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

  babelHelpers.extends = Object.assign || function (target) {
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

  babelHelpers.inherits = function (subClass, superClass) {
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

  babelHelpers.possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  babelHelpers.slicedToArray = function () {
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

  babelHelpers;

  function getDisplayName(component) {
    return component.displayName || component.name || 'Component';
  }

  function translate(namespaces) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var _options$withRef = options.withRef;
    var withRef = _options$withRef === undefined ? false : _options$withRef;
    var _options$wait = options.wait;
    var wait = _options$wait === undefined ? false : _options$wait;


    return function Wrapper(WrappedComponent) {
      var Translate = function (_Component) {
        babelHelpers.inherits(Translate, _Component);

        function Translate(props, context) {
          babelHelpers.classCallCheck(this, Translate);

          var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Translate).call(this, props, context));

          _this.i18n = context.i18n;
          namespaces = namespaces || _this.i18n.options.defaultNS;

          _this.state = {
            i18nLoadedAt: null,
            ready: false
          };

          _this.onI18nChanged = _this.onI18nChanged.bind(_this);
          return _this;
        }

        babelHelpers.createClass(Translate, [{
          key: 'getChildContext',
          value: function getChildContext() {
            return { t: this.t };
          }
        }, {
          key: 'componentWillMount',
          value: function componentWillMount() {
            this.t = this.i18n.getFixedT(null, namespaces);
          }
        }, {
          key: 'componentDidMount',
          value: function componentDidMount() {
            var _this2 = this;

            this.mounted = true;
            this.i18n.loadNamespaces(namespaces, function () {
              _this2.setState({ ready: true });
            });
            this.i18n.on('languageChanged loaded', this.onI18nChanged);
          }
        }, {
          key: 'componentWillUnmount',
          value: function componentWillUnmount() {
            this.mounted = false;
            if (this.onI18nChanged) {
              this.i18n.off('languageChanged', this.onI18nChanged);
              this.i18n.off('loaded', this.onI18nChanged);
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
            var _state = this.state;
            var i18nLoadedAt = _state.i18nLoadedAt;
            var ready = _state.ready;

            var extraProps = { i18nLoadedAt: i18nLoadedAt, t: this.t };

            if (withRef) {
              extraProps.ref = 'wrappedInstance';
            }

            if (!ready && wait) return null;

            return React__default.createElement(WrappedComponent, babelHelpers.extends({}, this.props, extraProps));
          }
        }]);
        return Translate;
      }(React.Component);

      Translate.WrappedComponent = WrappedComponent;

      Translate.contextTypes = {
        i18n: React.PropTypes.object.isRequired
      };

      Translate.childContextTypes = {
        t: React.PropTypes.func.isRequired
      };

      Translate.displayName = 'Translate[' + getDisplayName(WrappedComponent) + ']';

      Translate.namespaces = namespaces;

      return Translate;
    };
  }

  var Interpolate = function (_Component) {
    babelHelpers.inherits(Interpolate, _Component);

    function Interpolate(props, context) {
      babelHelpers.classCallCheck(this, Interpolate);

      var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Interpolate).call(this, props, context));

      _this.i18n = context.i18n;
      _this.t = context.t;
      return _this;
    }

    babelHelpers.createClass(Interpolate, [{
      key: 'render',
      value: function render() {
        var _this2 = this;

        var parent = this.props.parent || 'span';
        var REGEXP = this.props.regexp || this.i18n.services.interpolator.regexp;

        var tOpts = babelHelpers.extends({}, this.props.options, { interpolation: { prefix: '#$?', suffix: '?$#' } });
        var format = this.t(this.props.i18nKey, tOpts);

        if (!format || typeof format !== 'string') return React__default.createElement('noscript', null);

        var children = [];

        format.split(REGEXP).reduce(function (memo, match, index) {
          var child;

          if (index % 2 === 0) {
            if (match.length === 0) return memo;
            child = match;
          } else {
            child = _this2.props[match];
          }

          memo.push(child);
          return memo;
        }, children);

        return React__default.createElement.apply(this, [parent, this.props].concat(children));
      }
    }]);
    return Interpolate;
  }(React.Component);

  Interpolate.contextTypes = {
    i18n: React.PropTypes.object.isRequired,
    t: React.PropTypes.func.isRequired
  };

  var I18nextProvider = function (_Component) {
    babelHelpers.inherits(I18nextProvider, _Component);

    function I18nextProvider(props, context) {
      babelHelpers.classCallCheck(this, I18nextProvider);

      var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(I18nextProvider).call(this, props, context));

      _this.i18n = props.i18n;
      return _this;
    }

    babelHelpers.createClass(I18nextProvider, [{
      key: 'getChildContext',
      value: function getChildContext() {
        return { i18n: this.i18n };
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (this.props.i18n !== nextProps.i18n) {
          console.error('[react-i18next][I18nextProvider]does not support changing the i18n object.');
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
    i18n: React.PropTypes.object.isRequired,
    children: React.PropTypes.element.isRequired
  };

  I18nextProvider.childContextTypes = {
    i18n: React.PropTypes.object.isRequired
  };

  // Borrowed from https://github.com/Rezonans/redux-async-connect/blob/master/modules/ReduxAsyncConnect.js#L16
  function eachComponents(components, iterator) {
    for (var i = 0, l = components.length; i < l; i++) {
      // eslint-disable-line id-length
      if (babelHelpers.typeof(components[i]) === 'object') {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.entries(components[i])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = babelHelpers.slicedToArray(_step.value, 2);

            var key = _step$value[0];
            var value = _step$value[1];

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
    var components = _ref.components;
    var i18n = _ref.i18n;

    var allNamespaces = filterAndFlattenComponents(components);

    return new Promise(function (resolve) {
      i18n.loadNamespaces(allNamespaces, resolve);
    });
  }

  exports.loadNamespaces = loadNamespaces;
  exports.translate = translate;
  exports.Interpolate = Interpolate;
  exports.I18nextProvider = I18nextProvider;

}));
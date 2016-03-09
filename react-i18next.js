(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define('react-i18next', ['exports', 'react'], factory) :
  (factory((global.react-i18next = global.react-i18next || {}),global.React));
}(this, function (exports,React) { 'use strict';

  var React__default = 'default' in React ? React['default'] : React;

  var babelHelpers = {};

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

  babelHelpers;

  function getDisplayName(component) {
    return component.displayName || component.name || 'Component';
  }

  function translate(namespaces) {
    return function Wrapper(WrappedComponent) {
      var t = undefined,
          i18n = undefined;

      var Translate = function (_Component) {
        babelHelpers.inherits(Translate, _Component);

        function Translate(props, context) {
          babelHelpers.classCallCheck(this, Translate);

          var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Translate).call(this, props, context));

          i18n = context.i18n;

          _this.state = {
            i18nLoadedAt: null
          };
          return _this;
        }

        babelHelpers.createClass(Translate, [{
          key: 'getChildContext',
          value: function getChildContext() {
            return { t: t };
          }
        }, {
          key: 'componentWillMount',
          value: function componentWillMount() {
            this.mounted = true;
            i18n.loadNamespaces(namespaces);
            t = i18n.getFixedT(null, namespaces);
          }
        }, {
          key: 'componentDidMount',
          value: function componentDidMount() {
            var _this2 = this;

            this.onI18nChanged = function () {
              if (!_this2.mounted) return;

              _this2.setState({ i18nLoadedAt: new Date() });
            };

            i18n.on('languageChanged loaded', this.onI18nChanged);
          }
        }, {
          key: 'componentWillUnmount',
          value: function componentWillUnmount() {
            this.mounted = false;
            if (this.onI18nChanged) {
              i18n.off('languageChanged', this.onI18nChanged);
              i18n.off('loaded', this.onI18nChanged);
            }
          }
        }, {
          key: 'onI18nChange',
          value: function onI18nChange() {
            if (!this.mounted) return;

            this.setState({ i18nLoadedAt: new Date() });
          }
        }, {
          key: 'render',
          value: function render() {
            var i18nLoadedAt = this.state.i18nLoadedAt;

            return React__default.createElement(WrappedComponent, babelHelpers.extends({}, this.props, { t: t, i18nLoadedAt: i18nLoadedAt }));
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

        if (!format || typeof format !== 'string') return React__default.createElement('noscript', null);;

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

  exports.translate = translate;
  exports.Interpolate = Interpolate;
  exports.I18nextProvider = I18nextProvider;

}));
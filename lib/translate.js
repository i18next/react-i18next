'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}

function translate(namespaces) {
  return function Wrapper(WrappedComponent) {
    var t = undefined,
        i18n = undefined;

    var Translate = (function (_Component) {
      _inherits(Translate, _Component);

      function Translate(props, context) {
        _classCallCheck(this, Translate);

        _get(Object.getPrototypeOf(Translate.prototype), 'constructor', this).call(this, props, context);
        i18n = context.i18n;

        this.state = {
          i18nLoadedAt: null
        };
      }

      _createClass(Translate, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          this.mounted = true;
          i18n.loadNamespaces(namespaces);
          t = i18n.getFixedT(null, namespaces);
        }
      }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
          var _this = this;

          this.onI18nChanged = function () {
            if (!_this.mounted) return;

            _this.setState({ i18nLoadedAt: new Date() });
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

          return _react2['default'].createElement(WrappedComponent, _extends({}, this.props, { t: t, i18nLoadedAt: i18nLoadedAt }));
        }
      }]);

      return Translate;
    })(_react.Component);

    Translate.contextTypes = {
      i18n: _react.PropTypes.object.isRequired
    };

    Translate.displayName = 'Translate[' + getDisplayName(WrappedComponent) + ']';

    return Translate;
  };
}

exports['default'] = translate;
module.exports = exports['default'];
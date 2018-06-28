var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';

var Interpolate = function (_Component) {
  _inherits(Interpolate, _Component);

  function Interpolate(props, context) {
    _classCallCheck(this, Interpolate);

    var _this = _possibleConstructorReturn(this, (Interpolate.__proto__ || Object.getPrototypeOf(Interpolate)).call(this, props, context));

    _this.i18n = props.i18n || context.i18n;
    _this.t = props.t || context.t;
    return _this;
  }

  _createClass(Interpolate, [{
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

      if (!format || typeof format !== 'string') return React.createElement('noscript', null);

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
            child = React.createElement(dangerouslySetInnerHTMLPartElement, { dangerouslySetInnerHTML: { __html: match } });
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

      return React.createElement.apply(this, [parent, additionalProps].concat(children));
    }
  }]);

  return Interpolate;
}(Component);

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

export default Interpolate;
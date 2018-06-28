var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import HTML from 'html-parse-stringify2';

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
    } else if (React.isValidElement(child)) {
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
  var ast = HTML.parse('<0>' + targetString + '</0>');

  function mapAST(reactNodes, astNodes) {
    if (Object.prototype.toString.call(reactNodes) !== '[object Array]') reactNodes = [reactNodes];
    if (Object.prototype.toString.call(astNodes) !== '[object Array]') astNodes = [astNodes];

    return astNodes.reduce(function (mem, node, i) {
      if (node.type === 'tag') {
        var child = reactNodes[parseInt(node.name, 10)] || {};
        var isElement = React.isValidElement(child);

        if (typeof child === 'string') {
          mem.push(child);
        } else if (hasChildren(child)) {
          var inner = mapAST(getChildren(child), node.children);
          if (child.dummy) child.children = inner; // needed on preact!
          mem.push(React.cloneElement(child, _extends({}, child.props, { key: i }), inner));
        } else if ((typeof child === 'undefined' ? 'undefined' : _typeof(child)) === 'object' && !isElement) {
          var interpolated = i18n.services.interpolator.interpolate(node.children[0].content, child, i18n.language);
          mem.push(interpolated);
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
  _inherits(Trans, _React$Component);

  function Trans() {
    _classCallCheck(this, Trans);

    return _possibleConstructorReturn(this, (Trans.__proto__ || Object.getPrototypeOf(Trans)).apply(this, arguments));
  }

  _createClass(Trans, [{
    key: 'render',
    value: function render() {
      var contextAndProps = _extends({ i18n: this.context.i18n, t: this.context.t }, this.props);

      var children = contextAndProps.children,
          count = contextAndProps.count,
          parent = contextAndProps.parent,
          i18nKey = contextAndProps.i18nKey,
          tOptions = contextAndProps.tOptions,
          values = contextAndProps.values,
          defaults = contextAndProps.defaults,
          components = contextAndProps.components,
          namespace = contextAndProps.ns,
          i18n = contextAndProps.i18n,
          tFromContextAndProps = contextAndProps.t,
          additionalProps = _objectWithoutProperties(contextAndProps, ['children', 'count', 'parent', 'i18nKey', 'tOptions', 'values', 'defaults', 'components', 'ns', 'i18n', 't']);

      var t = tFromContextAndProps || i18n.t.bind(i18n);

      var reactI18nextOptions = i18n.options && i18n.options.react || {};
      var useAsParent = parent !== undefined ? parent : reactI18nextOptions.defaultTransParent;

      var defaultValue = defaults || nodesToString('', children, 0) || undefined;
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

      return React.createElement(useAsParent, additionalProps, renderNodes(components || children, translation, i18n));
    }
  }]);

  return Trans;
}(React.Component);

export default Trans;


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
  i18n: PropTypes.object.isRequired,
  t: PropTypes.func
};
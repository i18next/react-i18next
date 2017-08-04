import React from 'react';
import PropTypes from 'prop-types';

function hasChildren(node) {
  return node && (node.children || (node.props && node.props.children));
}

function getChildren(node) {
  return node && node.children ? node.children : node.props && node.props.children;
}

function nodesToString(mem, children, index) {
  if (Object.prototype.toString.call(children) !== '[object Array]') children = [children];

  children.forEach((child, i) => {
    // const isElement = React.isValidElement(child);
    // const elementKey = `${index !== 0 ? index + '-' : ''}${i}:${typeof child.type === 'function' ? child.type.name : child.type || 'var'}`;
    const elementKey = `${i}`;

    if (typeof child === 'string') {
      mem = `${mem}${child}`;
    } else if (hasChildren(child)) {
      mem = `${mem}<${elementKey}>${nodesToString('', getChildren(child), i + 1)}</${elementKey}>`;
    } else if (React.isValidElement(child)) {
      mem = `${mem}<${elementKey}></${elementKey}>`;
    } else if (typeof child === 'object') {
      const clone = { ...child };
      const format = clone.format;
      delete clone.format;

      const keys = Object.keys(clone);
      if (format && keys.length === 1) {
        mem = `${mem}<${elementKey}>{{${keys[0]}, ${format}}}</${elementKey}>`;
      } else if (keys.length === 1) {
        mem = `${mem}<${elementKey}>{{${keys[0]}}}</${elementKey}>`;
      }
    }
  });

  return mem;
}

const REGEXP = new RegExp('(?:<([^>]*)>(.*?)<\\/\\1>)', 'gi');
function renderNodes(children, targetString, i18n) {

  function parseChildren(nodes, str) {
    if (Object.prototype.toString.call(nodes) !== '[object Array]') nodes = [nodes];

    const toRender = str.split(REGEXP).reduce((mem, match, i) => {
      if (match) mem.push(match);
      return mem;
    }, []);

    return toRender.reduce((mem, part, i) => {
      // is a tag
      const isTag = !isNaN(part);
      let previousIsTag = i > 0 ? !isNaN(toRender[i - 1]) : false;
      if (previousIsTag) {
        const child = nodes[parseInt(toRender[i - 1], 10)] || {};
        if (React.isValidElement(child) && !hasChildren(child)) previousIsTag = false;
      }

      // will be rendered inside child
      if (previousIsTag) return mem;

      if (isTag) {
        const child = nodes[parseInt(part, 10)] || {};
        const isElement = React.isValidElement(child);

        if (typeof child === 'string') {
          mem.push(child);
        } else if (hasChildren(child)) {
          const inner = parseChildren(getChildren(child), toRender[i + 1]);

          mem.push(React.cloneElement(
            child,
            { ...child.props, key: i },
            inner
          ));
        } else if (typeof child === 'object' && !isElement) {
          const interpolated = i18n.services.interpolator.interpolate(toRender[i + 1], child, i18n.language);
          mem.push(interpolated);
        } else {
          mem.push(child);
        }
      }

      // no element just a string
      if (!isTag && !previousIsTag) mem.push(part);

      return mem;
    }, []);
  }

  return parseChildren(children, targetString);
}


export default class Trans extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.i18n = context.i18n;
    this.t = context.t;
  }

  componentDidMount() {

  }

  render() {
    const { children, count, parent } = this.props;

    const defaultValue = nodesToString('', children, 0);
    const key = this.props.i18nKey || defaultValue;
    const translation = this.t(key, { interpolation: { prefix: '#$?', suffix: '?$#' }, defaultValue, count });

    const additionalProps = {};
    if (this.i18n.options.react && this.i18n.options.react.exposeNamespace) {
      let ns = typeof this.t.ns === 'string' ? this.t.ns : this.t.ns[0];
      if (this.props.i18nKey && this.i18n.options.nsSeparator && this.props.i18nKey.indexOf(this.i18n.options.nsSeparator) > -1) {
        const parts = this.props.i18nKey.split(this.i18n.options.nsSeparator);
        ns = parts[0];
      }
      if (this.t.ns) additionalProps['data-i18next-options'] = JSON.stringify({ ns });
    }

    return React.createElement(
      parent,
      additionalProps,
      renderNodes(children, translation, this.i18n)
    );
  }
}

Trans.propTypes = {
  count: PropTypes.number,
  parent: PropTypes.string,
  i18nKey: PropTypes.string
};

Trans.defaultProps = {
  parent: 'div',
};

Trans.contextTypes = {
  i18n: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

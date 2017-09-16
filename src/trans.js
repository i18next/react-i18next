import React from 'react';
import PropTypes from 'prop-types';
import HTML from 'html-parse-stringify2';

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

function renderNodes(children, targetString, i18n) {

  // parse ast from string with additional wrapper tag
  // -> avoids issues in parser removing prepending text nodes
  const ast = HTML.parse(`<0>${targetString}</0>`);

  function mapAST(reactNodes, astNodes) {
    if (Object.prototype.toString.call(reactNodes) !== '[object Array]') reactNodes = [reactNodes];
    if (Object.prototype.toString.call(astNodes) !== '[object Array]') astNodes = [astNodes];

    return astNodes.reduce((mem, node, i) => {
      if (node.type === 'tag') {
        const child = reactNodes[parseInt(node.name, 10)] || {};
        const isElement = React.isValidElement(child);

        if (typeof child === 'string') {
          mem.push(child);
        } else if (hasChildren(child)) {
          const inner = mapAST(getChildren(child), node.children);

          mem.push(React.cloneElement(
            child,
            { ...child.props, key: i },
            inner
          ));
        } else if (typeof child === 'object' && !isElement) {
          const interpolated = i18n.services.interpolator.interpolate(node.children[0].content, child, i18n.language);
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
  const result = mapAST([{ children }], ast);
  return result[0].props.children;
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
    const { children, count, parent, i18nKey, ...additionalProps } = this.props;

    const defaultValue = nodesToString('', children, 0);
    const key = i18nKey || defaultValue;
    const translation = this.t(key, { interpolation: { prefix: '#$?', suffix: '?$#' }, defaultValue, count });

    if (this.i18n.options.react && this.i18n.options.react.exposeNamespace) {
      let ns = typeof this.t.ns === 'string' ? this.t.ns : this.t.ns[0];
      if (i18nKey && this.i18n.options.nsSeparator && i18nKey.indexOf(this.i18n.options.nsSeparator) > -1) {
        const parts = i18nKey.split(this.i18n.options.nsSeparator);
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
  parent: 'div'
};

Trans.contextTypes = {
  i18n: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

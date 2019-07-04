import React, { useContext } from 'react';
import HTML from 'html-parse-stringify2';
import { getI18n, getHasUsedI18nextProvider, I18nContext, getDefaults } from './context';
import { warn, warnOnce } from './utils';

function hasChildren(node) {
  return node && (node.children || (node.props && node.props.children));
}

function getChildren(node) {
  if (!node) return [];
  return node && node.children ? node.children : node.props && node.props.children;
}

function hasValidReactChildren(children) {
  if (Object.prototype.toString.call(children) !== '[object Array]') return false;
  return children.every(child => React.isValidElement(child));
}

export function nodesToString(mem, children, index, i18nOptions) {
  if (!children) return '';
  if (Object.prototype.toString.call(children) !== '[object Array]') children = [children];
  const keepArray = i18nOptions.transKeepBasicHtmlNodesFor || [];

  children.forEach((child, i) => {
    // const isElement = React.isValidElement(child);
    // const elementKey = `${index !== 0 ? index + '-' : ''}${i}:${typeof child.type === 'function' ? child.type.name : child.type || 'var'}`;
    const elementKey = `${i}`;

    if (typeof child === 'string') {
      mem = `${mem}${child}`;
    } else if (hasChildren(child)) {
      const elementTag =
        keepArray.indexOf(child.type) > -1 &&
        Object.keys(child.props).length === 1 &&
        typeof hasChildren(child) === 'string'
          ? child.type
          : elementKey;

      if (child.props && child.props.i18nIsDynamicList) {
        // we got a dynamic list like "<ul>{['a', 'b'].map(item => ( <li key={item}>{item}</li> ))}</ul>""
        // the result should be "<0></0>" and not "<0><0>a</0><1>b</1></0>"
        mem = `${mem}<${elementTag}></${elementTag}>`;
      } else {
        // regular case mapping the inner children
        mem = `${mem}<${elementTag}>${nodesToString(
          '',
          getChildren(child),
          i + 1,
          i18nOptions,
        )}</${elementTag}>`;
      }
    } else if (React.isValidElement(child)) {
      if (keepArray.indexOf(child.type) > -1 && Object.keys(child.props).length === 0) {
        mem = `${mem}<${child.type}/>`;
      } else {
        mem = `${mem}<${elementKey}></${elementKey}>`;
      }
    } else if (typeof child === 'object') {
      const clone = { ...child };
      const format = clone.format;
      delete clone.format;

      const keys = Object.keys(clone);
      if (format && keys.length === 1) {
        mem = `${mem}{{${keys[0]}, ${format}}}`;
      } else if (keys.length === 1) {
        mem = `${mem}{{${keys[0]}}}`;
      } else {
        // not a valid interpolation object (can only contain one value plus format)
        warn(
          `react-i18next: the passed in object contained more than one variable - the object should look like {{ value, format }} where format is optional.`,
          child,
        );
      }
    } else {
      warn(
        `Trans: the passed in value is invalid - seems you passed in a variable like {number} - please pass in variables for interpolation as full objects like {{number}}.`,
        child,
      );
    }
  });

  return mem;
}

function renderNodes(children, targetString, i18n, i18nOptions, combinedTOpts) {
  if (targetString === '') return [];

  // check if contains tags we need to replace from html string to react nodes
  const keepArray = i18nOptions.transKeepBasicHtmlNodesFor || [];
  const emptyChildrenButNeedsHandling =
    targetString && new RegExp(keepArray.join('|')).test(targetString);

  // no need to replace tags in the targetstring
  if (!children && !emptyChildrenButNeedsHandling) return [targetString];

  // v2 -> interpolates upfront no need for "some <0>{{var}}</0>"" -> will be just "some {{var}}" in translation file
  const data = {};
  function getData(childs) {
    if (Object.prototype.toString.call(childs) !== '[object Array]') childs = [childs];
    childs.forEach(child => {
      if (typeof child === 'string') return;
      if (hasChildren(child)) getData(getChildren(child));
      else if (typeof child === 'object' && !React.isValidElement(child))
        Object.assign(data, child);
    });
  }
  getData(children);
  targetString = i18n.services.interpolator.interpolate(
    targetString,
    { ...data, ...combinedTOpts },
    i18n.language,
  );

  // parse ast from string with additional wrapper tag
  // -> avoids issues in parser removing prepending text nodes
  const ast = HTML.parse(`<0>${targetString}</0>`);

  function mapAST(reactNodes, astNodes) {
    if (Object.prototype.toString.call(reactNodes) !== '[object Array]') reactNodes = [reactNodes];
    if (Object.prototype.toString.call(astNodes) !== '[object Array]') astNodes = [astNodes];

    return astNodes.reduce((mem, node, i) => {
      const translationContent = node.children && node.children[0] && node.children[0].content;
      if (node.type === 'tag') {
        const child = reactNodes[parseInt(node.name, 10)] || {};
        const isElement = React.isValidElement(child);

        if (typeof child === 'string') {
          mem.push(child);
        } else if (hasChildren(child)) {
          const childs = getChildren(child);
          const mappedChildren = mapAST(childs, node.children);
          const inner =
            hasValidReactChildren(childs) && mappedChildren.length === 0 ? childs : mappedChildren;

          if (child.dummy) child.children = inner; // needed on preact!
          mem.push(React.cloneElement(child, { ...child.props, key: i }, inner));
        } else if (
          emptyChildrenButNeedsHandling &&
          typeof child === 'object' &&
          child.dummy &&
          !isElement
        ) {
          // we have a empty Trans node (the dummy element) with a targetstring that contains html tags needing
          // conversion to react nodes
          // so we just need to map the inner stuff
          const inner = mapAST(reactNodes /* wrong but we need something */, node.children);
          mem.push(React.cloneElement(child, { ...child.props, key: i }, inner));
        } else if (isNaN(node.name) && i18nOptions.transSupportBasicHtmlNodes) {
          if (node.voidElement) {
            mem.push(React.createElement(node.name, { key: `${node.name}-${i}` }));
          } else {
            const inner = mapAST(reactNodes /* wrong but we need something */, node.children);

            mem.push(React.createElement(node.name, { key: `${node.name}-${i}` }, inner));
          }
        } else if (typeof child === 'object' && !isElement) {
          const content = node.children[0] ? translationContent : null;

          // v1
          // as interpolation was done already we just have a regular content node
          // in the translation AST while having an object in reactNodes
          // -> push the content no need to interpolate again
          if (content) mem.push(content);
        } else if (node.children.length === 1 && translationContent) {
          // If component does not have children, but translation - has
          // with this in component could be components={[<span class='make-beautiful'/>]} and in translation - 'some text <0>some highlighted message</0>'
          mem.push(React.cloneElement(child, { ...child.props, key: i }, translationContent));
        } else {
          mem.push(React.cloneElement(child, { ...child.props, key: i }));
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
  const result = mapAST([{ dummy: true, children }], ast);
  return getChildren(result[0]);
}

export function Trans({
  children,
  count,
  parent,
  i18nKey,
  tOptions,
  values,
  defaults,
  components,
  ns,
  i18n: i18nFromProps,
  t: tFromProps,
  ...additionalProps
}) {
  const { i18n: i18nFromContext, defaultNS: defaultNSFromContext } = getHasUsedI18nextProvider()
    ? useContext(I18nContext) || {}
    : {};
  const i18n = i18nFromProps || i18nFromContext || getI18n();
  if (!i18n) {
    warnOnce('You will need pass in an i18next instance by using i18nextReactModule');
    return children;
  }

  const t = tFromProps || i18n.t.bind(i18n) || (k => k);

  const reactI18nextOptions = { ...getDefaults(), ...(i18n.options && i18n.options.react) };
  const useAsParent = parent !== undefined ? parent : reactI18nextOptions.defaultTransParent;

  // prepare having a namespace
  let namespaces = ns || t.ns || defaultNSFromContext || (i18n.options && i18n.options.defaultNS);
  namespaces = typeof namespaces === 'string' ? [namespaces] : namespaces || ['translation'];

  const defaultValue =
    defaults ||
    nodesToString('', children, 0, reactI18nextOptions) ||
    reactI18nextOptions.transEmptyNodeValue;
  const { hashTransKey } = reactI18nextOptions;
  const key = i18nKey || (hashTransKey ? hashTransKey(defaultValue) : defaultValue);
  const interpolationOverride = values ? {} : { interpolation: { prefix: '#$?', suffix: '?$#' } };
  const combinedTOpts = {
    ...tOptions,
    ...values,
    ...interpolationOverride,
    defaultValue,
    count,
    ns: namespaces,
  };
  const translation = key ? t(key, combinedTOpts) : defaultValue;

  if (!useAsParent)
    return renderNodes(
      components || children,
      translation,
      i18n,
      reactI18nextOptions,
      combinedTOpts,
    );

  return React.createElement(
    useAsParent,
    additionalProps,
    renderNodes(components || children, translation, i18n, reactI18nextOptions, combinedTOpts),
  );
}

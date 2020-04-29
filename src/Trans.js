import { useContext, isValidElement, createElement, cloneElement } from 'react';
import { parse } from 'html-parse-stringify2';
import { getI18n, I18nContext, getDefaults } from './context';
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
  return children.every(child => isValidElement(child));
}

// React.Children.toArray cannot replace this, will fail at a child of object type
function getAsArray(data) {
  return Array.isArray(data) ? data : [data];
}

export function nodesToString(children, i18nOptions) {
  if (!children) return '';
  let stringNode = '';
  const keepArray = i18nOptions.transKeepBasicHtmlNodesFor || [];

  // e.g. lorem <br/> ipsum {{ messageCount, format }} dolor <strong>bold</strong> amet
  getAsArray(children).forEach((child, childIndex) => {
    if (typeof child === 'string') {
      // actual e.g. lorem
      // expected e.g. lorem
      stringNode += `${child}`;
    } else if (isValidElement(child)) {
      const childPropsCount = Object.keys(child.props).length;
      const shouldKeepChild = keepArray.indexOf(child.type) > -1;
      const childChildren = child.props.children;

      if (!childChildren && shouldKeepChild && childPropsCount === 0) {
        // actual e.g. lorem <br/> ipsum
        // expected e.g. lorem <br/> ipsum
        stringNode += `<${child.type}/>`;
      } else if (!childChildren && (!shouldKeepChild || childPropsCount !== 0)) {
        // actual e.g. lorem <hr className="test" /> ipsum
        // expected e.g. lorem <0></0> ipsum
        stringNode += `<${childIndex}></${childIndex}>`;
      } else if (child.props.i18nIsDynamicList) {
        // we got a dynamic list like
        // e.g. <ul i18nIsDynamicList>{['a', 'b'].map(item => ( <li key={item}>{item}</li> ))}</ul>
        // expected e.g. "<0></0>", not e.g. "<0><0>a</0><1>b</1></0>"
        stringNode += `<${childIndex}></${childIndex}>`;
      } else if (shouldKeepChild && childPropsCount === 1 && typeof childChildren === 'string') {
        // actual e.g. dolor <strong>bold</strong> amet
        // expected e.g. dolor <strong>bold</strong> amet
        stringNode += `<${child.type}>${childChildren}</${child.type}>`;
      } else {
        // regular case mapping the inner children
        const content = nodesToString(childChildren, i18nOptions);
        stringNode += `<${childIndex}>${content}</${childIndex}>`;
      }
    } else if (typeof child === 'object') {
      // e.g. lorem {{ value, format }} ipsum
      const { format, ...clone } = child;
      const keys = Object.keys(clone);

      if (keys.length === 1) {
        const value = format ? `${keys[0]}, ${format}` : keys[0];
        stringNode += `{{${value}}}`;
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

  return stringNode;
}

function renderNodes(componentsOrChildren, targetString = '', i18n, i18nOptions, combinedTOpts) {
  if (targetString === '') return [];

  const keepArray = i18nOptions.transKeepBasicHtmlNodesFor || [];
  // check if contains tags we need to replace from html string to react nodes
  const foundTagNames = new RegExp(keepArray.join('|')).test(targetString);

  // no need to replace tags in the `targetString`
  if (!componentsOrChildren && !foundTagNames) return [targetString];

  // v2 -> interpolates upfront no need for "some <0>{{var}}</0>"" -> will be just "some {{var}}" in translation file
  const data = {};

  function getData(children = []) {
    getAsArray(children).forEach(child => {
      if (isValidElement(child)) {
        getData(child.props.children);
      } else if (typeof child === 'object') {
        Object.assign(data, child);
      }
    });
  }

  getData(componentsOrChildren);

  const interpolatedString = i18n.services.interpolator.interpolate(
    targetString,
    { ...data, ...combinedTOpts },
    i18n.language,
    {},
  );

  function mapAST(reactNode, astNode) {
    const reactNodes = getAsArray(reactNode);
    const astNodes = getAsArray(astNode);

    return astNodes.reduce((mem, node, i) => {
      // we don't use `html-parse-stringify2`, `components` option, get rid of it first
      if (node.type === 'component') return mem;
      if (node.type === 'text') {
        mem.push(node.content);
        return mem;
      }

      /**
       * node.type === 'tag' left to analyze
       * https://github.com/rayd/html-parse-stringify2#1-tag
       */

      const translationContent = node.children[0] && node.children[0].content;
      const child = reactNodes[parseInt(node.name, 10)] || {};
      const isElement = isValidElement(child);

      if (typeof child === 'string') {
        mem.push(child);
      } else if (hasChildren(child)) {
        const children = getChildren(child);
        const mappedChildren = mapAST(children, node.children);
        const inner =
          hasValidReactChildren(children) && mappedChildren.length === 0
            ? children
            : mappedChildren;

        if (child.dummy) child.children = inner; // needed on preact!
        mem.push(cloneElement(child, { ...child.props, key: i }, inner));
      } else if (foundTagNames && typeof child === 'object' && child.dummy && !isElement) {
        // we have a empty Trans node (the dummy element) with a targetstring that contains html tags needing
        // conversion to react nodes
        // so we just need to map the inner stuff
        const inner = mapAST(reactNodes /* wrong but we need something */, node.children);
        mem.push(cloneElement(child, { ...child.props, key: i }, inner));
      } else if (Number.isNaN(parseFloat(node.name))) {
        if (i18nOptions.transSupportBasicHtmlNodes && keepArray.indexOf(node.name) > -1) {
          if (node.voidElement) {
            mem.push(createElement(node.name, { key: `${node.name}-${i}` }));
          } else {
            const inner = mapAST(reactNodes /* wrong but we need something */, node.children);

            mem.push(createElement(node.name, { key: `${node.name}-${i}` }, inner));
          }
        } else if (node.voidElement) {
          mem.push(`<${node.name} />`);
        } else {
          const inner = mapAST(reactNodes /* wrong but we need something */, node.children);

          mem.push(`<${node.name}>${inner}</${node.name}>`);
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
        mem.push(cloneElement(child, { ...child.props, key: i }, translationContent));
      } else {
        mem.push(cloneElement(child, { ...child.props, key: i }));
      }
      return mem;
    }, []);
  }

  // call mapAST with having react nodes nested into additional node like
  const result = mapAST(
    [{ dummy: true, children: componentsOrChildren }],
    // parse ast from string with additional wrapper tag
    // -> avoids issues in parser removing prepending text nodes
    parse(`<0>${interpolatedString}</0>`),
  );

  // return the children of that extra node to get expected result
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
  const { i18n: i18nFromContext, defaultNS: defaultNSFromContext } = useContext(I18nContext) || {};
  const i18n = i18nFromProps || i18nFromContext || getI18n();

  if (!i18n) {
    warnOnce('You will need pass in an i18next instance by using i18nextReactModule');
    return children;
  }

  const t = tFromProps || i18n.t.bind(i18n) || (k => k);

  const reactI18nextOptions = { ...getDefaults(), ...(i18n.options && i18n.options.react) };

  // prepare having a namespace
  let namespaces = ns || t.ns || defaultNSFromContext || (i18n.options && i18n.options.defaultNS);
  namespaces = typeof namespaces === 'string' ? [namespaces] : namespaces || ['translation'];

  const defaultValue =
    defaults ||
    nodesToString(children, reactI18nextOptions) ||
    reactI18nextOptions.transEmptyNodeValue ||
    i18nKey;
  const { hashTransKey } = reactI18nextOptions;
  const key = i18nKey || (hashTransKey ? hashTransKey(defaultValue) : defaultValue);
  const interpolationOverride = values ? {} : { interpolation: { prefix: '#$?', suffix: '?$#' } };
  const combinedTOpts = {
    ...tOptions,
    count,
    ...values,
    ...interpolationOverride,
    defaultValue,
    ns: namespaces,
  };
  const translation = key ? t(key, combinedTOpts) : defaultValue;

  const content = renderNodes(
    components || children,
    translation,
    i18n,
    reactI18nextOptions,
    combinedTOpts,
  );

  // allows user to pass `null` to `parent`
  // and override `defaultTransParent` if is present
  const useAsParent = parent !== undefined ? parent : reactI18nextOptions.defaultTransParent;

  return useAsParent ? createElement(useAsParent, additionalProps, content) : content;
}

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('i18next')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'i18next'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ReactI18next = {}, global.React, global.i18next));
})(this, (function (exports, React, i18next) { 'use strict';

  const voidElements = {
    area: true,
    base: true,
    br: true,
    col: true,
    embed: true,
    hr: true,
    img: true,
    input: true,
    link: true,
    meta: true,
    param: true,
    source: true,
    track: true,
    wbr: true,
    '!doctype': true,
    '!DOCTYPE': true
  };
  const attrRE = /\s([^'"/\s><]+?)[\s/>]|([^\s=]+)=\s?("[^"]*"|'[^']*')/g;
  function parseTag(tag) {
    const res = {
      type: 'tag',
      name: '',
      voidElement: false,
      attrs: {},
      children: []
    };
    const tagMatch = tag.match(/<\/?([^\s]+?)[/\s>]/);
    if (tagMatch) {
      res.name = tagMatch[1];
      if (voidElements[tagMatch[1]] || tag.charAt(tag.length - 2) === '/') {
        res.voidElement = true;
      }
      if (res.name.startsWith('!--')) {
        const endIndex = tag.indexOf('-->');
        return {
          type: 'comment',
          comment: endIndex !== -1 ? tag.slice(4, endIndex) : ''
        };
      }
    }
    const reg = new RegExp(attrRE);
    let result = null;
    for (;;) {
      result = reg.exec(tag);
      if (result === null) {
        break;
      }
      if (!result[0].trim()) {
        continue;
      }
      if (result[1]) {
        const attr = result[1].trim();
        let arr = [attr, null];
        const eq = attr.indexOf('=');
        if (eq > -1) {
          arr = [attr.slice(0, eq), attr.slice(eq + 1)];
        }
        res.attrs[arr[0]] = arr[1];
        reg.lastIndex--;
      } else if (result[2]) {
        res.attrs[result[2]] = result[3].trim().substring(1, result[3].length - 1);
      }
    }
    return res;
  }
  const tagRE = /<!--[\s\S]*?-->|<[a-zA-Z0-9\-!/](?:"[^"]*"|'[^']*'|[^'">])*>/g;
  const tagNameRE = /<\/?([^\s]+?)[/\s>]/;
  const whitespaceRE = /^\s*$/;
  const rawTextRE = /^(script|style)$/i;
  const sentinel = '\u0000';
  const empty = Object.create(null);
  function restoreSentinels(nodes) {
    nodes.forEach(function (node) {
      if (node.type === 'text') {
        node.content = node.content.split(sentinel).join('<');
        return;
      }
      if (node.type === 'comment') {
        node.comment = node.comment.split(sentinel).join('<');
        return;
      }
      for (const key in node.attrs) {
        const value = node.attrs[key];
        if (typeof value === 'string' && value.indexOf(sentinel) > -1) {
          node.attrs[key] = value.split(sentinel).join('<');
        }
      }
      if (node.children.length) {
        restoreSentinels(node.children);
      }
    });
  }
  function parse(html, options) {
    const components = options && options.components || empty;
    const allowedTags = options && options.allowedTags;
    let restoreNeeded = false;
    if (allowedTags) {
      const isAllowed = typeof allowedTags === 'function' ? allowedTags : function (name) {
        return allowedTags.indexOf(name) > -1;
      };
      let out = '';
      let pos = 0;
      tagRE.lastIndex = 0;
      let am;
      while (am = tagRE.exec(html)) {
        const tag = am[0];
        out += html.slice(pos, am.index);
        const nameMatch = tag.match(tagNameRE);
        if (tag.startsWith('<!--') || nameMatch && isAllowed(nameMatch[1])) {
          out += tag;
          pos = am.index + tag.length;
        } else {
          restoreNeeded = true;
          out += sentinel;
          pos = am.index + 1;
          tagRE.lastIndex = pos;
        }
      }
      html = out + html.slice(pos);
    }
    const result = [];
    const arr = [];
    let current;
    let level = -1;
    let inComponent = false;
    let rawUntil = 0;
    let htmlLower;
    if (html.indexOf('<') !== 0) {
      const end = html.indexOf('<');
      result.push({
        type: 'text',
        content: end === -1 ? html : html.substring(0, end)
      });
    }
    const matches = [];
    let m;
    while (m = tagRE.exec(html)) {
      matches.push(m);
    }
    matches.forEach(function (match, i) {
      const tag = match[0];
      if (!tag) return;
      if (tag.startsWith('<!--')) return;
      let lts = 0;
      let gts = 0;
      let secondLt = -1;
      let quote = null;
      for (let j = 0; j < tag.length; j++) {
        const c = tag.charAt(j);
        if (quote) {
          if (c === quote) quote = null;
        } else if (c === '"' || c === "'") {
          quote = c;
        } else if (c === '<') {
          lts++;
          if (lts === 2) secondLt = j;
        } else if (c === '>') {
          gts++;
        }
      }
      const validSplit = secondLt > -1 && /[a-zA-Z0-9\-!/]/.test(tag.charAt(secondLt + 1));
      if (lts > gts && validSplit) {
        const firstPart = tag.substring(0, secondLt);
        const secondPart = tag.substring(firstPart.length);
        matches[i][0] = secondPart;
        matches[i].index += firstPart.length;
      }
    });
    matches.forEach(function (match, i) {
      const tag = match[0];
      if (!tag) return;
      const index = match.index;
      if (index < rawUntil) return;
      if (inComponent) {
        if (tag !== '</' + current.name + '>') {
          return;
        } else {
          inComponent = false;
        }
      }
      const isOpen = tag.charAt(1) !== '/';
      const isComment = tag.startsWith('<!--');
      const start = index + tag.length;
      const nextChar = html.charAt(start);
      const nextMatch = matches[i + 1];
      let isText;
      if (nextChar === '<' && nextMatch) {
        const nextTag = html.substring(start, nextMatch.index);
        isText = nextTag.split('<').length > nextTag.split('>').length;
      }
      let parent;
      if (isComment) {
        const comment = parseTag(tag);
        if (level < 0) {
          result.push(comment);
          return result;
        }
        parent = arr[level];
        parent.children.push(comment);
        const text = html.slice(start, nextMatch ? nextMatch.index : undefined);
        if (text.length > 0) {
          parent.children.push({
            type: 'text',
            content: text
          });
        }
        return result;
      }
      if (isOpen) {
        level++;
        current = parseTag(tag);
        if (current.type === 'tag' && components[current.name]) {
          current.type = 'component';
          inComponent = true;
        }
        let isRawText = false;
        if (!inComponent && !current.voidElement && rawTextRE.test(current.name)) {
          isRawText = true;
          htmlLower || (htmlLower = html.toLowerCase());
          const closeIndex = htmlLower.indexOf('</' + current.name.toLowerCase() + '>', start);
          const contentEnd = closeIndex === -1 ? html.length : closeIndex;
          const content = html.slice(start, contentEnd);
          if (content) {
            current.children.push({
              type: 'text',
              content
            });
          }
          rawUntil = contentEnd;
        }
        if (!current.voidElement && !inComponent && !isRawText && nextChar && nextChar !== '<') {
          current.children.push({
            type: 'text',
            content: html.slice(start, nextMatch ? nextMatch.index : undefined)
          });
        }
        if (level === 0) {
          result.push(current);
        }
        parent = arr[level - 1];
        if (parent) {
          parent.children.push(current);
        }
        arr[level] = current;
      }
      if (!isOpen || current.voidElement) {
        if (level > -1 && (current.voidElement || current.name === tag.slice(2, -1))) {
          level--;
          current = level === -1 ? result : arr[level];
        }
        if (!inComponent && (nextChar !== '<' || isText) && nextChar) {
          parent = level === -1 ? result : arr[level].children;
          const end = nextMatch ? nextMatch.index : -1;
          let content = html.slice(start, end === -1 ? undefined : end);
          if (whitespaceRE.test(content)) {
            content = ' ';
          }
          if (end > -1 && level + parent.length >= 0 || content !== ' ') {
            parent.push({
              type: 'text',
              content
            });
          }
        }
      }
    });
    if (restoreNeeded) {
      restoreSentinels(result);
    }
    return result;
  }
  function attrString(attrs) {
    const buff = [];
    for (const key in attrs) {
      if (attrs[key] === null) {
        buff.push(key);
      } else {
        buff.push(key + '="' + String(attrs[key]).replace(/"/g, '&quot;') + '"');
      }
    }
    if (!buff.length) {
      return '';
    }
    return ' ' + buff.join(' ');
  }
  function stringifyNode(buff, doc) {
    switch (doc.type) {
      case 'text':
        return buff + doc.content;
      case 'tag':
        {
          const tagEnd = doc.voidElement && doc.name.toLowerCase() !== '!doctype' ? '/>' : '>';
          buff += '<' + doc.name + (doc.attrs ? attrString(doc.attrs) : '') + tagEnd;
          if (doc.voidElement) {
            return buff;
          }
          return buff + doc.children.reduce(stringifyNode, '') + '</' + doc.name + '>';
        }
      case 'comment':
        buff += '<!--' + doc.comment + '-->';
        return buff;
    }
  }
  function stringify(doc) {
    return doc.reduce(function (token, rootEl) {
      return token + stringifyNode('', rootEl);
    }, '');
  }
  var index = {
    parse,
    stringify
  };

  const warn = (i18n, code, msg, rest) => {
    const args = [msg, {
      code,
      ...(rest || {})
    }];
    if (i18n?.services?.logger?.forward) {
      return i18n.services.logger.forward(args, 'warn', 'react-i18next::', true);
    }
    if (isString(args[0])) args[0] = `react-i18next:: ${args[0]}`;
    if (i18n?.services?.logger?.warn) {
      i18n.services.logger.warn(...args);
    } else if (console?.warn) {
      console.warn(...args);
    }
  };
  const warnedFor = new WeakMap();
  const warnedWithoutInstance = new Set();
  const warnOnce = (i18n, code, msg, rest) => {
    if (isString(msg)) {
      let warned = warnedWithoutInstance;
      const owner = i18n?.services?.logger || i18n;
      if (isObject(owner)) {
        warned = warnedFor.get(owner);
        if (!warned) warnedFor.set(owner, warned = new Set());
      }
      if (warned.has(msg)) return;
      warned.add(msg);
    }
    warn(i18n, code, msg, rest);
  };
  const inDevelopment = () => {
    try {
      return "development" !== 'production';
    } catch (e) {
      return false;
    }
  };
  const loadedClb = (i18n, cb) => () => {
    if (i18n.isInitialized) {
      cb();
    } else {
      i18n.once('initialized', () => cb());
    }
  };
  const loadNamespaces = (i18n, ns, cb) => {
    i18n.loadNamespaces(ns, loadedClb(i18n, cb));
  };
  const loadLanguages = (i18n, lng, ns, cb) => {
    if (isString(ns)) ns = [ns];
    if (i18n.options.preload && i18n.options.preload.indexOf(lng) > -1) return loadNamespaces(i18n, ns, cb);
    ns.forEach(n => {
      if (i18n.options.ns.indexOf(n) < 0) i18n.options.ns.push(n);
    });
    i18n.loadLanguages(lng, loadedClb(i18n, cb));
  };
  const hasLoadedNamespace = (ns, i18n, options = {}) => {
    if (!i18n.languages || !i18n.languages.length) {
      warnOnce(i18n, 'NO_LANGUAGES', 'i18n.languages were undefined or empty', {
        languages: i18n.languages
      });
      return true;
    }
    return i18n.hasLoadedNamespace(ns, {
      lng: options.lng,
      precheck: (i18nInstance, loadNotPending) => {
        if (options.bindI18n && options.bindI18n.indexOf('languageChanging') > -1 && i18nInstance.services.backendConnector.backend && i18nInstance.isLanguageChangingTo && !loadNotPending(i18nInstance.isLanguageChangingTo, ns)) return false;
      }
    });
  };
  const getDisplayName = Component => Component.displayName || Component.name || (isString(Component) && Component.length > 0 ? Component : 'Unknown');
  const isString = obj => typeof obj === 'string';
  const isObject = obj => typeof obj === 'object' && obj !== null;
  const getFormatPlugin = i18n => {
    const plugin = i18n?.services?.i18nFormat;
    return typeof plugin?.parse === 'function' ? plugin : undefined;
  };
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  const escapeStringValues = values => {
    if (!values) return values;
    const escaped = {};
    Object.keys(values).forEach(k => {
      const v = values[k];
      escaped[k] = isString(v) ? v.replace(/[&<>"']/g, c => htmlEscapes[c]) : v;
    });
    return escaped;
  };

  const matchHtmlEntity = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g;
  const htmlEntities = {
    '&amp;': '&',
    '&#38;': '&',
    '&lt;': '<',
    '&#60;': '<',
    '&gt;': '>',
    '&#62;': '>',
    '&apos;': "'",
    '&#39;': "'",
    '&quot;': '"',
    '&#34;': '"',
    '&nbsp;': '\u00A0',
    '&#160;': '\u00A0',
    '&copy;': '©',
    '&#169;': '©',
    '&reg;': '®',
    '&#174;': '®',
    '&hellip;': '…',
    '&#8230;': '…',
    '&#x2F;': '/',
    '&#47;': '/'
  };
  const unescapeHtmlEntity = m => htmlEntities[m];
  const unescape = text => text.replace(matchHtmlEntity, unescapeHtmlEntity);

  let defaultOptions = {
    bindI18n: 'languageChanged',
    bindI18nStore: '',
    transEmptyNodeValue: '',
    transSupportBasicHtmlNodes: true,
    transWrapTextNodes: '',
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
    useSuspense: true,
    unescape,
    transDefaultProps: undefined
  };
  const setDefaults = (options = {}) => {
    defaultOptions = {
      ...defaultOptions,
      ...options
    };
  };
  const getDefaults = () => defaultOptions;

  let i18nInstance;
  const setI18n = instance => {
    i18nInstance = instance;
  };
  const getI18n = () => i18nInstance;

  const hasChildren = (node, checkLength) => {
    if (!node) return false;
    const base = node.props?.children ?? node.children;
    if (checkLength) return base.length > 0;
    return !!base;
  };
  const getChildren = node => {
    if (!node) return [];
    const children = node.props?.children ?? node.children;
    return node.props?.i18nIsDynamicList ? getAsArray(children) : children;
  };
  const hasValidReactChildren = children => getAsArray(children).every(React.isValidElement);
  const getAsArray = data => Array.isArray(data) ? data : [data];
  const mergeProps = (source, target) => {
    const newTarget = {
      ...target
    };
    newTarget.props = {
      ...target.props,
      ...source.props
    };
    return newTarget;
  };
  const getValuesFromChildren = children => {
    const values = {};
    if (!children) return values;
    const getData = childs => {
      const childrenArray = getAsArray(childs);
      childrenArray.forEach(child => {
        if (isString(child)) return;
        if (hasChildren(child)) getData(getChildren(child));else if (isObject(child) && !React.isValidElement(child)) Object.assign(values, child);
      });
    };
    getData(children);
    return values;
  };
  const nodesToString = (children, i18nOptions, i18n, i18nKey) => {
    if (!children) return '';
    let stringNode = '';
    const childrenArray = getAsArray(children);
    const keepArray = i18nOptions?.transSupportBasicHtmlNodes ? i18nOptions.transKeepBasicHtmlNodesFor ?? [] : [];
    childrenArray.forEach((child, childIndex) => {
      if (isString(child)) {
        stringNode += `${child}`;
        return;
      }
      if (React.isValidElement(child)) {
        const {
          props,
          type
        } = child;
        const childPropsCount = Object.keys(props).length;
        const shouldKeepChild = keepArray.indexOf(type) > -1;
        const childChildren = props.children;
        if (!childChildren && shouldKeepChild && !childPropsCount) {
          stringNode += `<${type}/>`;
          return;
        }
        if (!childChildren && (!shouldKeepChild || childPropsCount) || props.i18nIsDynamicList) {
          stringNode += `<${childIndex}></${childIndex}>`;
          return;
        }
        if (shouldKeepChild && childPropsCount <= 1) {
          const cnt = isString(childChildren) ? childChildren : nodesToString(childChildren, i18nOptions, i18n, i18nKey);
          stringNode += `<${type}>${cnt}</${type}>`;
          return;
        }
        const content = nodesToString(childChildren, i18nOptions, i18n, i18nKey);
        stringNode += `<${childIndex}>${content}</${childIndex}>`;
        return;
      }
      if (child === null) {
        warn(i18n, 'TRANS_NULL_VALUE', `Passed in a null value as child`, {
          i18nKey
        });
        return;
      }
      if (isObject(child)) {
        const {
          format,
          ...clone
        } = child;
        const keys = Object.keys(clone);
        if (keys.length === 1) {
          const value = format ? `${keys[0]}, ${format}` : keys[0];
          stringNode += `{{${value}}}`;
          return;
        }
        if (!keys.length && Object.keys(child).length === 1 && 'format' in child) {
          stringNode += '{{format}}';
          return;
        }
        warn(i18n, 'TRANS_INVALID_OBJ', `Invalid child - Object should only have keys {{ value, format }} (format is optional).`, {
          i18nKey,
          child
        });
        return;
      }
      warn(i18n, 'TRANS_INVALID_VAR', `Passed in a variable like {number} - pass variables for interpolation as full objects like {{number}}.`, {
        i18nKey,
        child
      });
    });
    return stringNode;
  };
  const renderNodes = (children, knownComponentsMap, targetString, i18n, i18nOptions, combinedTOpts) => {
    if (targetString === '') return [];
    const keepArray = i18nOptions.transKeepBasicHtmlNodesFor || [];
    const emptyChildrenButNeedsHandling = targetString && new RegExp(keepArray.map(keep => `<${keep}`).join('|')).test(targetString);
    const unescapeFn = typeof i18nOptions.unescape === 'function' ? i18nOptions.unescape : getDefaults().unescape;
    if (!children && !knownComponentsMap && !emptyChildrenButNeedsHandling) return [isString(targetString) ? unescapeFn(targetString) : targetString];
    const data = knownComponentsMap ?? {};
    const getData = childs => {
      const childrenArray = getAsArray(childs);
      childrenArray.forEach(child => {
        if (isString(child)) return;
        if (hasChildren(child)) getData(getChildren(child));else if (isObject(child) && !React.isValidElement(child)) Object.assign(data, child);
      });
    };
    getData(children);
    const knownNames = Object.keys(data);
    const allowedTags = name => /^\d+$/.test(name) || keepArray.indexOf(name) > -1 || knownNames.indexOf(name) > -1;
    const ast = index.parse(`<0>${targetString}</0>`, {
      allowedTags
    });
    const opts = {
      ...data,
      ...combinedTOpts
    };
    const renderInner = (child, node, rootReactNode) => {
      const childs = getChildren(child);
      const mappedChildren = mapAST(childs, node.children, rootReactNode);
      return hasValidReactChildren(childs) && mappedChildren.length === 0 || child.props?.i18nIsDynamicList ? childs : mappedChildren;
    };
    const pushTranslatedJSX = (child, inner, mem, i, isVoid) => {
      if (child.dummy) {
        child.children = inner;
        mem.push(React.cloneElement(child, {
          key: i
        }, isVoid ? undefined : inner));
      } else {
        mem.push(...React.Children.map([child], c => {
          if (c.type === React.Fragment || c.props?.i18nIsDynamicList !== undefined) {
            const freshProps = {
              key: i
            };
            if (c && c.props) {
              Object.keys(c.props).forEach(k => {
                if (k === 'children' || k === 'i18nIsDynamicList') return;
                freshProps[k] = c.props[k];
              });
            }
            return React.createElement(c.type, freshProps, isVoid ? null : inner);
          }
          const override = {
            key: i
          };
          if (c && c.props) {
            Object.keys(c.props).forEach(k => {
              if (k === 'ref' || k === 'children') return;
              override[k] = c.props[k];
            });
          }
          return React.cloneElement(c, override, isVoid ? null : inner);
        }));
      }
    };
    const mapAST = (reactNode, astNode, rootReactNode) => {
      const reactNodes = getAsArray(reactNode);
      const astNodes = getAsArray(astNode);
      const keepTagOccurrence = {};
      return astNodes.reduce((mem, node, i) => {
        const rawContent = node.children?.[0]?.content && i18n.services.interpolator.interpolate(node.children[0].content, opts, i18n.language);
        const translationContent = rawContent ? unescapeFn(rawContent) : rawContent;
        if (node.type === 'tag') {
          let tmp = reactNodes[parseInt(node.name, 10)];
          if (!tmp && knownComponentsMap) tmp = knownComponentsMap[node.name];
          if (rootReactNode.length === 1 && !tmp && isObject(rootReactNode[0])) tmp = rootReactNode[0][node.name];
          if (!tmp) tmp = {};
          const props = {
            ...node.attrs
          };
          Object.keys(props).forEach(p => {
            const val = props[p];
            if (isString(val)) {
              props[p] = unescapeFn(val);
            }
          });
          const child = Object.keys(props).length !== 0 ? mergeProps({
            props
          }, tmp) : tmp;
          const isElement = React.isValidElement(child);
          const isValidTranslationWithChildren = isElement && hasChildren(node, true) && !node.voidElement;
          const isEmptyTransWithHTML = emptyChildrenButNeedsHandling && isObject(child) && child.dummy && !isElement;
          const isKnownComponent = isObject(knownComponentsMap) && Object.hasOwnProperty.call(knownComponentsMap, node.name);
          if (isString(child)) {
            const value = i18n.services.interpolator.interpolate(child, opts, i18n.language);
            mem.push(value);
          } else if (hasChildren(child) || isValidTranslationWithChildren) {
            const inner = renderInner(child, node, rootReactNode);
            pushTranslatedJSX(child, inner, mem, i);
          } else if (isEmptyTransWithHTML) {
            const inner = mapAST(reactNodes, node.children, rootReactNode);
            pushTranslatedJSX(child, inner, mem, i);
          } else if (Number.isNaN(parseFloat(node.name))) {
            if (isKnownComponent) {
              const inner = renderInner(child, node, rootReactNode);
              pushTranslatedJSX(child, inner, mem, i, node.voidElement);
            } else if (i18nOptions.transSupportBasicHtmlNodes && keepArray.indexOf(node.name) > -1) {
              if (node.voidElement) {
                mem.push(React.createElement(node.name, {
                  key: `${node.name}-${i}`
                }));
              } else {
                const occurrence = keepTagOccurrence[node.name] || 0;
                keepTagOccurrence[node.name] = occurrence + 1;
                let matched;
                let seen = 0;
                for (let r = 0; r < reactNodes.length; r += 1) {
                  const rn = reactNodes[r];
                  if (React.isValidElement(rn) && rn.type === node.name) {
                    if (seen === occurrence) {
                      matched = rn;
                      break;
                    }
                    seen += 1;
                  }
                }
                const innerScope = matched ? getAsArray(getChildren(matched)) : reactNodes;
                const inner = mapAST(innerScope, node.children, rootReactNode);
                mem.push(React.createElement(node.name, {
                  key: `${node.name}-${i}`
                }, inner));
              }
            } else if (node.voidElement) {
              mem.push(`<${node.name} />`);
            } else {
              const inner = mapAST(reactNodes, node.children, rootReactNode);
              mem.push(`<${node.name}>${inner}</${node.name}>`);
            }
          } else if (isObject(child) && !isElement) {
            const content = node.children[0] ? translationContent : null;
            if (content) mem.push(content);
          } else {
            pushTranslatedJSX(child, translationContent, mem, i, node.children.length !== 1 || !translationContent);
          }
        } else if (node.type === 'text') {
          const wrapTextNodes = i18nOptions.transWrapTextNodes;
          const content = unescapeFn(i18n.services.interpolator.interpolate(node.content, opts, i18n.language));
          if (wrapTextNodes) {
            mem.push(React.createElement(wrapTextNodes, {
              key: `${node.name}-${i}`
            }, content));
          } else {
            mem.push(content);
          }
        }
        return mem;
      }, []);
    };
    const result = mapAST([{
      dummy: true,
      children: children || []
    }], ast, getAsArray(children || []));
    return getChildren(result[0]);
  };
  function Componentized({
    i18nComponent
  }) {
    return i18nComponent;
  }
  const fixComponentProps = (component, index, translation) => {
    const componentKey = component.key || index;
    const comp = React.cloneElement(component, {
      key: componentKey
    });
    if (!comp.props || !comp.props.children || translation.indexOf(`${index}/>`) < 0 && translation.indexOf(`${index} />`) < 0) {
      return comp;
    }
    return React.createElement(Componentized, {
      key: componentKey,
      i18nComponent: comp
    });
  };
  const generateArrayComponents = (components, translation) => components.map((c, index) => fixComponentProps(c, index, translation));
  const generateObjectComponents = (components, translation) => {
    const componentMap = {};
    Object.keys(components).forEach(c => {
      Object.assign(componentMap, {
        [c]: fixComponentProps(components[c], c, translation)
      });
    });
    return componentMap;
  };
  const generateComponents = (components, translation, i18n, i18nKey) => {
    if (!components) return null;
    if (Array.isArray(components)) {
      return generateArrayComponents(components, translation);
    }
    if (isObject(components)) {
      return generateObjectComponents(components, translation);
    }
    warnOnce(i18n, 'TRANS_INVALID_COMPONENTS', `<Trans /> "components" prop expects an object or array`, {
      i18nKey
    });
    return null;
  };
  const isComponentsMap = object => {
    if (!isObject(object)) return false;
    if (Array.isArray(object)) return false;
    return Object.keys(object).reduce((acc, key) => acc && Number.isNaN(Number.parseFloat(key)), true);
  };
  function Trans$1({
    children,
    count,
    parent,
    i18nKey,
    context,
    tOptions = {},
    values,
    defaults,
    components,
    ns,
    i18n: i18nFromProps,
    t: tFromProps,
    shouldUnescape,
    ...additionalProps
  }) {
    const i18n = i18nFromProps || getI18n();
    if (!i18n) {
      warnOnce(i18n, 'NO_I18NEXT_INSTANCE', `Trans: You need to pass in an i18next instance using initReactI18next or by passing it via props or context. In monorepo setups, make sure there is only one instance of react-i18next.`, {
        i18nKey
      });
      return children;
    }
    const t = tFromProps || i18n.t.bind(i18n) || (k => k);
    const reactI18nextOptions = {
      ...getDefaults(),
      ...i18n.options?.react
    };
    let namespaces = ns || (t.ns ? undefined : i18n.options?.defaultNS || 'translation');
    if (isString(namespaces)) namespaces = [namespaces];
    const {
      transDefaultProps
    } = reactI18nextOptions;
    const mergedTOptions = transDefaultProps?.tOptions ? {
      ...transDefaultProps.tOptions,
      ...tOptions
    } : tOptions;
    if ((shouldUnescape !== undefined || transDefaultProps?.shouldUnescape !== undefined) && inDevelopment()) {
      warnOnce(i18n, 'DEPRECATED_OPTION', 'Trans: shouldUnescape is ignored, Trans always decodes HTML entities now. Remove it from your Trans props and transDefaultProps.', {
        i18nKey
      });
    }
    const mergedValues = transDefaultProps?.values ? {
      ...transDefaultProps.values,
      ...values
    } : values;
    const mergedComponents = transDefaultProps?.components ? {
      ...transDefaultProps.components,
      ...components
    } : components;
    const nodeAsString = nodesToString(children, reactI18nextOptions, i18n, i18nKey);
    const fallbackKey = Array.isArray(i18nKey) ? i18nKey[i18nKey.length - 1] : i18nKey;
    const defaultValue = defaults || mergedTOptions?.defaultValue || nodeAsString || reactI18nextOptions.transEmptyNodeValue || (typeof fallbackKey === 'function' ? i18next.keyFromSelector(fallbackKey) : fallbackKey);
    const {
      hashTransKey
    } = reactI18nextOptions;
    const key = i18nKey || (hashTransKey ? hashTransKey(nodeAsString || defaultValue) : nodeAsString || defaultValue);
    if (i18n.options?.interpolation?.defaultVariables) {
      values = {
        ...i18n.options.interpolation.defaultVariables,
        ...mergedValues
      };
    } else {
      values = mergedValues;
    }
    const valuesFromChildren = getValuesFromChildren(children);
    if (valuesFromChildren && typeof valuesFromChildren.count === 'number' && count === undefined) {
      count = valuesFromChildren.count;
    }
    if (count === undefined) count = mergedTOptions?.count;
    const interpolateBeforeParsing = values || count !== undefined && !i18n.options?.interpolation?.alwaysFormat || !children;
    const formatPlugin = getFormatPlugin(i18n);
    const escapeValues = interpolateBeforeParsing && (formatPlugin ? !formatPlugin.options?.escapeVariables : (mergedTOptions.interpolation?.escapeValue ?? i18n.options?.interpolation?.escapeValue) === false);
    let interpolationOverride = interpolateBeforeParsing ? mergedTOptions.interpolation : {
      interpolation: {
        ...mergedTOptions.interpolation,
        prefix: '#$?',
        suffix: '?$#'
      }
    };
    if (escapeValues && !formatPlugin) interpolationOverride = {
      interpolation: {
        ...mergedTOptions.interpolation,
        escapeValue: true
      }
    };
    const interpolationOptions = {
      ...i18n.options?.interpolation,
      ...mergedTOptions.interpolation
    };
    const escapeFn = interpolationOptions.escape || i18n.services?.interpolator?.escape;
    const childPlaceholders = Object.keys(valuesFromChildren).map(name => `${interpolationOptions.prefix ?? '{{'}${name}${interpolationOptions.suffix ?? '}}'}`);
    const keepChildPlaceholders = interpolateBeforeParsing && !formatPlugin && childPlaceholders.length > 0 && interpolationOptions.skipOnVariables !== false && !mergedTOptions.missingInterpolationHandler && !i18n.options?.missingInterpolationHandler && typeof escapeFn === 'function' && childPlaceholders.every(placeholder => escapeFn(placeholder) === placeholder);
    const escapeForPlugin = escapeValues && formatPlugin ? escapeStringValues : v => v;
    const combinedTOpts = {
      ...escapeForPlugin(mergedTOptions),
      context: context || mergedTOptions.context,
      count,
      ...escapeForPlugin(values),
      ...(keepChildPlaceholders && {
        missingInterpolationHandler: (str, match, opts) => opts && Object.prototype.hasOwnProperty.call(opts, match[1].trim()) ? '' : match[0]
      }),
      ...interpolationOverride,
      defaultValue,
      ns: namespaces
    };
    let translation = key ? t(key, combinedTOpts) : defaultValue;
    if (translation === key && defaultValue) translation = defaultValue;
    const generatedComponents = generateComponents(mergedComponents, translation, i18n, i18nKey);
    let indexedChildren = generatedComponents || children;
    let componentsMap = null;
    if (isComponentsMap(generatedComponents)) {
      componentsMap = generatedComponents;
      indexedChildren = children;
    } else if (generatedComponents && !Array.isArray(generatedComponents)) {
      componentsMap = generatedComponents;
      indexedChildren = undefined;
    }
    const content = renderNodes(indexedChildren, componentsMap, translation, i18n, reactI18nextOptions, combinedTOpts);
    const useAsParent = parent ?? reactI18nextOptions.defaultTransParent;
    return useAsParent ? React.createElement(useAsParent, additionalProps, content) : content;
  }

  const initReactI18next = {
    type: '3rdParty',
    init(instance) {
      setI18n(instance);
    }
  };

  const I18nContext = React.createContext();
  class ReportNamespaces {
    constructor() {
      this.usedNamespaces = {};
    }
    addUsedNamespaces(namespaces) {
      namespaces.forEach(ns => {
        if (!this.usedNamespaces[ns]) this.usedNamespaces[ns] = true;
      });
    }
    getUsedNamespaces() {
      return Object.keys(this.usedNamespaces);
    }
  }
  const composeInitialProps = ForComponent => async ctx => {
    const componentsInitialProps = (await ForComponent.getInitialProps?.(ctx)) ?? {};
    const i18nInitialProps = getInitialProps();
    return {
      ...componentsInitialProps,
      ...i18nInitialProps
    };
  };
  const getInitialProps = () => {
    const i18n = getI18n();
    if (!i18n) {
      console.warn('react-i18next:: getInitialProps: You will need to pass in an i18next instance by using initReactI18next');
      return {};
    }
    const namespaces = i18n.reportNamespaces?.getUsedNamespaces() ?? [];
    const ret = {};
    const initialI18nStore = {};
    i18n.languages.forEach(l => {
      initialI18nStore[l] = {};
      namespaces.forEach(ns => {
        initialI18nStore[l][ns] = i18n.getResourceBundle(l, ns) || {};
      });
    });
    ret.initialI18nStore = initialI18nStore;
    ret.initialLanguage = i18n.language;
    return ret;
  };

  const notReadyT = (k, optsOrDefaultValue) => {
    if (isString(optsOrDefaultValue)) return optsOrDefaultValue;
    if (isObject(optsOrDefaultValue) && isString(optsOrDefaultValue.defaultValue)) return optsOrDefaultValue.defaultValue;
    if (typeof k === 'function') return '';
    if (Array.isArray(k)) {
      const last = k[k.length - 1];
      return typeof last === 'function' ? '' : last;
    }
    return k;
  };
  const languageKey = inst => `${inst.language}|${inst.resolvedLanguage}|${inst.languages?.join(',')}`;
  const createI18nWrapper = original => new Proxy(original, {
    get: (target, prop) => prop === '__original' ? target : Reflect.get(target, prop)
  });
  const notReadySnapshot = {
    t: notReadyT,
    ready: false
  };
  const dummySubscribe = () => () => {};
  const subscribeToEvents = (i18n, {
    bindI18n,
    bindI18nStore
  }, callback) => {
    if (bindI18n) i18n.on(bindI18n, callback);
    if (bindI18nStore) i18n.store.on(bindI18nStore, callback);
    return () => {
      if (bindI18n) i18n.off(bindI18n, callback);
      if (bindI18nStore) i18n.store.off(bindI18nStore, callback);
    };
  };
  const useRerenderOnEvents = i18n => {
    const {
      bindI18n,
      bindI18nStore
    } = {
      ...getDefaults(),
      ...i18n?.options?.react
    };
    const revisionRef = React.useRef(0);
    const subscribe = React.useCallback(callback => i18n ? subscribeToEvents(i18n, {
      bindI18n,
      bindI18nStore
    }, () => {
      revisionRef.current += 1;
      callback();
    }) : () => {}, [i18n, bindI18n, bindI18nStore]);
    const getSnapshot = () => bindI18n && i18n ? `${revisionRef.current}|${languageKey(i18n)}` : String(revisionRef.current);
    React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  };
  const useTranslation = (ns, props = {}) => {
    const {
      i18n: i18nFromProps
    } = props;
    const {
      i18n: i18nFromContext,
      defaultNS: defaultNSFromContext
    } = React.useContext(I18nContext) || {};
    const i18n = i18nFromProps || i18nFromContext || getI18n();
    if (i18n && !i18n.reportNamespaces) i18n.reportNamespaces = new ReportNamespaces();
    if (!i18n) {
      warnOnce(i18n, 'NO_I18NEXT_INSTANCE', 'useTranslation: You will need to pass in an i18next instance by using initReactI18next or by passing it via props or context. In monorepo setups, make sure there is only one instance of react-i18next.');
    }
    const i18nOptions = React.useMemo(() => ({
      ...getDefaults(),
      ...i18n?.options?.react,
      ...props
    }), [i18n, props]);
    const {
      useSuspense,
      keyPrefix,
      bindI18n,
      bindI18nStore
    } = i18nOptions;
    const nsOrContext = ns || defaultNSFromContext || i18n?.options?.defaultNS;
    const unstableNamespaces = isString(nsOrContext) ? [nsOrContext] : nsOrContext || ['translation'];
    const namespacesKey = JSON.stringify(unstableNamespaces);
    const namespaces = React.useMemo(() => unstableNamespaces, [namespacesKey]);
    i18n?.reportNamespaces?.addUsedNamespaces?.(namespaces);
    const revisionRef = React.useRef(0);
    const subscribe = React.useCallback(callback => {
      if (!i18n) return dummySubscribe;
      const wrappedCallback = () => {
        revisionRef.current += 1;
        callback();
      };
      return subscribeToEvents(i18n, {
        bindI18n,
        bindI18nStore
      }, wrappedCallback);
    }, [i18n, bindI18n, bindI18nStore]);
    const snapshotRef = React.useRef();
    const getSnapshot = React.useCallback(() => {
      if (!i18n) {
        return notReadySnapshot;
      }
      const calculatedReady = !!(i18n.isInitialized || i18n.initializedStoreOnce) && namespaces.every(n => hasLoadedNamespace(n, i18n, i18nOptions));
      const currentLng = props.lng || i18n.language;
      const currentRevision = revisionRef.current;
      const keyPrefixKey = typeof keyPrefix === 'function' ? i18next.keyFromSelector(keyPrefix, {
        ...i18n.options,
        ns: namespaces
      }) : keyPrefix;
      const lastSnapshot = snapshotRef.current;
      if (lastSnapshot && lastSnapshot.i18n === i18n && lastSnapshot.ready === calculatedReady && lastSnapshot.lng === currentLng && lastSnapshot.namespaces === namespaces && lastSnapshot.keyPrefix === keyPrefixKey && lastSnapshot.revision === currentRevision) {
        return lastSnapshot;
      }
      const calculatedT = i18n.getFixedT(currentLng, i18nOptions.nsMode === 'fallback' ? namespaces : namespaces[0], keyPrefix, {
        scopeNs: namespaces
      });
      const newSnapshot = {
        t: calculatedT,
        i18n,
        ready: calculatedReady,
        lng: currentLng,
        namespaces,
        keyPrefix: keyPrefixKey,
        revision: currentRevision
      };
      snapshotRef.current = newSnapshot;
      return newSnapshot;
    }, [i18n, namespaces, keyPrefix, i18nOptions, props.lng]);
    const [loadCount, setLoadCount] = React.useState(0);
    let {
      t,
      ready
    } = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
    let pendingTranslationLoad;
    if (i18n && useSuspense && !ready) {
      pendingTranslationLoad = new Promise(resolve => {
        const onLoaded = () => resolve();
        if (props.lng) {
          loadLanguages(i18n, props.lng, namespaces, onLoaded);
        } else {
          loadNamespaces(i18n, namespaces, onLoaded);
        }
      });
      ({
        t,
        ready
      } = getSnapshot());
    }
    React.useEffect(() => {
      if (i18n && !ready && !useSuspense) {
        const onLoaded = () => setLoadCount(c => c + 1);
        if (props.lng) {
          loadLanguages(i18n, props.lng, namespaces, onLoaded);
        } else {
          loadNamespaces(i18n, namespaces, onLoaded);
        }
      }
    }, [i18n, props.lng, namespaces, ready, useSuspense, loadCount]);
    const finalI18n = i18n || {};
    const wrapperRef = React.useRef(null);
    const ret = React.useMemo(() => {
      const original = finalI18n;
      const lang = languageKey(original);
      if (wrapperRef.current?.original !== original || wrapperRef.current.lang !== lang) {
        wrapperRef.current = {
          original,
          lang,
          wrapper: createI18nWrapper(original)
        };
      }
      const i18nWrapper = wrapperRef.current.wrapper;
      const effectiveT = !ready && !useSuspense ? (...args) => {
        warnOnce(i18n, 'USE_T_BEFORE_READY', 'useTranslation: t was called before ready. When using useSuspense: false, make sure to check the ready flag before using t.');
        return t(...args);
      } : t;
      const arr = [effectiveT, i18nWrapper, ready];
      arr.t = effectiveT;
      arr.i18n = i18nWrapper;
      arr.ready = ready;
      return arr;
    }, [t, finalI18n, ready, finalI18n.resolvedLanguage, finalI18n.language, finalI18n.languages]);
    if (i18n && useSuspense && !ready) {
      if (inDevelopment()) {
        warnOnce(i18n, 'SUSPENDED_WHILE_LOADING', 'useTranslation: suspended while translations are loading (useSuspense is true by default). Add a <Suspense> boundary above this component, or set react.useSuspense: false in the i18next init options. https://react.i18next.com/latest/usetranslation-hook');
      }
      throw pendingTranslationLoad;
    }
    return ret;
  };

  function Trans({
    children,
    count,
    parent,
    i18nKey,
    context,
    tOptions = {},
    values,
    defaults,
    components,
    ns,
    i18n: i18nFromProps,
    t: tFromProps,
    shouldUnescape,
    ...additionalProps
  }) {
    const {
      i18n: i18nFromContext,
      defaultNS: defaultNSFromContext
    } = React.useContext(I18nContext) || {};
    const i18n = i18nFromProps || i18nFromContext || getI18n();
    useRerenderOnEvents(i18n);
    const t = tFromProps || i18n?.t.bind(i18n);
    return Trans$1({
      children,
      count,
      parent,
      i18nKey,
      context,
      tOptions,
      values,
      defaults,
      components,
      ns: ns || (t?.ns ? undefined : defaultNSFromContext || i18n?.options?.defaultNS),
      i18n,
      t: tFromProps,
      shouldUnescape,
      ...additionalProps
    });
  }

  class TranslationParserError extends Error {
    constructor(message, position, translationString) {
      super(message);
      this.name = 'TranslationParserError';
      this.position = position;
      this.translationString = translationString;
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, TranslationParserError);
      }
    }
  }

  const commonEntities = {
    '&nbsp;': '\u00A0',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&hellip;': '…',
    '&ndash;': '–',
    '&mdash;': '—',
    '&lsquo;': '\u2018',
    '&rsquo;': '\u2019',
    '&sbquo;': '\u201A',
    '&ldquo;': '\u201C',
    '&rdquo;': '\u201D',
    '&bdquo;': '\u201E',
    '&dagger;': '†',
    '&Dagger;': '‡',
    '&bull;': '•',
    '&prime;': '′',
    '&Prime;': '″',
    '&lsaquo;': '‹',
    '&rsaquo;': '›',
    '&sect;': '§',
    '&para;': '¶',
    '&middot;': '·',
    '&ensp;': '\u2002',
    '&emsp;': '\u2003',
    '&thinsp;': '\u2009',
    '&euro;': '€',
    '&pound;': '£',
    '&yen;': '¥',
    '&cent;': '¢',
    '&curren;': '¤',
    '&times;': '×',
    '&divide;': '÷',
    '&minus;': '−',
    '&plusmn;': '±',
    '&ne;': '≠',
    '&le;': '≤',
    '&ge;': '≥',
    '&asymp;': '≈',
    '&equiv;': '≡',
    '&infin;': '∞',
    '&int;': '∫',
    '&sum;': '∑',
    '&prod;': '∏',
    '&radic;': '√',
    '&part;': '∂',
    '&permil;': '‰',
    '&deg;': '°',
    '&micro;': 'µ',
    '&larr;': '←',
    '&uarr;': '↑',
    '&rarr;': '→',
    '&darr;': '↓',
    '&harr;': '↔',
    '&crarr;': '↵',
    '&lArr;': '⇐',
    '&uArr;': '⇑',
    '&rArr;': '⇒',
    '&dArr;': '⇓',
    '&hArr;': '⇔',
    '&alpha;': 'α',
    '&beta;': 'β',
    '&gamma;': 'γ',
    '&delta;': 'δ',
    '&epsilon;': 'ε',
    '&zeta;': 'ζ',
    '&eta;': 'η',
    '&theta;': 'θ',
    '&iota;': 'ι',
    '&kappa;': 'κ',
    '&lambda;': 'λ',
    '&mu;': 'μ',
    '&nu;': 'ν',
    '&xi;': 'ξ',
    '&omicron;': 'ο',
    '&pi;': 'π',
    '&rho;': 'ρ',
    '&sigma;': 'σ',
    '&tau;': 'τ',
    '&upsilon;': 'υ',
    '&phi;': 'φ',
    '&chi;': 'χ',
    '&psi;': 'ψ',
    '&omega;': 'ω',
    '&Alpha;': 'Α',
    '&Beta;': 'Β',
    '&Gamma;': 'Γ',
    '&Delta;': 'Δ',
    '&Epsilon;': 'Ε',
    '&Zeta;': 'Ζ',
    '&Eta;': 'Η',
    '&Theta;': 'Θ',
    '&Iota;': 'Ι',
    '&Kappa;': 'Κ',
    '&Lambda;': 'Λ',
    '&Mu;': 'Μ',
    '&Nu;': 'Ν',
    '&Xi;': 'Ξ',
    '&Omicron;': 'Ο',
    '&Pi;': 'Π',
    '&Rho;': 'Ρ',
    '&Sigma;': 'Σ',
    '&Tau;': 'Τ',
    '&Upsilon;': 'Υ',
    '&Phi;': 'Φ',
    '&Chi;': 'Χ',
    '&Psi;': 'Ψ',
    '&Omega;': 'Ω',
    '&Agrave;': 'À',
    '&Aacute;': 'Á',
    '&Acirc;': 'Â',
    '&Atilde;': 'Ã',
    '&Auml;': 'Ä',
    '&Aring;': 'Å',
    '&AElig;': 'Æ',
    '&Ccedil;': 'Ç',
    '&Egrave;': 'È',
    '&Eacute;': 'É',
    '&Ecirc;': 'Ê',
    '&Euml;': 'Ë',
    '&Igrave;': 'Ì',
    '&Iacute;': 'Í',
    '&Icirc;': 'Î',
    '&Iuml;': 'Ï',
    '&ETH;': 'Ð',
    '&Ntilde;': 'Ñ',
    '&Ograve;': 'Ò',
    '&Oacute;': 'Ó',
    '&Ocirc;': 'Ô',
    '&Otilde;': 'Õ',
    '&Ouml;': 'Ö',
    '&Oslash;': 'Ø',
    '&Ugrave;': 'Ù',
    '&Uacute;': 'Ú',
    '&Ucirc;': 'Û',
    '&Uuml;': 'Ü',
    '&Yacute;': 'Ý',
    '&THORN;': 'Þ',
    '&szlig;': 'ß',
    '&agrave;': 'à',
    '&aacute;': 'á',
    '&acirc;': 'â',
    '&atilde;': 'ã',
    '&auml;': 'ä',
    '&aring;': 'å',
    '&aelig;': 'æ',
    '&ccedil;': 'ç',
    '&egrave;': 'è',
    '&eacute;': 'é',
    '&ecirc;': 'ê',
    '&euml;': 'ë',
    '&igrave;': 'ì',
    '&iacute;': 'í',
    '&icirc;': 'î',
    '&iuml;': 'ï',
    '&eth;': 'ð',
    '&ntilde;': 'ñ',
    '&ograve;': 'ò',
    '&oacute;': 'ó',
    '&ocirc;': 'ô',
    '&otilde;': 'õ',
    '&ouml;': 'ö',
    '&oslash;': 'ø',
    '&ugrave;': 'ù',
    '&uacute;': 'ú',
    '&ucirc;': 'û',
    '&uuml;': 'ü',
    '&yacute;': 'ý',
    '&thorn;': 'þ',
    '&yuml;': 'ÿ',
    '&iexcl;': '¡',
    '&iquest;': '¿',
    '&fnof;': 'ƒ',
    '&circ;': 'ˆ',
    '&tilde;': '˜',
    '&OElig;': 'Œ',
    '&oelig;': 'œ',
    '&Scaron;': 'Š',
    '&scaron;': 'š',
    '&Yuml;': 'Ÿ',
    '&ordf;': 'ª',
    '&ordm;': 'º',
    '&macr;': '¯',
    '&acute;': '´',
    '&cedil;': '¸',
    '&sup1;': '¹',
    '&sup2;': '²',
    '&sup3;': '³',
    '&frac14;': '¼',
    '&frac12;': '½',
    '&frac34;': '¾',
    '&spades;': '♠',
    '&clubs;': '♣',
    '&hearts;': '♥',
    '&diams;': '♦',
    '&loz;': '◊',
    '&oline;': '‾',
    '&frasl;': '⁄',
    '&weierp;': '℘',
    '&image;': 'ℑ',
    '&real;': 'ℜ',
    '&alefsym;': 'ℵ'
  };
  const entityPattern = /&(?:#(\d+)|#x([0-9a-fA-F]+)|[A-Za-z][A-Za-z0-9]*);/g;
  const decodeCodePoint = (match, codePoint) => codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match;
  const decodeHtmlEntities = text => text.replace(entityPattern, (match, decimal, hex) => {
    if (decimal) return decodeCodePoint(match, parseInt(decimal, 10));
    if (hex) return decodeCodePoint(match, parseInt(hex, 16));
    return Object.prototype.hasOwnProperty.call(commonEntities, match) ? commonEntities[match] : match;
  });

  const tokenize = translation => {
    const tokens = [];
    let position = 0;
    let currentText = '';
    const flushText = () => {
      if (currentText) {
        tokens.push({
          type: 'Text',
          value: currentText,
          position: position - currentText.length
        });
        currentText = '';
      }
    };
    while (position < translation.length) {
      const char = translation[position];
      if (char === '<') {
        const tagMatch = translation.slice(position).match(/^<(\d+)>/);
        if (tagMatch) {
          flushText();
          tokens.push({
            type: 'TagOpen',
            value: tagMatch[0],
            position,
            tagNumber: parseInt(tagMatch[1], 10)
          });
          position += tagMatch[0].length;
        } else {
          const closeTagMatch = translation.slice(position).match(/^<\/(\d+)>/);
          if (closeTagMatch) {
            flushText();
            tokens.push({
              type: 'TagClose',
              value: closeTagMatch[0],
              position,
              tagNumber: parseInt(closeTagMatch[1], 10)
            });
            position += closeTagMatch[0].length;
          } else {
            currentText += char;
            position += 1;
          }
        }
      } else {
        currentText += char;
        position += 1;
      }
    }
    flushText();
    return tokens;
  };

  const renderDeclarationNode = (declaration, children, childDeclarations) => {
    const {
      type,
      props = {}
    } = declaration;
    if (props.children && Array.isArray(props.children) && childDeclarations) {
      const {
        children: _childrenToRemove,
        ...propsWithoutChildren
      } = props;
      return React.createElement(type, propsWithoutChildren, ...children);
    }
    if (children.length === 0) {
      return React.createElement(type, props);
    }
    if (children.length === 1) {
      return React.createElement(type, props, children[0]);
    }
    return React.createElement(type, props, ...children);
  };
  const renderTranslation = (translation, declarations = []) => {
    if (!translation) {
      return [];
    }
    const tokens = tokenize(translation);
    const result = [];
    const stack = [];
    const literalTagNumbers = new Set();
    const getCurrentDeclarations = () => {
      if (stack.length === 0) {
        return declarations;
      }
      const parentFrame = stack[stack.length - 1];
      if (parentFrame.declaration.props?.children && Array.isArray(parentFrame.declaration.props.children)) {
        return parentFrame.declaration.props.children;
      }
      return parentFrame.declarations;
    };
    tokens.forEach(token => {
      switch (token.type) {
        case 'Text':
          {
            const decoded = decodeHtmlEntities(token.value);
            const targetArray = stack.length > 0 ? stack[stack.length - 1].children : result;
            targetArray.push(decoded);
          }
          break;
        case 'TagOpen':
          {
            const {
              tagNumber
            } = token;
            const currentDeclarations = getCurrentDeclarations();
            const declaration = currentDeclarations[tagNumber];
            if (!declaration) {
              literalTagNumbers.add(tagNumber);
              const literalText = `<${tagNumber}>`;
              const targetArray = stack.length > 0 ? stack[stack.length - 1].children : result;
              targetArray.push(literalText);
              break;
            }
            stack.push({
              tagNumber,
              children: [],
              position: token.position,
              declaration,
              declarations: currentDeclarations
            });
          }
          break;
        case 'TagClose':
          {
            const {
              tagNumber
            } = token;
            if (literalTagNumbers.has(tagNumber)) {
              const literalText = `</${tagNumber}>`;
              const literalTargetArray = stack.length > 0 ? stack[stack.length - 1].children : result;
              literalTargetArray.push(literalText);
              literalTagNumbers.delete(tagNumber);
              break;
            }
            if (stack.length === 0) {
              throw new TranslationParserError(`Unexpected closing tag </${tagNumber}> at position ${token.position}`, token.position, translation);
            }
            const frame = stack.pop();
            if (frame.tagNumber !== tagNumber) {
              throw new TranslationParserError(`Mismatched tags: expected </${frame.tagNumber}> but got </${tagNumber}> at position ${token.position}`, token.position, translation);
            }
            const element = renderDeclarationNode(frame.declaration, frame.children, frame.declarations);
            const elementTargetArray = stack.length > 0 ? stack[stack.length - 1].children : result;
            elementTargetArray.push(element);
          }
          break;
      }
    });
    if (stack.length > 0) {
      const unclosed = stack[stack.length - 1];
      throw new TranslationParserError(`Unclosed tag <${unclosed.tagNumber}> at position ${unclosed.position}`, unclosed.position, translation);
    }
    return result;
  };

  function IcuTransWithoutContext({
    i18nKey,
    defaultTranslation,
    content,
    ns,
    values = {},
    i18n: i18nFromProps,
    t: tFromProps
  }) {
    const i18n = i18nFromProps || getI18n();
    if (!i18n) {
      warnOnce(i18n, 'NO_I18NEXT_INSTANCE', `IcuTrans: You need to pass in an i18next instance using i18nextReactModule`, {
        i18nKey
      });
      return React.createElement(React.Fragment, {}, defaultTranslation);
    }
    const t = tFromProps || i18n.t?.bind(i18n) || (k => k);
    let namespaces = ns || t.ns || i18n.options?.defaultNS;
    namespaces = isString(namespaces) ? [namespaces] : namespaces || ['translation'];
    const mergedValues = {
      ...i18n.options?.interpolation?.defaultVariables,
      ...values
    };
    const formatPlugin = getFormatPlugin(i18n);
    const escapeValues = formatPlugin ? !formatPlugin.options?.escapeVariables : i18n.options?.interpolation?.escapeValue === false;
    const translation = t(i18nKey || defaultTranslation, {
      defaultValue: defaultTranslation,
      ...(escapeValues && formatPlugin ? escapeStringValues(mergedValues) : mergedValues),
      ...(escapeValues && !formatPlugin && {
        interpolation: {
          escapeValue: true
        }
      }),
      ns: namespaces
    });
    try {
      const rendered = renderTranslation(translation, content);
      return React.createElement(React.Fragment, {}, ...rendered);
    } catch (error) {
      warn(i18n, 'ICU_TRANS_RENDER_ERROR', `IcuTrans component error for key "${i18nKey}": ${error.message}`, {
        i18nKey,
        error
      });
      return React.createElement(React.Fragment, {}, translation);
    }
  }
  IcuTransWithoutContext.displayName = 'IcuTransWithoutContext';

  function IcuTrans({
    i18nKey,
    defaultTranslation,
    content,
    ns,
    values = {},
    i18n: i18nFromProps,
    t: tFromProps
  }) {
    const {
      i18n: i18nFromContext,
      defaultNS: defaultNSFromContext
    } = React.useContext(I18nContext) || {};
    const i18n = i18nFromProps || i18nFromContext || getI18n();
    useRerenderOnEvents(i18n);
    const t = tFromProps || i18n?.t.bind(i18n);
    return IcuTransWithoutContext({
      i18nKey,
      defaultTranslation,
      content,
      ns: ns || t?.ns || defaultNSFromContext || i18n?.options?.defaultNS,
      values,
      i18n,
      t: tFromProps
    });
  }
  IcuTrans.displayName = 'IcuTrans';

  const withTranslation = (ns, options = {}) => function Extend(WrappedComponent) {
    function I18nextWithTranslation({
      forwardedRef,
      ...rest
    }) {
      const [t, i18n, ready] = useTranslation(ns, {
        ...rest,
        keyPrefix: options.keyPrefix
      });
      const passDownProps = {
        ...rest,
        t,
        i18n,
        tReady: ready
      };
      if (options.withRef && forwardedRef) {
        passDownProps.ref = forwardedRef;
      } else if (!options.withRef && forwardedRef) {
        passDownProps.forwardedRef = forwardedRef;
      }
      return React.createElement(WrappedComponent, passDownProps);
    }
    I18nextWithTranslation.displayName = `withI18nextTranslation(${getDisplayName(WrappedComponent)})`;
    I18nextWithTranslation.WrappedComponent = WrappedComponent;
    const forwardRef = (props, ref) => React.createElement(I18nextWithTranslation, Object.assign({}, props, {
      forwardedRef: ref
    }));
    return options.withRef ? React.forwardRef(forwardRef) : I18nextWithTranslation;
  };

  const Translation = ({
    ns,
    children,
    ...options
  }) => {
    const [t, i18n, ready] = useTranslation(ns, options);
    return children(t, {
      i18n,
      lng: i18n?.language
    }, ready);
  };

  function I18nextProvider({
    i18n,
    defaultNS,
    children
  }) {
    const value = React.useMemo(() => ({
      i18n,
      defaultNS
    }), [i18n, defaultNS]);
    return React.createElement(I18nContext.Provider, {
      value
    }, children);
  }

  const useSSR = (initialI18nStore, initialLanguage, props = {}) => {
    const {
      i18n: i18nFromProps
    } = props;
    const {
      i18n: i18nFromContext
    } = React.useContext(I18nContext) || {};
    const i18n = i18nFromProps || i18nFromContext || getI18n();
    if (!i18n) {
      warnOnce(i18n, 'NO_I18NEXT_INSTANCE', 'useSSR: You will need to pass in an i18next instance by using initReactI18next or by passing it via props or context. In monorepo setups, make sure there is only one instance of react-i18next.');
      return;
    }
    if (i18n.options?.isClone) return;
    if (initialI18nStore && !i18n.initializedStoreOnce && !i18n.services?.resourceStore) {
      warnOnce(i18n, 'I18N_NOT_INITIALIZED', 'useSSR: i18n instance was found but not initialized (services.resourceStore is missing). Make sure you call i18next.init() before using useSSR, e.g. at module level, not only in getStaticProps/getServerSideProps.');
      return;
    }
    i18n.hydrate(initialI18nStore, initialLanguage);
  };

  const withSSR = () => function Extend(WrappedComponent) {
    function I18nextWithSSR({
      initialI18nStore,
      initialLanguage,
      ...rest
    }) {
      useSSR(initialI18nStore, initialLanguage);
      return React.createElement(WrappedComponent, {
        ...rest
      });
    }
    I18nextWithSSR.getInitialProps = composeInitialProps(WrappedComponent);
    I18nextWithSSR.displayName = `withI18nextSSR(${getDisplayName(WrappedComponent)})`;
    I18nextWithSSR.WrappedComponent = WrappedComponent;
    return I18nextWithSSR;
  };

  exports.I18nContext = I18nContext;
  exports.I18nextProvider = I18nextProvider;
  exports.IcuTrans = IcuTrans;
  exports.IcuTransWithoutContext = IcuTransWithoutContext;
  exports.Trans = Trans;
  exports.TransWithoutContext = Trans$1;
  exports.Translation = Translation;
  exports.composeInitialProps = composeInitialProps;
  exports.getDefaults = getDefaults;
  exports.getI18n = getI18n;
  exports.getInitialProps = getInitialProps;
  exports.initReactI18next = initReactI18next;
  exports.nodesToString = nodesToString;
  exports.setDefaults = setDefaults;
  exports.setI18n = setI18n;
  exports.useSSR = useSSR;
  exports.useTranslation = useTranslation;
  exports.withSSR = withSSR;
  exports.withTranslation = withTranslation;

}));

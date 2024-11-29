(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ReactI18next = {}, global.React));
})(this, (function (exports, react) { 'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var voidElements = {
	  "area": true,
	  "base": true,
	  "br": true,
	  "col": true,
	  "embed": true,
	  "hr": true,
	  "img": true,
	  "input": true,
	  "link": true,
	  "meta": true,
	  "param": true,
	  "source": true,
	  "track": true,
	  "wbr": true
	};

	var e = /*@__PURE__*/getDefaultExportFromCjs(voidElements);

	var t = /\s([^'"/\s><]+?)[\s/>]|([^\s=]+)=\s?(".*?"|'.*?')/g;
	function n(n) {
	  var r = {
	      type: "tag",
	      name: "",
	      voidElement: !1,
	      attrs: {},
	      children: []
	    },
	    i = n.match(/<\/?([^\s]+?)[/\s>]/);
	  if (i && (r.name = i[1], (e[i[1]] || "/" === n.charAt(n.length - 2)) && (r.voidElement = !0), r.name.startsWith("!--"))) {
	    var s = n.indexOf("--\x3e");
	    return {
	      type: "comment",
	      comment: -1 !== s ? n.slice(4, s) : ""
	    };
	  }
	  for (var a = new RegExp(t), c = null; null !== (c = a.exec(n));) if (c[0].trim()) if (c[1]) {
	    var o = c[1].trim(),
	      l = [o, ""];
	    o.indexOf("=") > -1 && (l = o.split("=")), r.attrs[l[0]] = l[1], a.lastIndex--;
	  } else c[2] && (r.attrs[c[2]] = c[3].trim().substring(1, c[3].length - 1));
	  return r;
	}
	var r = /<[a-zA-Z0-9\-\!\/](?:"[^"]*"|'[^']*'|[^'">])*>/g,
	  i = /^\s*$/,
	  s = Object.create(null);
	function a(e, t) {
	  switch (t.type) {
	    case "text":
	      return e + t.content;
	    case "tag":
	      return e += "<" + t.name + (t.attrs ? function (e) {
	        var t = [];
	        for (var n in e) t.push(n + '="' + e[n] + '"');
	        return t.length ? " " + t.join(" ") : "";
	      }(t.attrs) : "") + (t.voidElement ? "/>" : ">"), t.voidElement ? e : e + t.children.reduce(a, "") + "</" + t.name + ">";
	    case "comment":
	      return e + "\x3c!--" + t.comment + "--\x3e";
	  }
	}
	var c = {
	  parse: function (e, t) {
	    t || (t = {}), t.components || (t.components = s);
	    var a,
	      c = [],
	      o = [],
	      l = -1,
	      m = !1;
	    if (0 !== e.indexOf("<")) {
	      var u = e.indexOf("<");
	      c.push({
	        type: "text",
	        content: -1 === u ? e : e.substring(0, u)
	      });
	    }
	    return e.replace(r, function (r, s) {
	      if (m) {
	        if (r !== "</" + a.name + ">") return;
	        m = !1;
	      }
	      var u,
	        f = "/" !== r.charAt(1),
	        h = r.startsWith("\x3c!--"),
	        p = s + r.length,
	        d = e.charAt(p);
	      if (h) {
	        var v = n(r);
	        return l < 0 ? (c.push(v), c) : ((u = o[l]).children.push(v), c);
	      }
	      if (f && (l++, "tag" === (a = n(r)).type && t.components[a.name] && (a.type = "component", m = !0), a.voidElement || m || !d || "<" === d || a.children.push({
	        type: "text",
	        content: e.slice(p, e.indexOf("<", p))
	      }), 0 === l && c.push(a), (u = o[l - 1]) && u.children.push(a), o[l] = a), (!f || a.voidElement) && (l > -1 && (a.voidElement || a.name === r.slice(2, -1)) && (l--, a = -1 === l ? c : o[l]), !m && "<" !== d && d)) {
	        u = -1 === l ? c : o[l].children;
	        var x = e.indexOf("<", p),
	          g = e.slice(p, -1 === x ? void 0 : x);
	        i.test(g) && (g = " "), (x > -1 && l + u.length >= 0 || " " !== g) && u.push({
	          type: "text",
	          content: g
	        });
	      }
	    }), c;
	  },
	  stringify: function (e) {
	    return e.reduce(function (e, t) {
	      return e + a("", t);
	    }, "");
	  }
	};

	const warn = function () {
	  if (console?.warn) {
	    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	    if (isString(args[0])) args[0] = `react-i18next:: ${args[0]}`;
	    console.warn(...args);
	  }
	};
	const alreadyWarned = {};
	const warnOnce = function () {
	  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	    args[_key2] = arguments[_key2];
	  }
	  if (isString(args[0]) && alreadyWarned[args[0]]) return;
	  if (isString(args[0])) alreadyWarned[args[0]] = new Date();
	  warn(...args);
	};
	const loadedClb = (i18n, cb) => () => {
	  if (i18n.isInitialized) {
	    cb();
	  } else {
	    const initialized = () => {
	      setTimeout(() => {
	        i18n.off('initialized', initialized);
	      }, 0);
	      cb();
	    };
	    i18n.on('initialized', initialized);
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
	const hasLoadedNamespace = function (ns, i18n) {
	  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	  if (!i18n.languages || !i18n.languages.length) {
	    warnOnce('i18n.languages were undefined or empty', i18n.languages);
	    return true;
	  }
	  return i18n.hasLoadedNamespace(ns, {
	    lng: options.lng,
	    precheck: (i18nInstance, loadNotPending) => {
	      if (options.bindI18n?.indexOf('languageChanging') > -1 && i18nInstance.services.backendConnector.backend && i18nInstance.isLanguageChangingTo && !loadNotPending(i18nInstance.isLanguageChangingTo, ns)) return false;
	    }
	  });
	};
	const getDisplayName = Component => Component.displayName || Component.name || (isString(Component) && Component.length > 0 ? Component : 'Unknown');
	const isString = obj => typeof obj === 'string';
	const isObject = obj => typeof obj === 'object' && obj !== null;

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
	  '&nbsp;': ' ',
	  '&#160;': ' ',
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
	  unescape
	};
	const setDefaults = function () {
	  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
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
	const hasValidReactChildren = children => Array.isArray(children) && children.every(react.isValidElement);
	const getAsArray = data => Array.isArray(data) ? data : [data];
	const mergeProps = (source, target) => {
	  const newTarget = {
	    ...target
	  };
	  newTarget.props = Object.assign(source.props, target.props);
	  return newTarget;
	};
	const nodesToString = (children, i18nOptions) => {
	  if (!children) return '';
	  let stringNode = '';
	  const childrenArray = getAsArray(children);
	  const keepArray = i18nOptions?.transSupportBasicHtmlNodes ? i18nOptions.transKeepBasicHtmlNodesFor ?? [] : [];
	  childrenArray.forEach((child, childIndex) => {
	    if (isString(child)) {
	      stringNode += `${child}`;
	    } else if (react.isValidElement(child)) {
	      const {
	        props,
	        type
	      } = child;
	      const childPropsCount = Object.keys(props).length;
	      const shouldKeepChild = keepArray.indexOf(type) > -1;
	      const childChildren = props.children;
	      if (!childChildren && shouldKeepChild && !childPropsCount) {
	        stringNode += `<${type}/>`;
	      } else if (!childChildren && (!shouldKeepChild || childPropsCount) || props.i18nIsDynamicList) {
	        stringNode += `<${childIndex}></${childIndex}>`;
	      } else if (shouldKeepChild && childPropsCount === 1 && isString(childChildren)) {
	        stringNode += `<${type}>${childChildren}</${type}>`;
	      } else {
	        const content = nodesToString(childChildren, i18nOptions);
	        stringNode += `<${childIndex}>${content}</${childIndex}>`;
	      }
	    } else if (child === null) {
	      warn(`Trans: the passed in value is invalid - seems you passed in a null child.`);
	    } else if (isObject(child)) {
	      const {
	        format,
	        ...clone
	      } = child;
	      const keys = Object.keys(clone);
	      if (keys.length === 1) {
	        const value = format ? `${keys[0]}, ${format}` : keys[0];
	        stringNode += `{{${value}}}`;
	      } else {
	        warn(`react-i18next: the passed in object contained more than one variable - the object should look like {{ value, format }} where format is optional.`, child);
	      }
	    } else {
	      warn(`Trans: the passed in value is invalid - seems you passed in a variable like {number} - please pass in variables for interpolation as full objects like {{number}}.`, child);
	    }
	  });
	  return stringNode;
	};
	const renderNodes = (children, targetString, i18n, i18nOptions, combinedTOpts, shouldUnescape) => {
	  if (targetString === '') return [];
	  const keepArray = i18nOptions.transKeepBasicHtmlNodesFor || [];
	  const emptyChildrenButNeedsHandling = targetString && new RegExp(keepArray.map(keep => `<${keep}`).join('|')).test(targetString);
	  if (!children && !emptyChildrenButNeedsHandling && !shouldUnescape) return [targetString];
	  const data = {};
	  const getData = childs => {
	    const childrenArray = getAsArray(childs);
	    childrenArray.forEach(child => {
	      if (isString(child)) return;
	      if (hasChildren(child)) getData(getChildren(child));else if (isObject(child) && !react.isValidElement(child)) Object.assign(data, child);
	    });
	  };
	  getData(children);
	  const ast = c.parse(`<0>${targetString}</0>`);
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
	      mem.push(react.cloneElement(child, {
	        key: i
	      }, isVoid ? undefined : inner));
	    } else {
	      mem.push(...react.Children.map([child], c => {
	        const props = {
	          ...c.props
	        };
	        delete props.i18nIsDynamicList;
	        return react.createElement(c.type, {
	          ...props,
	          key: i,
	          ref: c.ref
	        }, isVoid ? null : inner);
	      }));
	    }
	  };
	  const mapAST = (reactNode, astNode, rootReactNode) => {
	    const reactNodes = getAsArray(reactNode);
	    const astNodes = getAsArray(astNode);
	    return astNodes.reduce((mem, node, i) => {
	      const translationContent = node.children?.[0]?.content && i18n.services.interpolator.interpolate(node.children[0].content, opts, i18n.language);
	      if (node.type === 'tag') {
	        let tmp = reactNodes[parseInt(node.name, 10)];
	        if (rootReactNode.length === 1 && !tmp) tmp = rootReactNode[0][node.name];
	        if (!tmp) tmp = {};
	        const child = Object.keys(node.attrs).length !== 0 ? mergeProps({
	          props: node.attrs
	        }, tmp) : tmp;
	        const isElement = react.isValidElement(child);
	        const isValidTranslationWithChildren = isElement && hasChildren(node, true) && !node.voidElement;
	        const isEmptyTransWithHTML = emptyChildrenButNeedsHandling && isObject(child) && child.dummy && !isElement;
	        const isKnownComponent = isObject(children) && Object.hasOwnProperty.call(children, node.name);
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
	              mem.push(react.createElement(node.name, {
	                key: `${node.name}-${i}`
	              }));
	            } else {
	              const inner = mapAST(reactNodes, node.children, rootReactNode);
	              mem.push(react.createElement(node.name, {
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
	        const content = shouldUnescape ? i18nOptions.unescape(i18n.services.interpolator.interpolate(node.content, opts, i18n.language)) : i18n.services.interpolator.interpolate(node.content, opts, i18n.language);
	        if (wrapTextNodes) {
	          mem.push(react.createElement(wrapTextNodes, {
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
	function Trans$1(_ref) {
	  let {
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
	  } = _ref;
	  const i18n = i18nFromProps || getI18n();
	  if (!i18n) {
	    warnOnce('You will need to pass in an i18next instance by using i18nextReactModule');
	    return children;
	  }
	  const t = tFromProps || i18n.t.bind(i18n) || (k => k);
	  const reactI18nextOptions = {
	    ...getDefaults(),
	    ...i18n.options?.react
	  };
	  let namespaces = ns || t.ns || i18n.options?.defaultNS;
	  namespaces = isString(namespaces) ? [namespaces] : namespaces || ['translation'];
	  const nodeAsString = nodesToString(children, reactI18nextOptions);
	  const defaultValue = defaults || nodeAsString || reactI18nextOptions.transEmptyNodeValue || i18nKey;
	  const {
	    hashTransKey
	  } = reactI18nextOptions;
	  const key = i18nKey || (hashTransKey ? hashTransKey(nodeAsString || defaultValue) : nodeAsString || defaultValue);
	  if (i18n.options?.interpolation?.defaultVariables) {
	    values = values && Object.keys(values).length > 0 ? {
	      ...values,
	      ...i18n.options.interpolation.defaultVariables
	    } : {
	      ...i18n.options.interpolation.defaultVariables
	    };
	  }
	  const interpolationOverride = values || count !== undefined && !i18n.options?.interpolation?.alwaysFormat || !children ? tOptions.interpolation : {
	    interpolation: {
	      ...tOptions.interpolation,
	      prefix: '#$?',
	      suffix: '?$#'
	    }
	  };
	  const combinedTOpts = {
	    ...tOptions,
	    context: context || tOptions.context,
	    count,
	    ...values,
	    ...interpolationOverride,
	    defaultValue,
	    ns: namespaces
	  };
	  const translation = key ? t(key, combinedTOpts) : defaultValue;
	  if (components) {
	    Object.keys(components).forEach(c => {
	      const componentKey = components[c].key || c;
	      const comp = react.cloneElement(components[c], {
	        key: componentKey
	      });
	      if (!comp.props || !comp.props.children || translation.indexOf(`${c}/>`) < 0 && translation.indexOf(`${c} />`) < 0) return;
	      function Componentized() {
	        return react.createElement(react.Fragment, null, comp);
	      }
	      components[c] = react.createElement(Componentized);
	    });
	  }
	  const content = renderNodes(components || children, translation, i18n, reactI18nextOptions, combinedTOpts, shouldUnescape);
	  const useAsParent = parent ?? reactI18nextOptions.defaultTransParent;
	  return useAsParent ? react.createElement(useAsParent, additionalProps, content) : content;
	}

	const initReactI18next = {
	  type: '3rdParty',
	  init(instance) {
	    setDefaults(instance.options.react);
	    setI18n(instance);
	  }
	};

	const I18nContext = react.createContext();
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

	function Trans(_ref) {
	  let {
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
	  } = _ref;
	  const {
	    i18n: i18nFromContext,
	    defaultNS: defaultNSFromContext
	  } = react.useContext(I18nContext) || {};
	  const i18n = i18nFromProps || i18nFromContext || getI18n();
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
	    ns: ns || t?.ns || defaultNSFromContext || i18n?.options?.defaultNS,
	    i18n,
	    t: tFromProps,
	    shouldUnescape,
	    ...additionalProps
	  });
	}

	const usePrevious = (value, ignore) => {
	  const ref = react.useRef();
	  react.useEffect(() => {
	    ref.current = value;
	  }, [value, ignore]);
	  return ref.current;
	};
	const alwaysNewT = (i18n, language, namespace, keyPrefix) => i18n.getFixedT(language, namespace, keyPrefix);
	const useMemoizedT = (i18n, language, namespace, keyPrefix) => react.useCallback(alwaysNewT(i18n, language, namespace, keyPrefix), [i18n, language, namespace, keyPrefix]);
	const useTranslation = function (ns) {
	  let props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  const {
	    i18n: i18nFromProps
	  } = props;
	  const {
	    i18n: i18nFromContext,
	    defaultNS: defaultNSFromContext
	  } = react.useContext(I18nContext) || {};
	  const i18n = i18nFromProps || i18nFromContext || getI18n();
	  if (i18n && !i18n.reportNamespaces) i18n.reportNamespaces = new ReportNamespaces();
	  if (!i18n) {
	    warnOnce('You will need to pass in an i18next instance by using initReactI18next');
	    const notReadyT = (k, optsOrDefaultValue) => {
	      if (isString(optsOrDefaultValue)) return optsOrDefaultValue;
	      if (isObject(optsOrDefaultValue) && isString(optsOrDefaultValue.defaultValue)) return optsOrDefaultValue.defaultValue;
	      return Array.isArray(k) ? k[k.length - 1] : k;
	    };
	    const retNotReady = [notReadyT, {}, false];
	    retNotReady.t = notReadyT;
	    retNotReady.i18n = {};
	    retNotReady.ready = false;
	    return retNotReady;
	  }
	  if (i18n.options.react?.wait) warnOnce('It seems you are still using the old wait option, you may migrate to the new useSuspense behaviour.');
	  const i18nOptions = {
	    ...getDefaults(),
	    ...i18n.options.react,
	    ...props
	  };
	  const {
	    useSuspense,
	    keyPrefix
	  } = i18nOptions;
	  let namespaces = ns || defaultNSFromContext || i18n.options?.defaultNS;
	  namespaces = isString(namespaces) ? [namespaces] : namespaces || ['translation'];
	  i18n.reportNamespaces.addUsedNamespaces?.(namespaces);
	  const ready = (i18n.isInitialized || i18n.initializedStoreOnce) && namespaces.every(n => hasLoadedNamespace(n, i18n, i18nOptions));
	  const memoGetT = useMemoizedT(i18n, props.lng || null, i18nOptions.nsMode === 'fallback' ? namespaces : namespaces[0], keyPrefix);
	  const getT = () => memoGetT;
	  const getNewT = () => alwaysNewT(i18n, props.lng || null, i18nOptions.nsMode === 'fallback' ? namespaces : namespaces[0], keyPrefix);
	  const [t, setT] = react.useState(getT);
	  let joinedNS = namespaces.join();
	  if (props.lng) joinedNS = `${props.lng}${joinedNS}`;
	  const previousJoinedNS = usePrevious(joinedNS);
	  const isMounted = react.useRef(true);
	  react.useEffect(() => {
	    const {
	      bindI18n,
	      bindI18nStore
	    } = i18nOptions;
	    isMounted.current = true;
	    if (!ready && !useSuspense) {
	      if (props.lng) {
	        loadLanguages(i18n, props.lng, namespaces, () => {
	          if (isMounted.current) setT(getNewT);
	        });
	      } else {
	        loadNamespaces(i18n, namespaces, () => {
	          if (isMounted.current) setT(getNewT);
	        });
	      }
	    }
	    if (ready && previousJoinedNS && previousJoinedNS !== joinedNS && isMounted.current) {
	      setT(getNewT);
	    }
	    const boundReset = () => {
	      if (isMounted.current) setT(getNewT);
	    };
	    if (bindI18n) i18n?.on(bindI18n, boundReset);
	    if (bindI18nStore) i18n?.store.on(bindI18nStore, boundReset);
	    return () => {
	      isMounted.current = false;
	      if (i18n) bindI18n?.split(' ').forEach(e => i18n.off(e, boundReset));
	      if (bindI18nStore && i18n) bindI18nStore.split(' ').forEach(e => i18n.store.off(e, boundReset));
	    };
	  }, [i18n, joinedNS]);
	  react.useEffect(() => {
	    if (isMounted.current && ready) {
	      setT(getT);
	    }
	  }, [i18n, keyPrefix, ready]);
	  const ret = [t, i18n, ready];
	  ret.t = t;
	  ret.i18n = i18n;
	  ret.ready = ready;
	  if (ready) return ret;
	  if (!ready && !useSuspense) return ret;
	  throw new Promise(resolve => {
	    if (props.lng) {
	      loadLanguages(i18n, props.lng, namespaces, () => resolve());
	    } else {
	      loadNamespaces(i18n, namespaces, () => resolve());
	    }
	  });
	};

	const withTranslation = function (ns) {
	  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  return function Extend(WrappedComponent) {
	    function I18nextWithTranslation(_ref) {
	      let {
	        forwardedRef,
	        ...rest
	      } = _ref;
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
	      return react.createElement(WrappedComponent, passDownProps);
	    }
	    I18nextWithTranslation.displayName = `withI18nextTranslation(${getDisplayName(WrappedComponent)})`;
	    I18nextWithTranslation.WrappedComponent = WrappedComponent;
	    const forwardRef = (props, ref) => react.createElement(I18nextWithTranslation, Object.assign({}, props, {
	      forwardedRef: ref
	    }));
	    return options.withRef ? react.forwardRef(forwardRef) : I18nextWithTranslation;
	  };
	};

	const Translation = _ref => {
	  let {
	    ns,
	    children,
	    ...options
	  } = _ref;
	  const [t, i18n, ready] = useTranslation(ns, options);
	  return children(t, {
	    i18n,
	    lng: i18n.language
	  }, ready);
	};

	function I18nextProvider(_ref) {
	  let {
	    i18n,
	    defaultNS,
	    children
	  } = _ref;
	  const value = react.useMemo(() => ({
	    i18n,
	    defaultNS
	  }), [i18n, defaultNS]);
	  return react.createElement(I18nContext.Provider, {
	    value
	  }, children);
	}

	const useSSR = function (initialI18nStore, initialLanguage) {
	  let props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	  const {
	    i18n: i18nFromProps
	  } = props;
	  const {
	    i18n: i18nFromContext
	  } = react.useContext(I18nContext) || {};
	  const i18n = i18nFromProps || i18nFromContext || getI18n();
	  if (i18n.options?.isClone) return;
	  if (initialI18nStore && !i18n.initializedStoreOnce) {
	    i18n.services.resourceStore.data = initialI18nStore;
	    i18n.options.ns = Object.values(initialI18nStore).reduce((mem, lngResources) => {
	      Object.keys(lngResources).forEach(ns => {
	        if (mem.indexOf(ns) < 0) mem.push(ns);
	      });
	      return mem;
	    }, i18n.options.ns);
	    i18n.initializedStoreOnce = true;
	    i18n.isInitialized = true;
	  }
	  if (initialLanguage && !i18n.initializedLanguageOnce) {
	    i18n.changeLanguage(initialLanguage);
	    i18n.initializedLanguageOnce = true;
	  }
	};

	const withSSR = () => function Extend(WrappedComponent) {
	  function I18nextWithSSR(_ref) {
	    let {
	      initialI18nStore,
	      initialLanguage,
	      ...rest
	    } = _ref;
	    useSSR(initialI18nStore, initialLanguage);
	    return react.createElement(WrappedComponent, {
	      ...rest
	    });
	  }
	  I18nextWithSSR.getInitialProps = composeInitialProps(WrappedComponent);
	  I18nextWithSSR.displayName = `withI18nextSSR(${getDisplayName(WrappedComponent)})`;
	  I18nextWithSSR.WrappedComponent = WrappedComponent;
	  return I18nextWithSSR;
	};

	const date = () => '';
	const time = () => '';
	const number = () => '';
	const select = () => '';
	const plural = () => '';
	const selectOrdinal = () => '';

	exports.I18nContext = I18nContext;
	exports.I18nextProvider = I18nextProvider;
	exports.Trans = Trans;
	exports.TransWithoutContext = Trans$1;
	exports.Translation = Translation;
	exports.composeInitialProps = composeInitialProps;
	exports.date = date;
	exports.getDefaults = getDefaults;
	exports.getI18n = getI18n;
	exports.getInitialProps = getInitialProps;
	exports.initReactI18next = initReactI18next;
	exports.number = number;
	exports.plural = plural;
	exports.select = select;
	exports.selectOrdinal = selectOrdinal;
	exports.setDefaults = setDefaults;
	exports.setI18n = setI18n;
	exports.time = time;
	exports.useSSR = useSSR;
	exports.useTranslation = useTranslation;
	exports.withSSR = withSSR;
	exports.withTranslation = withTranslation;

}));

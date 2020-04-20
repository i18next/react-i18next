(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = global || self, factory(global.ReactI18next = {}, global.React));
}(this, function (exports, React) { 'use strict';

  var React__default = 'default' in React ? React['default'] : React;

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(source, true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(source).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  /**
   * This file automatically generated from `pre-publish.js`.
   * Do not manually edit.
   */
  var voidElements = {
    "area": true,
    "base": true,
    "br": true,
    "col": true,
    "embed": true,
    "hr": true,
    "img": true,
    "input": true,
    "keygen": true,
    "link": true,
    "menuitem": true,
    "meta": true,
    "param": true,
    "source": true,
    "track": true,
    "wbr": true
  };

  var attrRE = /([\w-]+)|=|(['"])([.\s\S]*?)\2/g;



  var parseTag = function (tag) {
    var i = 0;
    var key;
    var expectingValueAfterEquals = true;
    var res = {
      type: 'tag',
      name: '',
      voidElement: false,
      attrs: {},
      children: []
    };
    tag.replace(attrRE, function (match) {
      if (match === '=') {
        expectingValueAfterEquals = true;
        i++;
        return;
      }

      if (!expectingValueAfterEquals) {
        if (key) {
          res.attrs[key] = key; // boolean attribute
        }

        key = match;
      } else {
        if (i === 0) {
          if (voidElements[match] || tag.charAt(tag.length - 2) === '/') {
            res.voidElement = true;
          }

          res.name = match;
        } else {
          res.attrs[key] = match.replace(/^['"]|['"]$/g, '');
          key = undefined;
        }
      }

      i++;
      expectingValueAfterEquals = false;
    });
    return res;
  };

  /*jshint -W030 */
  var tagRE = /(?:<!--[\S\s]*?-->|<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>)/g;

   // re-used obj for quick lookups of components


  var empty = Object.create ? Object.create(null) : {}; // common logic for pushing a child node onto a list

  function pushTextNode(list, html, level, start, ignoreWhitespace) {
    // calculate correct end of the content slice in case there's
    // no tag after the text node.
    var end = html.indexOf('<', start);
    var content = html.slice(start, end === -1 ? undefined : end); // if a node is nothing but whitespace, collapse it as the spec states:
    // https://www.w3.org/TR/html4/struct/text.html#h-9.1

    if (/^\s*$/.test(content)) {
      content = ' ';
    } // don't add whitespace-only text nodes if they would be trailing text nodes
    // or if they would be leading whitespace-only text nodes:
    //  * end > -1 indicates this is not a trailing text node
    //  * leading node is when level is -1 and list has length 0


    if (!ignoreWhitespace && end > -1 && level + list.length >= 0 || content !== ' ') {
      list.push({
        type: 'text',
        content: content
      });
    }
  }

  var parse = function parse(html, options) {
    options || (options = {});
    options.components || (options.components = empty);
    var result = [];
    var current;
    var level = -1;
    var arr = [];
    var byTag = {};
    var inComponent = false;
    html.replace(tagRE, function (tag, index) {
      if (inComponent) {
        if (tag !== '</' + current.name + '>') {
          return;
        } else {
          inComponent = false;
        }
      }

      var isOpen = tag.charAt(1) !== '/';
      var isComment = tag.indexOf('<!--') === 0;
      var start = index + tag.length;
      var nextChar = html.charAt(start);
      var parent;

      if (isOpen && !isComment) {
        level++;
        current = parseTag(tag);

        if (current.type === 'tag' && options.components[current.name]) {
          current.type = 'component';
          inComponent = true;
        }

        if (!current.voidElement && !inComponent && nextChar && nextChar !== '<') {
          pushTextNode(current.children, html, level, start, options.ignoreWhitespace);
        }

        byTag[current.tagName] = current; // if we're at root, push new base node

        if (level === 0) {
          result.push(current);
        }

        parent = arr[level - 1];

        if (parent) {
          parent.children.push(current);
        }

        arr[level] = current;
      }

      if (isComment || !isOpen || current.voidElement) {
        if (!isComment) {
          level--;
        }

        if (!inComponent && nextChar !== '<' && nextChar) {
          // trailing text node
          // if we're at the root, push a base text node. otherwise add as
          // a child to the current node.
          parent = level === -1 ? result : arr[level].children;
          pushTextNode(parent, html, level, start, options.ignoreWhitespace);
        }
      }
    }); // If the "html" passed isn't actually html, add it as a text node.

    if (!result.length && html.length) {
      pushTextNode(result, html, 0, 0, options.ignoreWhitespace);
    }

    return result;
  };

  function attrString(attrs) {
    var buff = [];

    for (var key in attrs) {
      buff.push(key + '="' + attrs[key] + '"');
    }

    if (!buff.length) {
      return '';
    }

    return ' ' + buff.join(' ');
  }

  function stringify(buff, doc) {
    switch (doc.type) {
      case 'text':
        return buff + doc.content;

      case 'tag':
        buff += '<' + doc.name + (doc.attrs ? attrString(doc.attrs) : '') + (doc.voidElement ? '/>' : '>');

        if (doc.voidElement) {
          return buff;
        }

        return buff + doc.children.reduce(stringify, '') + '</' + doc.name + '>';
    }
  }

  var stringify_1 = function (doc) {
    return doc.reduce(function (token, rootEl) {
      return token + stringify('', rootEl);
    }, '');
  };

  var htmlParseStringify2 = {
    parse: parse,
    stringify: stringify_1
  };

  var defaultOptions = {
    bindI18n: 'languageChanged',
    bindI18nStore: '',
    // nsMode: 'fallback' // loop through all namespaces given to hook, HOC, render prop for key lookup
    transEmptyNodeValue: '',
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
    // hashTransKey: key => key // calculate a key for Trans component based on defaultValue
    useSuspense: true
  };
  var i18nInstance;
  var hasUsedI18nextProvider;
  var I18nContext = React__default.createContext();
  function usedI18nextProvider(used) {
    hasUsedI18nextProvider = used;
  }
  function getHasUsedI18nextProvider() {
    return hasUsedI18nextProvider;
  }
  function setDefaults() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    defaultOptions = _objectSpread2({}, defaultOptions, {}, options);
  }
  function getDefaults() {
    return defaultOptions;
  }
  var ReportNamespaces =
  /*#__PURE__*/
  function () {
    function ReportNamespaces() {
      _classCallCheck(this, ReportNamespaces);

      this.usedNamespaces = {};
    }

    _createClass(ReportNamespaces, [{
      key: "addUsedNamespaces",
      value: function addUsedNamespaces(namespaces) {
        var _this = this;

        namespaces.forEach(function (ns) {
          if (!_this.usedNamespaces[ns]) _this.usedNamespaces[ns] = true;
        });
      }
    }, {
      key: "getUsedNamespaces",
      value: function getUsedNamespaces() {
        return Object.keys(this.usedNamespaces);
      }
    }]);

    return ReportNamespaces;
  }();
  function setI18n(instance) {
    i18nInstance = instance;
  }
  function getI18n() {
    return i18nInstance;
  }
  var initReactI18next = {
    type: '3rdParty',
    init: function init(instance) {
      setDefaults(instance.options.react);
      setI18n(instance);
    }
  };
  function composeInitialProps(ForComponent) {
    return function (ctx) {
      return new Promise(function (resolve) {
        var i18nInitialProps = getInitialProps();

        if (ForComponent.getInitialProps) {
          ForComponent.getInitialProps(ctx).then(function (componentsInitialProps) {
            resolve(_objectSpread2({}, componentsInitialProps, {}, i18nInitialProps));
          });
        } else {
          resolve(i18nInitialProps);
        }
      });
    }; // Avoid async for now - so we do not need to pull in regenerator
    // return async ctx => {
    //   const componentsInitialProps = ForComponent.getInitialProps
    //     ? await ForComponent.getInitialProps(ctx)
    //     : {};
    //   const i18nInitialProps = getInitialProps();
    //   return {
    //     ...componentsInitialProps,
    //     ...i18nInitialProps,
    //   };
    // };
  }
  function getInitialProps() {
    var i18n = getI18n();
    var namespaces = i18n.reportNamespaces ? i18n.reportNamespaces.getUsedNamespaces() : [];
    var ret = {};
    var initialI18nStore = {};
    i18n.languages.forEach(function (l) {
      initialI18nStore[l] = {};
      namespaces.forEach(function (ns) {
        initialI18nStore[l][ns] = i18n.getResourceBundle(l, ns) || {};
      });
    });
    ret.initialI18nStore = initialI18nStore;
    ret.initialLanguage = i18n.language;
    return ret;
  }

  function warn() {
    if (console && console.warn) {
      var _console;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (typeof args[0] === 'string') args[0] = "react-i18next:: ".concat(args[0]);

      (_console = console).warn.apply(_console, args);
    }
  }
  var alreadyWarned = {};
  function warnOnce() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (typeof args[0] === 'string' && alreadyWarned[args[0]]) return;
    if (typeof args[0] === 'string') alreadyWarned[args[0]] = new Date();
    warn.apply(void 0, args);
  } // not needed right now
  //
  // export function deprecated(...args) {
  //   if (process && process.env && (!"development" || "development" === 'development')) {
  //     if (typeof args[0] === 'string') args[0] = `deprecation warning -> ${args[0]}`;
  //     warnOnce(...args);
  //   }
  // }

  function loadNamespaces(i18n, ns, cb) {
    i18n.loadNamespaces(ns, function () {
      // delay ready if not yet initialized i18n instance
      if (i18n.isInitialized) {
        cb();
      } else {
        var initialized = function initialized() {
          // due to emitter removing issue in i18next we need to delay remove
          setTimeout(function () {
            i18n.off('initialized', initialized);
          }, 0);
          cb();
        };

        i18n.on('initialized', initialized);
      }
    });
  }
  function hasLoadedNamespace(ns, i18n) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (!i18n.languages || !i18n.languages.length) {
      warnOnce('i18n.languages were undefined or empty', i18n.languages);
      return true;
    }

    var lng = i18n.languages[0];
    var fallbackLng = i18n.options ? i18n.options.fallbackLng : false;
    var lastLng = i18n.languages[i18n.languages.length - 1]; // we're in cimode so this shall pass

    if (lng.toLowerCase() === 'cimode') return true;

    var loadNotPending = function loadNotPending(l, n) {
      var loadState = i18n.services.backendConnector.state["".concat(l, "|").concat(n)];
      return loadState === -1 || loadState === 2;
    }; // bound to trigger on event languageChanging
    // so set ready to false while we are changing the language
    // and namespace pending (depends on having a backend)


    if (options.bindI18n && options.bindI18n.indexOf('languageChanging') > -1 && i18n.services.backendConnector.backend && i18n.isLanguageChangingTo && !loadNotPending(i18n.isLanguageChangingTo, ns)) return false; // loaded -> SUCCESS

    if (i18n.hasResourceBundle(lng, ns)) return true; // were not loading at all -> SEMI SUCCESS

    if (!i18n.services.backendConnector.backend) return true; // failed loading ns - but at least fallback is not pending -> SEMI SUCCESS

    if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
    return false;
  }
  function getDisplayName(Component) {
    return Component.displayName || Component.name || (typeof Component === 'string' && Component.length > 0 ? Component : 'Unknown');
  }

  function hasChildren(node) {
    return node && (node.children || node.props && node.props.children);
  }

  function getChildren(node) {
    if (!node) return [];
    return node && node.children ? node.children : node.props && node.props.children;
  }

  function hasValidReactChildren(children) {
    if (Object.prototype.toString.call(children) !== '[object Array]') return false;
    return children.every(function (child) {
      return React__default.isValidElement(child);
    });
  }

  function getAsArray(data) {
    return Array.isArray(data) ? data : [data];
  }

  function nodesToString(startingString, children, index, i18nOptions) {
    if (!children) return '';
    var stringNode = startingString;
    var childrenArray = getAsArray(children);
    var keepArray = i18nOptions.transKeepBasicHtmlNodesFor || [];
    childrenArray.forEach(function (child, i) {
      var elementKey = "".concat(i);

      if (typeof child === 'string') {
        stringNode = "".concat(stringNode).concat(child);
      } else if (hasChildren(child)) {
        var elementTag = keepArray.indexOf(child.type) > -1 && Object.keys(child.props).length === 1 && typeof hasChildren(child) === 'string' ? child.type : elementKey;

        if (child.props && child.props.i18nIsDynamicList) {
          // we got a dynamic list like "<ul>{['a', 'b'].map(item => ( <li key={item}>{item}</li> ))}</ul>""
          // the result should be "<0></0>" and not "<0><0>a</0><1>b</1></0>"
          stringNode = "".concat(stringNode, "<").concat(elementTag, "></").concat(elementTag, ">");
        } else {
          // regular case mapping the inner children
          stringNode = "".concat(stringNode, "<").concat(elementTag, ">").concat(nodesToString('', getChildren(child), i + 1, i18nOptions), "</").concat(elementTag, ">");
        }
      } else if (React__default.isValidElement(child)) {
        if (keepArray.indexOf(child.type) > -1 && Object.keys(child.props).length === 0) {
          stringNode = "".concat(stringNode, "<").concat(child.type, "/>");
        } else {
          stringNode = "".concat(stringNode, "<").concat(elementKey, "></").concat(elementKey, ">");
        }
      } else if (_typeof(child) === 'object') {
        var clone = _objectSpread2({}, child);

        var format = clone.format;
        delete clone.format;
        var keys = Object.keys(clone);

        if (format && keys.length === 1) {
          stringNode = "".concat(stringNode, "{{").concat(keys[0], ", ").concat(format, "}}");
        } else if (keys.length === 1) {
          stringNode = "".concat(stringNode, "{{").concat(keys[0], "}}");
        } else {
          // not a valid interpolation object (can only contain one value plus format)
          warn("react-i18next: the passed in object contained more than one variable - the object should look like {{ value, format }} where format is optional.", child);
        }
      } else {
        warn("Trans: the passed in value is invalid - seems you passed in a variable like {number} - please pass in variables for interpolation as full objects like {{number}}.", child);
      }
    });
    return stringNode;
  }

  function renderNodes(children, targetString, i18n, i18nOptions, combinedTOpts) {
    if (targetString === '') return []; // check if contains tags we need to replace from html string to react nodes

    var keepArray = i18nOptions.transKeepBasicHtmlNodesFor || [];
    var emptyChildrenButNeedsHandling = targetString && new RegExp(keepArray.join('|')).test(targetString); // no need to replace tags in the targetstring

    if (!children && !emptyChildrenButNeedsHandling) return [targetString]; // v2 -> interpolates upfront no need for "some <0>{{var}}</0>"" -> will be just "some {{var}}" in translation file

    var data = {};

    function getData(childs) {
      var childrenArray = getAsArray(childs);
      childrenArray.forEach(function (child) {
        if (typeof child === 'string') return;
        if (hasChildren(child)) getData(getChildren(child));else if (_typeof(child) === 'object' && !React__default.isValidElement(child)) Object.assign(data, child);
      });
    }

    getData(children);
    var interpolatedString = i18n.services.interpolator.interpolate(targetString, _objectSpread2({}, data, {}, combinedTOpts), i18n.language); // parse ast from string with additional wrapper tag
    // -> avoids issues in parser removing prepending text nodes

    var ast = htmlParseStringify2.parse("<0>".concat(interpolatedString, "</0>"));

    function mapAST(reactNode, astNode) {
      var reactNodes = getAsArray(reactNode);
      var astNodes = getAsArray(astNode);
      return astNodes.reduce(function (mem, node, i) {
        var translationContent = node.children && node.children[0] && node.children[0].content;

        if (node.type === 'tag') {
          var child = reactNodes[parseInt(node.name, 10)] || {};
          var isElement = React__default.isValidElement(child);

          if (typeof child === 'string') {
            mem.push(child);
          } else if (hasChildren(child)) {
            var childs = getChildren(child);
            var mappedChildren = mapAST(childs, node.children);
            var inner = hasValidReactChildren(childs) && mappedChildren.length === 0 ? childs : mappedChildren;
            if (child.dummy) child.children = inner; // needed on preact!

            mem.push(React__default.cloneElement(child, _objectSpread2({}, child.props, {
              key: i
            }), inner));
          } else if (emptyChildrenButNeedsHandling && _typeof(child) === 'object' && child.dummy && !isElement) {
            // we have a empty Trans node (the dummy element) with a targetstring that contains html tags needing
            // conversion to react nodes
            // so we just need to map the inner stuff
            var _inner = mapAST(reactNodes
            /* wrong but we need something */
            , node.children);

            mem.push(React__default.cloneElement(child, _objectSpread2({}, child.props, {
              key: i
            }), _inner));
          } else if (Number.isNaN(parseFloat(node.name))) {
            if (i18nOptions.transSupportBasicHtmlNodes && keepArray.indexOf(node.name) > -1) {
              if (node.voidElement) {
                mem.push(React__default.createElement(node.name, {
                  key: "".concat(node.name, "-").concat(i)
                }));
              } else {
                var _inner2 = mapAST(reactNodes
                /* wrong but we need something */
                , node.children);

                mem.push(React__default.createElement(node.name, {
                  key: "".concat(node.name, "-").concat(i)
                }, _inner2));
              }
            } else if (node.voidElement) {
              mem.push("<".concat(node.name, " />"));
            } else {
              var _inner3 = mapAST(reactNodes
              /* wrong but we need something */
              , node.children);

              mem.push("<".concat(node.name, ">").concat(_inner3, "</").concat(node.name, ">"));
            }
          } else if (_typeof(child) === 'object' && !isElement) {
            var content = node.children[0] ? translationContent : null; // v1
            // as interpolation was done already we just have a regular content node
            // in the translation AST while having an object in reactNodes
            // -> push the content no need to interpolate again

            if (content) mem.push(content);
          } else if (node.children.length === 1 && translationContent) {
            // If component does not have children, but translation - has
            // with this in component could be components={[<span class='make-beautiful'/>]} and in translation - 'some text <0>some highlighted message</0>'
            mem.push(React__default.cloneElement(child, _objectSpread2({}, child.props, {
              key: i
            }), translationContent));
          } else {
            mem.push(React__default.cloneElement(child, _objectSpread2({}, child.props, {
              key: i
            })));
          }
        } else if (node.type === 'text') {
          mem.push(node.content);
        }

        return mem;
      }, []);
    } // call mapAST with having react nodes nested into additional node like
    // we did for the string ast from translation
    // return the children of that extra node to get expected result


    var result = mapAST([{
      dummy: true,
      children: children
    }], ast);
    return getChildren(result[0]);
  }

  function Trans(_ref) {
    var children = _ref.children,
        count = _ref.count,
        parent = _ref.parent,
        i18nKey = _ref.i18nKey,
        tOptions = _ref.tOptions,
        values = _ref.values,
        defaults = _ref.defaults,
        components = _ref.components,
        ns = _ref.ns,
        i18nFromProps = _ref.i18n,
        tFromProps = _ref.t,
        additionalProps = _objectWithoutProperties(_ref, ["children", "count", "parent", "i18nKey", "tOptions", "values", "defaults", "components", "ns", "i18n", "t"]);

    var ReactI18nContext = React.useContext(I18nContext);

    var _ref2 = getHasUsedI18nextProvider() ? ReactI18nContext || {} : {},
        i18nFromContext = _ref2.i18n,
        defaultNSFromContext = _ref2.defaultNS;

    var i18n = i18nFromProps || i18nFromContext || getI18n();

    if (!i18n) {
      warnOnce('You will need pass in an i18next instance by using i18nextReactModule');
      return children;
    }

    var t = tFromProps || i18n.t.bind(i18n) || function (k) {
      return k;
    };

    var reactI18nextOptions = _objectSpread2({}, getDefaults(), {}, i18n.options && i18n.options.react);

    var useAsParent = parent !== undefined ? parent : reactI18nextOptions.defaultTransParent; // prepare having a namespace

    var namespaces = ns || t.ns || defaultNSFromContext || i18n.options && i18n.options.defaultNS;
    namespaces = typeof namespaces === 'string' ? [namespaces] : namespaces || ['translation'];
    var defaultValue = defaults || nodesToString('', children, 0, reactI18nextOptions) || reactI18nextOptions.transEmptyNodeValue || i18nKey;
    var hashTransKey = reactI18nextOptions.hashTransKey;
    var key = i18nKey || (hashTransKey ? hashTransKey(defaultValue) : defaultValue);
    var interpolationOverride = values ? {} : {
      interpolation: {
        prefix: '#$?',
        suffix: '?$#'
      }
    };

    var combinedTOpts = _objectSpread2({}, tOptions, {
      count: count
    }, values, {}, interpolationOverride, {
      defaultValue: defaultValue,
      ns: namespaces
    });

    var translation = key ? t(key, combinedTOpts) : defaultValue;
    if (!useAsParent) return renderNodes(components || children, translation, i18n, reactI18nextOptions, combinedTOpts);
    return React__default.createElement(useAsParent, additionalProps, renderNodes(components || children, translation, i18n, reactI18nextOptions, combinedTOpts));
  }

  function useTranslation(ns) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    // assert we have the needed i18nInstance
    var i18nFromProps = props.i18n;
    var ReactI18nContext = React.useContext(I18nContext);

    var _ref = getHasUsedI18nextProvider() ? ReactI18nContext || {} : {},
        i18nFromContext = _ref.i18n,
        defaultNSFromContext = _ref.defaultNS;

    var i18n = i18nFromProps || i18nFromContext || getI18n();
    if (i18n && !i18n.reportNamespaces) i18n.reportNamespaces = new ReportNamespaces();

    if (!i18n) {
      warnOnce('You will need pass in an i18next instance by using initReactI18next');

      var notReadyT = function notReadyT(k) {
        return Array.isArray(k) ? k[k.length - 1] : k;
      };

      var retNotReady = [notReadyT, {}, false];
      retNotReady.t = notReadyT;
      retNotReady.i18n = {};
      retNotReady.ready = false;
      return retNotReady;
    }

    var i18nOptions = _objectSpread2({}, getDefaults(), {}, i18n.options.react, {}, props);

    var useSuspense = i18nOptions.useSuspense; // prepare having a namespace

    var namespaces = ns || defaultNSFromContext || i18n.options && i18n.options.defaultNS;
    namespaces = typeof namespaces === 'string' ? [namespaces] : namespaces || ['translation']; // report namespaces as used

    if (i18n.reportNamespaces.addUsedNamespaces) i18n.reportNamespaces.addUsedNamespaces(namespaces); // are we ready? yes if all namespaces in first language are loaded already (either with data or empty object on failed load)

    var ready = (i18n.isInitialized || i18n.initializedStoreOnce) && namespaces.every(function (n) {
      return hasLoadedNamespace(n, i18n, i18nOptions);
    }); // binding t function to namespace (acts also as rerender trigger)

    function getT() {
      return {
        t: i18n.getFixedT(null, i18nOptions.nsMode === 'fallback' ? namespaces : namespaces[0])
      };
    }

    var _useState = React.useState(getT()),
        _useState2 = _slicedToArray(_useState, 2),
        t = _useState2[0],
        setT = _useState2[1]; // seems we can't have functions as value -> wrap it in obj


    var isMounted = React.useRef(true);
    React.useEffect(function () {
      var bindI18n = i18nOptions.bindI18n,
          bindI18nStore = i18nOptions.bindI18nStore;
      isMounted.current = true; // if not ready and not using suspense load the namespaces
      // in side effect and do not call resetT if unmounted

      if (!ready && !useSuspense) {
        loadNamespaces(i18n, namespaces, function () {
          if (isMounted.current) setT(getT());
        });
      }

      function boundReset() {
        if (isMounted.current) setT(getT());
      } // bind events to trigger change, like languageChanged


      if (bindI18n && i18n) i18n.on(bindI18n, boundReset);
      if (bindI18nStore && i18n) i18n.store.on(bindI18nStore, boundReset); // unbinding on unmount

      return function () {
        isMounted.current = false;
        if (bindI18n && i18n) bindI18n.split(' ').forEach(function (e) {
          return i18n.off(e, boundReset);
        });
        if (bindI18nStore && i18n) bindI18nStore.split(' ').forEach(function (e) {
          return i18n.store.off(e, boundReset);
        });
      };
    }, [namespaces.join()]); // re-run effect whenever list of namespaces changes

    var ret = [t.t, i18n, ready];
    ret.t = t.t;
    ret.i18n = i18n;
    ret.ready = ready; // return hook stuff if ready

    if (ready) return ret; // not yet loaded namespaces -> load them -> and return if useSuspense option set false

    if (!ready && !useSuspense) return ret; // not yet loaded namespaces -> load them -> and trigger suspense

    throw new Promise(function (resolve) {
      loadNamespaces(i18n, namespaces, function () {
        if (isMounted.current) setT(getT());
        resolve();
      });
    });
  }

  function withTranslation(ns) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return function Extend(WrappedComponent) {
      function I18nextWithTranslation(_ref) {
        var forwardedRef = _ref.forwardedRef,
            rest = _objectWithoutProperties(_ref, ["forwardedRef"]);

        var _useTranslation = useTranslation(ns, rest),
            _useTranslation2 = _slicedToArray(_useTranslation, 3),
            t = _useTranslation2[0],
            i18n = _useTranslation2[1],
            ready = _useTranslation2[2];

        var passDownProps = _objectSpread2({}, rest, {
          t: t,
          i18n: i18n,
          tReady: ready
        });

        if (options.withRef && forwardedRef) {
          passDownProps.ref = forwardedRef;
        } else if (!options.withRef && forwardedRef) {
          passDownProps.forwardedRef = forwardedRef;
        }

        return React__default.createElement(WrappedComponent, passDownProps);
      }

      I18nextWithTranslation.displayName = "withI18nextTranslation(".concat(getDisplayName(WrappedComponent), ")");
      I18nextWithTranslation.WrappedComponent = WrappedComponent;

      var forwardRef = function forwardRef(props, ref) {
        return React__default.createElement(I18nextWithTranslation, Object.assign({}, props, {
          forwardedRef: ref
        }));
      };

      return options.withRef ? React__default.forwardRef(forwardRef) : I18nextWithTranslation;
    };
  }

  function Translation(props) {
    var ns = props.ns,
        children = props.children,
        options = _objectWithoutProperties(props, ["ns", "children"]);

    var _useTranslation = useTranslation(ns, options),
        _useTranslation2 = _slicedToArray(_useTranslation, 3),
        t = _useTranslation2[0],
        i18n = _useTranslation2[1],
        ready = _useTranslation2[2];

    return children(t, {
      i18n: i18n,
      lng: i18n.language
    }, ready);
  }

  function I18nextProvider(_ref) {
    var i18n = _ref.i18n,
        defaultNS = _ref.defaultNS,
        children = _ref.children;
    usedI18nextProvider(true);
    return React__default.createElement(I18nContext.Provider, {
      value: {
        i18n: i18n,
        defaultNS: defaultNS
      }
    }, children);
  }

  function useSSR(initialI18nStore, initialLanguage) {
    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var i18nFromProps = props.i18n;
    var ReactI18nContext = React.useContext(I18nContext);

    var _ref = getHasUsedI18nextProvider() ? ReactI18nContext || {} : {},
        i18nFromContext = _ref.i18n;

    var i18n = i18nFromProps || i18nFromContext || getI18n(); // opt out if is a cloned instance, eg. created by i18next-http-middleware on request
    // -> do not set initial stuff on server side

    if (i18n.options && i18n.options.isClone) return; // nextjs / SSR: getting data from next.js or other ssr stack

    if (initialI18nStore && !i18n.initializedStoreOnce) {
      i18n.services.resourceStore.data = initialI18nStore; // add namespaces to the config - so a languageChange call loads all namespaces needed

      i18n.options.ns = Object.values(initialI18nStore).reduce(function (mem, lngResources) {
        Object.keys(lngResources).forEach(function (ns) {
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
  }

  function withSSR() {
    return function Extend(WrappedComponent) {
      function I18nextWithSSR(_ref) {
        var initialI18nStore = _ref.initialI18nStore,
            initialLanguage = _ref.initialLanguage,
            rest = _objectWithoutProperties(_ref, ["initialI18nStore", "initialLanguage"]);

        useSSR(initialI18nStore, initialLanguage);
        return React__default.createElement(WrappedComponent, _objectSpread2({}, rest));
      }

      I18nextWithSSR.getInitialProps = composeInitialProps(WrappedComponent);
      I18nextWithSSR.displayName = "withI18nextSSR(".concat(getDisplayName(WrappedComponent), ")");
      I18nextWithSSR.WrappedComponent = WrappedComponent;
      return I18nextWithSSR;
    };
  }

  exports.I18nContext = I18nContext;
  exports.I18nextProvider = I18nextProvider;
  exports.Trans = Trans;
  exports.Translation = Translation;
  exports.composeInitialProps = composeInitialProps;
  exports.getDefaults = getDefaults;
  exports.getI18n = getI18n;
  exports.getInitialProps = getInitialProps;
  exports.initReactI18next = initReactI18next;
  exports.setDefaults = setDefaults;
  exports.setI18n = setI18n;
  exports.useSSR = useSSR;
  exports.useTranslation = useTranslation;
  exports.withSSR = withSSR;
  exports.withTranslation = withTranslation;

  Object.defineProperty(exports, '__esModule', { value: true });

}));

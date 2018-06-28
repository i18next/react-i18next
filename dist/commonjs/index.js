'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _translate = require('./translate');

Object.defineProperty(exports, 'translate', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_translate).default;
  }
});

var _I18n = require('./I18n');

Object.defineProperty(exports, 'I18n', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_I18n).default;
  }
});

var _Interpolate = require('./Interpolate');

Object.defineProperty(exports, 'Interpolate', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Interpolate).default;
  }
});

var _Trans = require('./Trans');

Object.defineProperty(exports, 'Trans', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Trans).default;
  }
});

var _I18nextProvider = require('./I18nextProvider');

Object.defineProperty(exports, 'I18nextProvider', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_I18nextProvider).default;
  }
});

var _loadNamespaces = require('./loadNamespaces');

Object.defineProperty(exports, 'loadNamespaces', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_loadNamespaces).default;
  }
});

var _context = require('./context');

Object.defineProperty(exports, 'reactI18nextModule', {
  enumerable: true,
  get: function get() {
    return _context.reactI18nextModule;
  }
});
Object.defineProperty(exports, 'setDefaults', {
  enumerable: true,
  get: function get() {
    return _context.setDefaults;
  }
});
Object.defineProperty(exports, 'getDefaults', {
  enumerable: true,
  get: function get() {
    return _context.getDefaults;
  }
});
Object.defineProperty(exports, 'setI18n', {
  enumerable: true,
  get: function get() {
    return _context.setI18n;
  }
});
Object.defineProperty(exports, 'getI18n', {
  enumerable: true,
  get: function get() {
    return _context.getI18n;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
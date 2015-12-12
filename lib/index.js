'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _translate = require('./translate');

var _translate2 = _interopRequireDefault(_translate);

var _I18nextProvider = require('./I18nextProvider');

var _I18nextProvider2 = _interopRequireDefault(_I18nextProvider);

exports['default'] = {
  translate: _translate2['default'],
  I18nextProvider: _I18nextProvider2['default']
};
module.exports = exports['default'];
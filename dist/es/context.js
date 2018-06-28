var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var defaultOptions = {
  wait: false,
  withRef: false,
  bindI18n: 'languageChanged loaded',
  bindStore: 'added removed',
  translateFuncName: 't',
  nsMode: 'default',
  usePureComponent: false
};

var i18n = void 0;

export function setDefaults(options) {
  defaultOptions = _extends({}, defaultOptions, options);
}

export function getDefaults() {
  return defaultOptions;
}

export function setI18n(instance) {
  i18n = instance;
}

export function getI18n() {
  return i18n;
}

export var reactI18nextModule = {
  type: '3rdParty',

  init: function init(instance) {
    setDefaults(instance.options.react);
    setI18n(instance);
  }
};
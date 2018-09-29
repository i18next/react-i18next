import React, { Component } from 'react';
import createReactContext from 'create-react-context';

let defaultOptions = {
  wait: false,
  withRef: false,
  bindI18n: 'languageChanged loaded',
  bindStore: 'added removed',
  translateFuncName: 't',
  nsMode: 'default',
  usePureComponent: false,
  omitBoundRerender: true,
};

let i18n;

export function setDefaults(options) {
  defaultOptions = { ...defaultOptions, ...options };
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

export const reactI18nextModule = {
  type: '3rdParty',

  init(instance) {
    setDefaults(instance.options.react);
    setI18n(instance);
  },
};

export const I18nContext = createReactContext();

// hoc for context
export function withContext() {
  return function Wrapper(WrappedComponent) {
    class WithContext extends Component {
      constructor(props, context) {
        super(props, context);

        this.getWrappedInstance = this.getWrappedInstance.bind(this);
      }

      getWrappedInstance() {
        return this.wrapped;
      }

      render() {
        const extraProps = {
          ref: c => {
            this.wrapped = c;
          },
        };

        return React.createElement(I18nContext.Consumer, null, ctx =>
          React.createElement(WrappedComponent, {
            ...ctx,
            ...this.props,
            ...extraProps,
          })
        );
      }
    }

    return WithContext;
  };
}

import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { shallowEqual } from './utils';
import { withI18n, setDefaults, setI18n } from './context';
import { NamespacesConsumer } from './NamespacesConsumer';

function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}

export function withNamespaces(namespaceArg, options = {}) {
  return function Wrapper(WrappedComponent) {
    class LoadNamespace extends Component {
      shouldComponentUpdate(nextProps) {
        const { i18nOptions } = this.props;
        if (!i18nOptions.usePureComponent && !options.usePureComponent) {
          return true;
        }

        return !shallowEqual(this.props, nextProps);
      }

      render() {
        const { namespaces, i18nOptions } = this.props;
        const mergedI18nOptions = { ...i18nOptions, ...options };
        const extraProps = {};

        if (mergedI18nOptions.innerRef) {
          extraProps.ref = mergedI18nOptions.innerRef;
        }

        return React.createElement(
          NamespacesConsumer,
          {
            ns: namespaces || namespaceArg,
            ...this.props,
            i18nOptions: Object.keys(mergedI18nOptions).length > 0 ? mergedI18nOptions : null,
          },
          (t, { ready, ...rest }) =>
            React.createElement(WrappedComponent, {
              tReady: ready,
              ...this.props,
              ...extraProps,
              ...rest,
            }),
        );
      }
    }

    const LoadNamespaceWithContext = withI18n()(LoadNamespace);

    LoadNamespaceWithContext.WrappedComponent = WrappedComponent;
    LoadNamespaceWithContext.displayName = `LoadNamespace(${getDisplayName(WrappedComponent)})`;
    LoadNamespaceWithContext.namespaces = namespaceArg;

    return hoistStatics(LoadNamespaceWithContext, WrappedComponent);
  };
}

withNamespaces.setDefaults = setDefaults;
withNamespaces.setI18n = setI18n;

export const translate = withNamespaces;

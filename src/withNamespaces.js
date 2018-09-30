import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { shallowEqual } from './utils';
import { withI18n, setDefaults, setI18n } from './context';
import { NamespacesConsumer } from './NamespacesConsumer';
import { deprecated } from './utils';

function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}

export function withNamespaces(namespaceArg, options = {}) {
  return function Wrapper(WrappedComponent) {
    class LoadNamespace extends Component {
      constructor(props) {
        super(props);

        this.namespaces =
          typeof namespaceArg === 'function'
            ? namespaceArg(props)
            : namespaceArg ||
              props.defaultNS ||
              (props.i18n.options && props.i18n.options.defaultNS);
        if (typeof this.namespaces === 'string') this.namespaces = [this.namespaces];

        if (props.reportNS) {
          const namespaces = this.namespaces || [undefined];
          namespaces.forEach(props.reportNS);
        }

        this.getWrappedInstance = this.getWrappedInstance.bind(this);
      }

      shouldComponentUpdate(nextProps) {
        const { i18nOptions } = this.props;
        if (!i18nOptions.usePureComponent && !options.usePureComponent) {
          return true;
        }

        return !shallowEqual(this.props, nextProps);
      }

      getWrappedInstance() {
        const { i18nOptions } = this.props;
        if (!i18nOptions.withRef && !options.usePureComponent) {
          // eslint-disable-next-line no-console
          console.error(
            'To access the wrapped instance, you need to specify ' +
              '{ withRef: true } as the second argument of the translate() call.'
          );
        }

        /* eslint react/no-string-refs: 1 */
        return this.wrappedInstance;
      }

      render() {
        const { i18nOptions } = this.props;
        const mergedI18nOptions = { ...i18nOptions, ...options };
        const extraProps = {};

        if (mergedI18nOptions.withRef) {
          extraProps.ref = c => {
            this.wrappedInstance = c;
          };
        }

        return React.createElement(
          NamespacesConsumer,
          { ns: this.namespaces, ...this.props, i18nOptions: mergedI18nOptions },
          (t, { ready, ...rest }) =>
            React.createElement(WrappedComponent, {
              tReady: ready,
              ...this.props,
              ...extraProps,
              ...rest,
            })
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

let warnedTranslate;
export function translate(ns, opts) {
  if (!warnedTranslate) {
    deprecated(
      'translate was renamed to "withNamespaces" to make it more clear what the HOC does.'
    );
    warnedTranslate = true;
  }
  return withNamespaces(ns, opts);
}

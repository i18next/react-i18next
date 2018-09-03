import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import shallowEqual from './shallowEqual';
import { getDefaults, setDefaults, getI18n, setI18n } from './context';
import I18n from './I18n';

function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}

export default function translate(namespaceArg, options = {}) {

  return function Wrapper(WrappedComponent) {

    class Translate extends Component {
      constructor(props, context) {
        super(props, context);

        this.i18n = props.i18n || options.i18n || context.i18n || getI18n();
        this.namespaces = typeof namespaceArg === 'function' ? (
          namespaceArg(props)
        ) : (
          namespaceArg || context.defaultNS || (this.i18n.options && this.i18n.options.defaultNS)
        );
        if (typeof this.namespaces === 'string') this.namespaces = [this.namespaces];

        const i18nOptions = (this.i18n && this.i18n.options && this.i18n.options.react) || {};
        this.options = { ...getDefaults(), ...i18nOptions, ...options };

        if (context.reportNS) {
          const namespaces = this.namespaces || [undefined];
          namespaces.forEach(context.reportNS);
        }

        this.getWrappedInstance = this.getWrappedInstance.bind(this);
      }

      shouldComponentUpdate(nextProps) {
        if (!this.options.usePureComponent) {
          return true;
        }

        return !shallowEqual(this.props, nextProps);
      }

      getWrappedInstance() {
        if (!this.options.withRef) {
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
        const extraProps = {
        };

        if (this.options.withRef) {
          extraProps.ref = (c) => { this.wrappedInstance = c; };
        }

        return React.createElement(
          I18n,
          { ns: this.namespaces, ...this.options, ...this.props, ...{ i18n: this.i18n } },
          (t, { ready, ...context }) => React.createElement(
            WrappedComponent,
            {
              tReady: ready,
              ...this.props,
              ...extraProps,
              ...context
            }
          )
        );
      }
    }

    Translate.WrappedComponent = WrappedComponent;

    Translate.contextTypes = {
      i18n: PropTypes.object,
      defaultNS: PropTypes.string,
      reportNS: PropTypes.func
    };

    Translate.displayName = `Translate(${getDisplayName(WrappedComponent)})`;

    Translate.namespaces = namespaceArg;

    return hoistStatics(Translate, WrappedComponent);
  };
}

translate.setDefaults = setDefaults;

translate.setI18n = setI18n;

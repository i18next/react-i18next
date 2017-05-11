import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';

function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}

export default function translate(namespaces, options = {}) {
  const { withRef = false, bindI18n = 'languageChanged loaded', bindStore = 'added removed', translateFuncName = 't' } = options;
  let { wait = false } = options;

  return function Wrapper(WrappedComponent) {

    class Translate extends Component {
      constructor(props, context) {
        super(props, context);
        this.i18n = context.i18n || props.i18n;
        namespaces = namespaces || this.i18n.options.defaultNS;
        if (typeof namespaces === 'string') namespaces = [namespaces];

        if (!wait && this.i18n.options.wait) wait = this.i18n.options.wait;

        this.state = {
          i18nLoadedAt: null,
          ready: false
        };

        this.onI18nChanged = this.onI18nChanged.bind(this);
      }

      getChildContext() {
        return { [translateFuncName]: this[translateFuncName] };
      }

      componentWillMount() {
        this[translateFuncName] = this.i18n.getFixedT(null, namespaces);
      }

      componentDidMount() {
        const bind = () => {
          bindI18n && this.i18n.on(bindI18n, this.onI18nChanged);
          bindStore && this.i18n.store && this.i18n.store.on(bindStore, this.onI18nChanged);
        }

        this.mounted = true;
        this.i18n.loadNamespaces(namespaces, () => {
          const ready = () => {
            if (this.mounted) this.setState({ ready: true });
            if (wait && this.mounted) bind();
          }

          if (this.i18n.isInitialized) return ready();

          const initialized = () => {
            // due to emitter removing issue in i18next we need to delay remove
            setTimeout(() => {
              this.i18n.off('initialized', initialized);
            }, 1000);
            ready();
          }
          this.i18n.on('initialized', initialized)
        });
        if (!wait) bind();
      }

      componentWillUnmount() {
        this.mounted = false;
        if (this.onI18nChanged) {
          if (bindI18n) {
            const p = bindI18n.split(' ');
            p.forEach(f => this.i18n.off(f, this.onI18nChanged));
          }
          if (bindStore) {
            const p = bindStore.split(' ');
            p.forEach(f => this.i18n.store && this.i18n.store.off(f, this.onI18nChanged));
          }
        }
      }

      onI18nChanged() {
        if (!this.mounted) return;

        this.setState({ i18nLoadedAt: new Date() });
      }

      getWrappedInstance() {
        if (!withRef) {
          // eslint-disable-next-line no-console
          console.error(
            'To access the wrapped instance, you need to specify ' +
            '{ withRef: true } as the second argument of the translate() call.'
          );
        }

        return this.refs.wrappedInstance;
      }

      render() {
        const { i18nLoadedAt, ready } = this.state;
        const extraProps = { i18nLoadedAt, [translateFuncName]: this[translateFuncName], i18n: this.i18n };

        if (withRef) {
          extraProps.ref = 'wrappedInstance';
        }

        if (!ready && wait) return null;

        return React.createElement(
          WrappedComponent,
          { ...this.props, ...extraProps }
        );
      }
    }

    Translate.WrappedComponent = WrappedComponent;

    Translate.contextTypes = {
      i18n: PropTypes.object
    };

    Translate.childContextTypes = {
      [translateFuncName]: PropTypes.func.isRequired
    };

    Translate.displayName = 'Translate(' + getDisplayName(WrappedComponent) + ')';

    Translate.namespaces = namespaces;

    return hoistStatics(Translate, WrappedComponent);
  };
}

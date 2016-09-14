import React, { Component, PropTypes } from 'react';
import hoistStatics from 'hoist-non-react-statics';

function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}

export default function translate(namespaces, options = {}) {
  const { withRef = false, wait = false, bindI18n = 'languageChanged loaded', bindStore = 'added removed', translateFuncName = 't' } = options;

  return function Wrapper(WrappedComponent) {

    class Translate extends Component {
      constructor(props, context) {
        super(props, context);
        this.i18n = context.i18n;
        namespaces = namespaces || this.i18n.options.defaultNS;

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
          if (this.mounted) this.setState({ ready: true });
          if (wait && this.mounted) bind();
        });
        if (!wait) bind();
      }

      componentWillUnmount() {
        this.mounted = false;
        if (this.onI18nChanged) {
          this.i18n.off('languageChanged', this.onI18nChanged);
          this.i18n.off('loaded', this.onI18nChanged);
          this.i18n.store.off('added', this.onI18nChanged);
          this.i18n.store.off('removed', this.onI18nChanged);
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
        const extraProps = { i18nLoadedAt, [translateFuncName]: this[translateFuncName] };

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
      i18n: PropTypes.object.isRequired
    };

    Translate.childContextTypes = {
      [translateFuncName]: PropTypes.func.isRequired
    };

    Translate.displayName = 'Translate(' + getDisplayName(WrappedComponent) + ')';

    Translate.namespaces = namespaces;

    return hoistStatics(Translate, WrappedComponent);
  };
}

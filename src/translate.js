import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';

function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}

let removedIsInitialSSR = false;

export default function translate(namespaces, options = {}) {
  const { withRef = false, bindI18n = 'languageChanged loaded', bindStore = 'added removed', translateFuncName = 't' } = options;
  let { wait = false } = options;

  return function Wrapper(WrappedComponent) {

    class Translate extends Component {
      constructor(props, context) {
        super(props, context);

        this.i18n = context.i18n || props.i18n || options.i18n;
        namespaces = namespaces || this.i18n.options.defaultNS;
        if (typeof namespaces === 'string') namespaces = [namespaces];

        if (!wait && this.i18n.options && (this.i18n.options.wait || (this.i18n.options.react && this.i18n.options.react.wait))) wait = true;

        this.nsMode = options.nsMode || (this.i18n.options && this.i18n.options.react && this.i18n.options.react.nsMode) || 'default';

        // nextjs SSR: getting data from next.js or other ssr stack
        if (props.initialI18nStore) {
          this.i18n.services.resourceStore.data = props.initialI18nStore;
          wait = false; // we got all passed down already
        }
        if (props.initialLanguage) {
          this.i18n.changeLanguage(props.initialLanguage);
        }

        // provider SSR: data was set in provider and ssr flag was set
        if (this.i18n.options.isInitialSSR) {
          wait = false;
        }

        this.state = {
          i18nLoadedAt: null,
          ready: false
        };

        this.onI18nChanged = this.onI18nChanged.bind(this);
        this.getWrappedInstance = this.getWrappedInstance.bind(this);
      }

      getChildContext() {
        return {
          [translateFuncName]: this[translateFuncName],
          i18n: this.i18n
        };
      }

      componentWillMount() {
        this[translateFuncName] = this.i18n.getFixedT(null, this.nsMode === 'fallback' ? namespaces : namespaces[0]);
      }

      componentDidMount() {
        const bind = () => {
          if (bindI18n && this.i18n) this.i18n.on(bindI18n, this.onI18nChanged);
          if (bindStore && this.i18n.store) this.i18n.store.on(bindStore, this.onI18nChanged);
        };

        this.mounted = true;
        this.i18n.loadNamespaces(namespaces, () => {
          const ready = () => {
            if (this.mounted && !this.state.ready) this.setState({ ready: true });
            if (wait && this.mounted) bind();
          };

          if (this.i18n.isInitialized) {
            ready();
          } else {
            const initialized = () => {
              // due to emitter removing issue in i18next we need to delay remove
              setTimeout(() => {
                this.i18n.off('initialized', initialized);
              }, 1000);
              ready();
            };

            this.i18n.on('initialized', initialized);
          }
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

        /* eslint react/no-string-refs: 1 */
        return this.refs.wrappedInstance;
      }

      render() {
        const { i18nLoadedAt, ready } = this.state;
        const extraProps = {
          i18nLoadedAt,
          [translateFuncName]: this[translateFuncName],
          i18n: this.i18n
        };

        if (withRef) {
          extraProps.ref = 'wrappedInstance';
        }

        if (!ready && wait) return null;

        // remove ssr flag set by provider - first render was done from now on wait if set to wait
        if (this.i18n.options.isInitialSSR && !removedIsInitialSSR) {
          removedIsInitialSSR = true;
          setTimeout(() => {
            delete this.i18n.options.isInitialSSR;
          }, 100);
        }

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
      [translateFuncName]: PropTypes.func.isRequired,
      i18n: PropTypes.object
    };

    Translate.displayName = `Translate(${getDisplayName(WrappedComponent)})`;

    Translate.namespaces = namespaces;

    return hoistStatics(Translate, WrappedComponent);
  };
}

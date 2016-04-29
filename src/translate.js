import React, { Component, PropTypes } from 'react';

function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}

export default function translate(namespaces, options = {}) {
  const { withRef = false } = options;

  return function Wrapper(WrappedComponent) {
    let t, i18n;

    class Translate extends Component {
        constructor(props, context) {
          super(props, context);
          i18n = context.i18n;
          namespaces = namespaces || i18n.options.defaultNS;

          this.state = {
            i18nLoadedAt: null
          };
        }

        getChildContext() {
          return { t: t };
        }

        componentWillMount() {
          this.mounted = true;
          i18n.loadNamespaces(namespaces);
          t = i18n.getFixedT(null, namespaces);
        }

        componentDidMount() {
          this.onI18nChanged = () => {
            if (!this.mounted) return;

            this.setState({ i18nLoadedAt: new Date() });
          };

          i18n.on('languageChanged loaded', this.onI18nChanged);
        }

        componentWillUnmount() {
          this.mounted = false;
          if (this.onI18nChanged) {
            i18n.off('languageChanged', this.onI18nChanged);
            i18n.off('loaded', this.onI18nChanged);
          }
        }

        onI18nChange() {
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
          const { i18nLoadedAt } = this.state;
          const extraProps = { i18nLoadedAt, t };

          if (withRef) {
            extraProps.ref = 'wrappedInstance';
          }
          
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
      t: PropTypes.func.isRequired
    };

    Translate.displayName = 'Translate[' + getDisplayName(WrappedComponent) + ']';

    Translate.namespaces = namespaces;

    return Translate;
  };
}

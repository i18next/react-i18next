import React, { Component, PropTypes } from 'react';

function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}

function translate(namespaces) {
  return function Wrapper(WrappedComponent) {
    let t, i18n;

    class Translate extends Component {
        constructor(props, context) {
          super(props, context);
          i18n = context.i18n;

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

        render() {
          const { i18nLoadedAt } = this.state;
          return React.createElement(
            WrappedComponent,
            { ...this.props, t, i18nLoadedAt }
          );
        }
    }

    Translate.contextTypes = {
      i18n: PropTypes.object.isRequired
    };

    Translate.childContextTypes = {
      t: PropTypes.func.isRequired
    };

    Translate.displayName = 'Translate[' + getDisplayName(WrappedComponent) + ']';

    return Translate;
  };
}

export default translate;

import React, { Component } from 'react';
import { I18nContext, withI18n } from './context';
import { warnOnce, initSSR } from './utils';

let removedIsInitialSSR = false;

export class NamespacesConsumerComponent extends Component {
  constructor(props) {
    super(props);

    if (!props.i18n) {
      this.state = {
        i18nLoadedAt: null,
        ready: false,
      };

      return warnOnce(
        'You will need pass in an i18next instance either by props, using I18nextProvider or by using i18nextReactModule. Learn more https://react.i18next.com/components/overview#getting-the-i-18-n-function-into-the-flow',
      );
    }

    if (typeof props.i18n.then === 'function') {
      this.state = {
        i18nLoadedAt: null,
        ready: false,
      };

      return warnOnce(
        'Detected a promise instead of an i18next instance. Probably you passed the return value of the i18next.init() function, this is not possible anymore with v13 of i18next. Just pass in the i18next instance directly.',
      );
    }

    // nextjs / SSR: getting data from next.js or other ssr stack
    initSSR(props);

    // provider SSR: data was set in provider and ssr flag was set
    if (props.i18n.options && props.i18n.options.isInitialSSR) {
      props.i18nOptions.wait = false;
    }

    // reportNS if needed for SSR
    const namespaces = this.getNamespaces();
    if (props.reportNS) {
      namespaces.forEach(props.reportNS);
    }

    // check if we could flag this ready already as all is loaded
    const language = props.i18n.languages && props.i18n.languages[0];
    const ready = !!language && namespaces.every(ns => props.i18n.hasResourceBundle(language, ns));

    this.state = {
      i18nLoadedAt: null,
      ready,
    };

    this.t = this.getI18nTranslate();

    this.onI18nChanged = this.onI18nChanged.bind(this);
    this.getI18nTranslate = this.getI18nTranslate.bind(this);
    this.namespaces = this.getNamespaces.bind(this);
  }

  componentDidMount() {
    this.loadNamespaces();
  }

  componentDidUpdate(prevProps) {
    // Note that dynamically loading additional namespaces after the initial mount will not block rendering – even if the `wait` option is true.
    if (this.props.ns && prevProps.ns !== this.props.ns) this.loadNamespaces();
  }

  componentWillUnmount() {
    const { i18n, i18nOptions } = this.props;
    this.mounted = false;
    if (this.onI18nChanged) {
      if (i18nOptions.bindI18n) {
        const p = i18nOptions.bindI18n.split(' ');
        p.forEach(f => i18n.off(f, this.onI18nChanged));
      }
      if (i18nOptions.bindStore) {
        const p = i18nOptions.bindStore.split(' ');
        p.forEach(f => i18n.store && i18n.store.off(f, this.onI18nChanged));
      }
    }
  }

  onI18nChanged() {
    const { i18nOptions } = this.props;
    const { ready } = this.state;
    if (!this.mounted) return;
    if (!ready && i18nOptions.omitBoundRerender) return;
    this.t = this.getI18nTranslate();
    this.setState({ i18nLoadedAt: new Date() }); // rerender
  }

  getI18nTranslate() {
    const { i18n, i18nOptions } = this.props;

    const namespaces = this.getNamespaces();
    return i18n.getFixedT(
      null,
      i18nOptions.nsMode === 'fallback'
        ? namespaces
        : namespaces && namespaces.length
        ? namespaces[0]
        : 'translation',
    );
  }

  getNamespaces() {
    const { i18n, ns, defaultNS } = this.props;

    const namespaces =
      typeof ns === 'function'
        ? ns(this.props)
        : ns || defaultNS || (i18n.options && i18n.options.defaultNS);

    return typeof namespaces === 'string' ? [namespaces] : namespaces || [];
  }

  loadNamespaces() {
    const { i18n, i18nOptions } = this.props;
    const { ready } = this.state;

    const bind = () => {
      if (i18nOptions.bindI18n && i18n) i18n.on(i18nOptions.bindI18n, this.onI18nChanged);
      if (i18nOptions.bindStore && i18n.store)
        i18n.store.on(i18nOptions.bindStore, this.onI18nChanged);
    };

    this.mounted = true;
    i18n.loadNamespaces(this.getNamespaces(), () => {
      const handleReady = () => {
        if (this.mounted && !ready) {
          this.setState({ ready: true }, () => {
            if (!i18nOptions.wait) this.onI18nChanged();
          });
        }
        if (i18nOptions.wait && this.mounted) bind();
      };

      if (i18n.isInitialized) {
        handleReady();
      } else {
        const initialized = () => {
          // due to emitter removing issue in i18next we need to delay remove
          setTimeout(() => {
            i18n.off('initialized', initialized);
          }, 1000);
          handleReady();
        };

        i18n.on('initialized', initialized);
      }
    });

    if (!i18nOptions.wait) bind();
  }

  render() {
    const { children, i18n, defaultNS, reportNS, i18nOptions } = this.props;
    const { ready } = this.state || { ready: false }; // fallback if state is null...unknown edge case https://github.com/i18next/react-i18next/issues/615
    const { t } = this;

    if (!ready && i18nOptions.wait) return null;

    // remove ssr flag set by provider - first render was done from now on wait if set to wait
    if (i18n.options && i18n.options.isInitialSSR && !removedIsInitialSSR) {
      removedIsInitialSSR = true;
      setTimeout(() => {
        delete i18n.options.isInitialSSR;
      }, 100);
    }

    return React.createElement(
      I18nContext.Provider,
      {
        value: { i18n, t, defaultNS, reportNS, lng: i18n && i18n.language },
      },
      children(this.t, {
        i18n,
        t,
        lng: i18n.language,
        ready,
      }),
    );
  }
}

export const NamespacesConsumer = withI18n()(NamespacesConsumerComponent);
export const I18n = NamespacesConsumer;

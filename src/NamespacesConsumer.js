import React, { Component } from 'react';
import { I18nContext, withI18n } from './context';
import { deprecated } from './utils';

let removedIsInitialSSR = false;

export class NamespacesConsumerComponent extends Component {
  constructor(props) {
    super(props);

    // nextjs / SSR: getting data from next.js or other ssr stack
    if (props.initialI18nStore) {
      props.i18n.services.resourceStore.data = props.initialI18nStore;
      props.i18nOptions.wait = false; // we got all passed down already
    }
    if (props.initialLanguage) {
      props.i18n.changeLanguage(props.initialLanguage);
    }

    // provider SSR: data was set in provider and ssr flag was set
    if (props.i18n.options && props.i18n.options.isInitialSSR) {
      props.i18nOptions.wait = false;
    }

    const language = props.i18n.languages && props.i18n.languages[0];
    const ready =
      !!language && this.getNamespaces().every(ns => props.i18n.hasResourceBundle(language, ns));

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
          ? this.getNamespaces()[0]
          : 'translation'
    );
  }

  getNamespaces() {
    const { i18n, ns } = this.props;
    const namespace = ns || (i18n.options && i18n.options.defaultNS);
    return typeof namespace === 'string' ? [namespace] : namespace;
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
    const { ready } = this.state;
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
      })
    );
  }
}

export const NamespacesConsumer = withI18n()(NamespacesConsumerComponent);

let warnedI18n;
export function I18n(props) {
  if (!warnedI18n) {
    deprecated(
      'I18n was renamed to "NamespacesConsumer" to make it more clear what the render prop does.'
    );
    warnedI18n = true;
  }
  return <NamespacesConsumer {...props} />;
}

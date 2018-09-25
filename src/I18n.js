import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getDefaults, getI18n } from './context';

let removedIsInitialSSR = false;

export default class I18n extends Component {
  constructor(props, context) {
    super(props, context);

    this.i18n = props.i18n || context.i18n || getI18n();

    const i18nOptions = (this.i18n && this.i18n.options && this.i18n.options.react) || {};
    this.options = { ...getDefaults(), ...i18nOptions, ...props };

    // nextjs SSR: getting data from next.js or other ssr stack
    if (props.initialI18nStore) {
      this.i18n.services.resourceStore.data = props.initialI18nStore;
      this.options.wait = false; // we got all passed down already
    }
    if (props.initialLanguage) {
      this.i18n.changeLanguage(props.initialLanguage);
    }

    // provider SSR: data was set in provider and ssr flag was set
    if (this.i18n.options && this.i18n.options.isInitialSSR) {
      this.options.wait = false;
    }

    const language = this.i18n.languages && this.i18n.languages[0];
    const ready = !!language && this.getNamespaces().every(ns => this.i18n.hasResourceBundle(language, ns));

    this.state = {
      i18nLoadedAt: null,
      ready
    };

    this.t = this.getI18nTranslate();

    this.onI18nChanged = this.onI18nChanged.bind(this);
    this.getI18nTranslate = this.getI18nTranslate.bind(this);
    this.namespaces = this.getNamespaces.bind(this);
  }

  getChildContext() {
    return {
      t: this.t,
      i18n: this.i18n
    };
  }

  componentDidMount() {
    this.loadNamespaces();
  }

  componentDidUpdate(prevProps) {
    // Note that dynamically loading additional namespaces after the initial mount will not block rendering – even if the `wait` option is true.
    if (this.props.ns && prevProps.ns !== this.props.ns) this.loadNamespaces();
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.onI18nChanged) {
      if (this.options.bindI18n) {
        const p = this.options.bindI18n.split(' ');
        p.forEach(f => this.i18n.off(f, this.onI18nChanged));
      }
      if (this.options.bindStore) {
        const p = this.options.bindStore.split(' ');
        p.forEach(f => this.i18n.store && this.i18n.store.off(f, this.onI18nChanged));
      }
    }
  }

  onI18nChanged() {
    if (!this.mounted) return;
    if (!this.state.ready && this.options.omitBoundRerender) return;

    this.t = this.getI18nTranslate();
    this.setState({ i18nLoadedAt: new Date() }); // rerender
  }

  getI18nTranslate() {
    return this.i18n.getFixedT(null, this.options.nsMode === 'fallback' ? this.getNamespaces() : this.getNamespaces()[0]);
  }

  getNamespaces() {
    const ns = this.props.ns || (this.i18n.options && this.i18n.options.defaultNS);
    return typeof ns === 'string' ? [ns] : ns;
  }

  loadNamespaces() {
    const bind = () => {
      if (this.options.bindI18n && this.i18n) this.i18n.on(this.options.bindI18n, this.onI18nChanged);
      if (this.options.bindStore && this.i18n.store) this.i18n.store.on(this.options.bindStore, this.onI18nChanged);
    };

    this.mounted = true;
    this.i18n.loadNamespaces(this.getNamespaces(), () => {
      const ready = () => {
        if (this.mounted && !this.state.ready) this.setState({ ready: true });
        if (this.options.wait && this.mounted) bind();
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

    if (!this.options.wait) bind();
  }

  render() {
    const { children } = this.props;
    const { ready } = this.state;

    if (!ready && this.options.wait) return null;

    // remove ssr flag set by provider - first render was done from now on wait if set to wait
    if (this.i18n.options && this.i18n.options.isInitialSSR && !removedIsInitialSSR) {
      removedIsInitialSSR = true;
      setTimeout(() => {
        delete this.i18n.options.isInitialSSR;
      }, 100);
    }

    return children(this.t, {
      i18n: this.i18n,
      t: this.t,
      lng: this.i18n.language,
      ready
    });
  }
}

I18n.contextTypes = {
  i18n: PropTypes.object
};

I18n.childContextTypes = {
  t: PropTypes.func.isRequired,
  i18n: PropTypes.object
};

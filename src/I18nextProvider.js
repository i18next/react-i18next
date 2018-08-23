import { Component, Children } from 'react';
import PropTypes from 'prop-types';

class I18nextProvider extends Component {
  constructor(props, context) {
    super(props, context);
    this.i18n = props.i18n;
    this.defaultNS = props.defaultNS;
    if (props.initialI18nStore) {
      this.i18n.services.resourceStore.data = props.initialI18nStore;
      this.i18n.options.isInitialSSR = true; // if set will be deleted on first render in translate hoc
    }
    if (props.initialLanguage) {
      this.i18n.changeLanguage(props.initialLanguage);
    }
    this.reportNS = props.reportNS;
  }

  getChildContext() {
    return {
      i18n: this.i18n,
      defaultNS: this.defaultNS,
      reportNS: this.reportNS
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.i18n !== nextProps.i18n) {
      throw new Error('[react-i18next][I18nextProvider]does not support changing the i18n object.');
    }
  }

  render() {
    const { children } = this.props;
    return Children.only(children);
  }
}

I18nextProvider.propTypes = {
  i18n: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  defaultNS: PropTypes.string,
  reportNS: PropTypes.func
};

I18nextProvider.childContextTypes = {
  i18n: PropTypes.object.isRequired,
  defaultNS: PropTypes.string,
  reportNS: PropTypes.func
};

I18nextProvider.defaultProps = {
  defaultNS: undefined,
  reportNS: undefined
};

export default I18nextProvider;

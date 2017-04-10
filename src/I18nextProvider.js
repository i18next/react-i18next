import { Component, Children } from 'react';
import PropTypes from 'prop-types';

class I18nextProvider extends Component {
  constructor(props, context) {
    super(props, context);
    this.i18n = props.i18n;
  }

  getChildContext() {
    return { i18n: this.i18n };
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
  children: PropTypes.element.isRequired
};

I18nextProvider.childContextTypes = {
  i18n: PropTypes.object.isRequired
};

export default I18nextProvider;

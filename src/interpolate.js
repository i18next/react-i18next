import React, { Component, PropTypes } from 'react';

class Interpolate extends Component {

  constructor(props, context) {
    super(props, context);
    this.i18n = context.i18n;
    this.t = context.t;
  }

  render() {
    const parent = this.props.parent || 'span';
    const REGEXP = this.props.regexp || this.i18n.services.interpolator.regexp;

    let tOpts = {...{}, ...this.props.options, ...{interpolation: { prefix: '#$?', suffix: '?$#'}}}
    let format = this.t(this.props.i18nKey, tOpts);

    if (!format || typeof format !== 'string') return React.createElement('noscript', null);

    let children = [];

    format.split(REGEXP).reduce((memo, match, index) => {
      var child;

      if (index % 2 === 0) {
        if (match.length === 0)  return memo;
        child = match;
      } else {
        child = this.props[match];
        if (!this.props[match]) this.i18n.services.logger.warn('interpolator: missed to pass in variable ' + match + ' for interpolating ' + format);
      }

      memo.push(child);
      return memo;
    }, children);

    return React.createElement.apply(this, [parent, this.props].concat(children));
  }
}

Interpolate.contextTypes = {
  i18n: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default Interpolate;

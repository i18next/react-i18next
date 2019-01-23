import React, { Component } from 'react';
import { withI18n } from './context';
import { deprecated } from './utils';

export class InterpolateComponent extends Component {
  constructor(props) {
    super(props);

    deprecated(
      'Interpolate is deprecated and will be removed in the next major version (v9.0.0). Usage can be replaced by the "Trans" component',
    );
  }

  render() {
    const { i18n, t, i18nKey, options, className, style } = this.props;
    const parent = this.props.parent || 'span';
    const REGEXP = this.props.regexp || i18n.services.interpolator.regexp;

    // Set to true if you want to use raw HTML in translation values
    // See https://github.com/i18next/react-i18next/issues/189
    const useDangerouslySetInnerHTML = this.props.useDangerouslySetInnerHTML || false;
    const dangerouslySetInnerHTMLPartElement =
      this.props.dangerouslySetInnerHTMLPartElement || 'span';

    const tOpts = {
      ...{},
      ...options,
      ...{ interpolation: { prefix: '#$?', suffix: '?$#' } },
    };
    const format = t(i18nKey, tOpts);

    if (!format || typeof format !== 'string') return React.createElement('noscript', null);

    const children = [];

    const handleFormat = (key, props) => {
      if (key.indexOf(i18n.options.interpolation.formatSeparator) < 0) {
        if (props[key] === undefined)
          i18n.services.logger.warn(
            `interpolator: missed to pass in variable ${key} for interpolating ${format}`,
          );
        return props[key];
      }

      const p = key.split(i18n.options.interpolation.formatSeparator);
      const k = p.shift().trim();
      const f = p.join(i18n.options.interpolation.formatSeparator).trim();

      if (props[k] === undefined)
        i18n.services.logger.warn(
          `interpolator: missed to pass in variable ${k} for interpolating ${format}`,
        );
      return i18n.options.interpolation.format(props[k], f, i18n.language);
    };

    format.split(REGEXP).reduce((memo, match, index) => {
      let child;

      if (index % 2 === 0) {
        if (match.length === 0) return memo;
        if (useDangerouslySetInnerHTML) {
          child = React.createElement(dangerouslySetInnerHTMLPartElement, {
            dangerouslySetInnerHTML: { __html: match },
          });
        } else {
          child = match;
        }
      } else {
        child = handleFormat(match, this.props);
      }

      memo.push(child);
      return memo;
    }, children);

    const additionalProps = {};
    if (i18n.options.react && i18n.options.react.exposeNamespace) {
      let ns = typeof t.ns === 'string' ? t.ns : t.ns[0];
      if (i18nKey && i18n.options.nsSeparator && i18nKey.indexOf(i18n.options.nsSeparator) > -1) {
        const parts = i18nKey.split(i18n.options.nsSeparator);
        ns = parts[0];
      }
      if (t.ns) additionalProps['data-i18next-options'] = JSON.stringify({ ns });
    }

    if (className) additionalProps.className = className;
    if (style) additionalProps.style = style;

    return React.createElement.apply(this, [parent, additionalProps].concat(children));
  }
}

export const Interpolate = withI18n()(InterpolateComponent);

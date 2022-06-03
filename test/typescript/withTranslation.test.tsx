import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { default as myI18n } from './i18n';

/**
 * see https://react.i18next.com/latest/trans-component
 */

interface MyComponentProps extends WithTranslation {
  bar: 'baz';
}

const defaultProps: Partial<MyComponentProps> = {
  bar: 'baz',
};

const MyComponent = (props: MyComponentProps) => {
  const { t, i18n, tReady } = props;
  const r: boolean = tReady;
  return <h2>{t('title')}</h2>;
};

MyComponent.defaultProps = defaultProps;

// page uses the hook
function defaultUsage() {
  const ExtendedComponent = withTranslation()(MyComponent);
  return <ExtendedComponent bar="baz" />;
}

function defaultUsageWithDefaultProps() {
  const ExtendedComponent = withTranslation()(MyComponent);
  return <ExtendedComponent />;
}

/**
 * see https://react.i18next.com/latest/withtranslation-hoc#withtranslation-params
 */
function withNs() {
  const ExtendedComponent = withTranslation('ns')(MyComponent);
  return <ExtendedComponent bar="baz" />;
}

function withNsArray() {
  const ExtendedComponent = withTranslation(['ns', 'ns2'])(MyComponent);
  return <ExtendedComponent bar="baz" />;
}

/**
 * see https://react.i18next.com/latest/withtranslation-hoc#overriding-the-i-18-next-instance
 */
function withI18nOverride() {
  const ExtendedComponent = withTranslation('ns')(MyComponent);
  return <ExtendedComponent bar="baz" i18n={myI18n} />;
}

/**
 * see https://react.i18next.com/latest/withtranslation-hoc#not-using-suspense
 */
function withSuspense() {
  const ExtendedComponent = withTranslation('ns')(MyComponent);
  return <ExtendedComponent bar="baz" useSuspense={false} />;
}

interface KeyPrefixComponentProps extends WithTranslation<'translation', 'deepPath'> {
  bar: 'baz';
}

const KeyPrefixComponent = (props: KeyPrefixComponentProps) => {
  const { t, i18n, tReady } = props;
  const r: boolean = tReady;
  return <h2>{t('deepKey1')}</h2>;
};

MyComponent.defaultProps = defaultProps;

function withNsAndKeyPrefix() {
  const ExtendedComponent = withTranslation('translation', { keyPrefix: 'deepPath' })(
    KeyPrefixComponent,
  );
  return <ExtendedComponent bar="baz" />;
}

import * as React from 'react';
import { withSSR } from 'react-i18next';

class ClassComponent extends React.Component {
  render() {
    return null;
  }
}

const ExtendedClass = withSSR()(ClassComponent);

<ExtendedClass initialLanguage={'en'} initialI18nStore={{ en: { namespace: { key: 'value' } } }} />;

class ClassComponentWithProps extends React.Component<{ foo: number }> {
  render() {
    return null;
  }
}

const ExtendedClassWithProps = withSSR()(ClassComponentWithProps);

<ExtendedClassWithProps
  initialLanguage={'en'}
  initialI18nStore={{ en: { namespace: { key: 'value' } } }}
  foo={1}
/>;

const FunctionComponent = () => {
  return null;
};

const ExtendedFn = withSSR()(FunctionComponent);

<ExtendedFn initialLanguage={'en'} initialI18nStore={{ en: { namespace: { key: 'value' } } }} />;

const FunctionComponentWithProps: React.FunctionComponent<{ foo: string }> = props => {
  return null;
};

const ExtendedFnWithProp = withSSR()(FunctionComponentWithProps);

<ExtendedFnWithProp
  initialLanguage={'en'}
  initialI18nStore={{ en: { namespace: { key: 'value' } } }}
  foo="bar"
/>;

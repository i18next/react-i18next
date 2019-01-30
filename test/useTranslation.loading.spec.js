import React from 'react';
import { shallow, render, mount } from 'enzyme';
import sinon from 'sinon';
import i18n from './i18n';
import BackendMock from './backendMock';
import { useTranslation } from '../src/useTranslation';

jest.unmock('../src/useTranslation');

const newI18n = i18n.createInstance();
const backend = new BackendMock();
newI18n.use(backend).init({
  lng: 'en',
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false, // not needed for react!!
  },
});

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    const { spy } = this.props;
    spy(error, info);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      // You can render any custom fallback UI
      return <div>Something went wrong.</div>;
    }

    return children;
  }
}

describe('useTranslation loading ns', () => {
  const TestElement = () => {
    const [t] = useTranslation('common', { i18n: newI18n });
    return <div>{t('key1')}</div>;
  };

  it('should wait for correct translation', () => {
    const spy = sinon.spy();

    console.error = jest.fn(); // silent down the error boundary error from react-dom
    const wrapper = mount(
      <ErrorBoundary spy={spy}>
        <TestElement />
      </ErrorBoundary>,
    );

    expect(wrapper.contains(<div>Something went wrong.</div>)).toBe(true);
    expect(spy.callCount).toBe(1);

    backend.flush();
    wrapper.update();

    setTimeout(() => {
      expect(wrapper.contains(<div>test2</div>)).toBe(true);
    }, 50);
  });
});

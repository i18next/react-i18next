import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import i18n from './i18n';
import BackendMock from './backendMock';
import { useTranslation } from '../src/useTranslation';

jest.unmock('../src/useTranslation');

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
  let newI18n;
  let backend;

  beforeEach(() => {
    newI18n = i18n.createInstance();
    backend = new BackendMock();
    newI18n.use(backend).init({
      lng: 'en',
      fallbackLng: 'en',

      interpolation: {
        escapeValue: false, // not needed for react!!
      },
    });
  });

  const TestElement = ({ useSuspense = undefined }) => {
    const [t] = useTranslation('common', { i18n: newI18n, useSuspense });
    return <div>{t('key1')}</div>;
  };

  it('should wait for correct translation', done => {
    const spy = sinon.spy();

    console.error = jest.fn(); // silent down the error boundary error from react-dom
    let wrapper = mount(
      <ErrorBoundary spy={spy}>
        <TestElement />
      </ErrorBoundary>,
    );

    expect(wrapper.contains(<div>Something went wrong.</div>)).toBe(true);
    expect(spy.callCount).toBe(1);

    backend.flush();

    setTimeout(() => {
      // mount again - no suspense recovering from promise resolve
      wrapper = mount(
        <ErrorBoundary spy={spy}>
          <TestElement />
        </ErrorBoundary>,
      );

      // console.log(wrapper.debug());
      expect(wrapper.contains(<div>test</div>)).toBe(true);
      done();
    }, 500);
  });

  it('should wait for correct translation without suspense', done => {
    const spy = sinon.spy();

    let wrapper = mount(
      <ErrorBoundary spy={spy}>
        <TestElement useSuspense={false} />
      </ErrorBoundary>,
    );

    expect(wrapper.contains(<div>key1</div>)).toBe(true);
    expect(spy.callCount).toBe(0);

    backend.flush();

    setTimeout(() => {
      // mount again with translation loaded
      wrapper = mount(
        <ErrorBoundary spy={spy}>
          <TestElement useSuspense={false} />
        </ErrorBoundary>,
      );

      // console.log(wrapper.debug());
      expect(wrapper.contains(<div>test</div>)).toBe(true);
      expect(spy.callCount).toBe(0);
      done();
    }, 500);
  });
});

import React from 'react';
import { mount } from 'enzyme';
import i18n from './i18n';
import { withTranslation } from '../src/withTranslation';

jest.unmock('../src/withTranslation');

describe('withTranslation', () => {
  class TestComponent extends React.Component {
    render() {
      const { t, i18n: instance } = this.props;
      expect(typeof t).toBe('function');
      expect(instance).toBe(i18n);

      return <div>{t('key1')}</div>;
    }
  }

  it('should export wrapped component', () => {
    const HocElement = withTranslation()(TestComponent);
    expect(HocElement.WrappedComponent).toBe(TestComponent);
  });

  it('should render correct content', () => {
    const HocElement = withTranslation()(TestComponent);
    const wrapper = mount(<HocElement />);
    // console.log(wrapper.debug());
    expect(wrapper.contains(<div>test</div>)).toBe(true);
  });

  it('should has ref', () => {
    const HocElement = withTranslation('translation', { withRef: true })(TestComponent);
    const hocRef = React.createRef();
    mount(<HocElement ref={hocRef} />);
    expect(hocRef.current).not.toBeNull();
  });

  it('should also only with options', () => {
    const HocElement = withTranslation({ withRef: true })(TestComponent);
    const hocRef = React.createRef();
    mount(<HocElement ref={hocRef} />);
    expect(hocRef.current).not.toBeNull();
  });
});

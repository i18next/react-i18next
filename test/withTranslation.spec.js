import React from 'react';
import { mount } from 'enzyme';
import i18n from './i18n';
import { withTranslation } from '../src/withTranslation';

jest.unmock('../src/withTranslation');

describe('withTranslation', () => {
  function TestComponent({ t, i18n: instance }) {
    expect(typeof t).toBe('function');
    expect(instance).toBe(i18n);

    return <div>{t('key1')}</div>;
  }
  TestComponent.aStaticAttribute = 'aStaticAttribute';
  TestComponent.aStaticMethod = () => 'aStaticMethod';

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

  it('should pass over static attributes and methods', () => {
    const HocElement = withTranslation()(TestComponent);
    expect(HocElement).toHaveProperty('aStaticAttribute', 'aStaticAttribute');
    expect(HocElement).toHaveProperty('aStaticMethod');
    ``;
    expect(HocElement.aStaticMethod()).toBe('aStaticMethod');
  });

  it('should has ref', () => {
    const HocElement = withTranslation('translation', { withRef: true })(TestComponent);
    const hocRef = React.createRef();
    const parentWrapper = mount(<HocElement ref={hocRef} />);
    expect(hocRef.current).not.toBeNull();
  });
});

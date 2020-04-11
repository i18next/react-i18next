import React from 'react';
import { mount } from 'enzyme';
import { withTranslation } from '../src/withTranslation';
import * as useTranslationModule from '../src/useTranslation';

jest.unmock('../src/withTranslation');

describe('withTranslation with wait option', () => {
  class TestComponent extends React.Component {
    render() {
      return <div>THIS SHOULD NOT BE SHOWN</div>;
    }
  }

  it('should with true', () => {
    const useTranslationMock = jest.spyOn(useTranslationModule, 'useTranslation');
    useTranslationMock.mockImplementation(() => [() => {}, {}, false]);
    const HocElement = withTranslation({ wait: true })(TestComponent);
    const wrapper = mount(<HocElement />);
    // console.log(wrapper.debug());
    expect(wrapper.contains('THIS SHOULD NOT BE SHOWN')).toBe(false);
    expect(wrapper.contains('loading...')).toBe(false);
    useTranslationMock.mockRestore();
  });

  it('should with wait component', () => {
    const useTranslationMock = jest.spyOn(useTranslationModule, 'useTranslation');
    useTranslationMock.mockImplementation(() => [() => {}, null, false]);
    const HocElement = withTranslation({ wait: <h1>loading...</h1> })(TestComponent);
    const wrapper = mount(<HocElement />);
    // console.log(wrapper.debug());
    expect(wrapper.contains('THIS SHOULD NOT BE SHOWN')).toBe(false);
    expect(wrapper.contains('loading...')).toBe(true);
    useTranslationMock.mockRestore();
  });
});

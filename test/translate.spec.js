import React from 'react';
import PropTypes from 'prop-types';
import { shallow, render, mount } from 'enzyme';
import translate from '../src/translate';

jest.unmock('../src/translate');

describe('translate', () => {
  it('should return a function', () => {
    const wrap = translate('namespace', {});
    expect(typeof wrap).toBe('function');
  });
  it('that function should wrap my element and provide many things', () => {
    const wrap = translate(['ns1', 'ns2'], {});
    const Elem = React.createFactory('Elem');
    Elem.displayName = 'Elem';
    Elem.NOT_KNOWN_REACT_STATIC = 'IS HOISTED ?';
    const wrapped = wrap(Elem);
    expect(wrapped.WrappedComponent).toBe(Elem);
    expect(wrapped.displayName).toBe('Translate(Elem)');
    expect(wrapped.namespaces.length).toBe(2);
    expect(wrapped.namespaces[0]).toBe('ns1');
    expect(wrapped.namespaces[1]).toBe('ns2');
    expect(wrapped.NOT_KNOWN_REACT_STATIC).toBe('IS HOISTED ?');
  });

  it('should report a single used namespace to an array', () => {
    const i18n = {
      options: {},
      getFixedT: () => {},
      loadNamespaces: () => {},
      on: () => {},
    };
    translate.setI18n(i18n);

    const namespaces = [];
    const C = translate('ns1')(() => <div>text</div>);
    mount(<C reportNS={ns => namespaces.push(ns)} />);
    expect(namespaces).toEqual(['ns1']);
  });
  it('should report multiple used namespaces to an array', () => {
    const i18n = {
      options: {},
      getFixedT: () => {},
      loadNamespaces: () => {},
      on: () => {},
    };
    translate.setI18n(i18n);

    const namespaces = [];
    const C = translate(['ns1', 'ns2'])(() => <div>text</div>);
    mount(<C reportNS={ns => namespaces.push(ns)} />);

    expect(namespaces).toEqual(['ns1', 'ns2']);
  });
  it('should report undefined if no namespace used and no default namespace defined', () => {
    const i18n = {
      options: {},
      getFixedT: () => {},
      loadNamespaces: () => {},
      on: () => {},
    };
    translate.setI18n(i18n);

    const namespaces = [];
    const C = translate()(() => <div>text</div>);
    mount(<C reportNS={ns => namespaces.push(ns)} />);
    expect(namespaces).toEqual([undefined]);
  });
  it('should report default namespace if no namespace used', () => {
    const i18n = {
      options: {
        defaultNS: 'defaultNS',
      },
      getFixedT: () => {},
      loadNamespaces: () => {},
      on: () => {},
    };
    translate.setI18n(i18n);

    const namespaces = [];
    const C = translate()(() => <div>text</div>);
    mount(<C reportNS={ns => namespaces.push(ns)} />);

    expect(namespaces).toEqual(['defaultNS']);
  });
});

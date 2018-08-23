jest.unmock('../src/translate');
import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';
import translate from '../src/translate';

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
    expect(wrapped.contextTypes.i18n).toBe(PropTypes.object);
    expect(wrapped.contextTypes.defaultNS).toBe(PropTypes.string);
    expect(wrapped.displayName).toBe('Translate(Elem)');
    expect(wrapped.namespaces.length).toBe(2);
    expect(wrapped.namespaces[0]).toBe('ns1');
    expect(wrapped.namespaces[1]).toBe('ns2');
    expect(wrapped.NOT_KNOWN_REACT_STATIC).toBe('IS HOISTED ?');
  });
  it('should do things', () => {
    const wrap = translate(['ns1', 'ns2'], { withRef: true });
    const Elem = React.createFactory('Elem');
    Elem.displayName = 'Elem';
    const wrapped = wrap(Elem);
    const props = { initialI18nStore: {}, initialLanguage: 'en' };
    const t = (message) => message;
    const context = {
      i18n: {
        options: {
          defaultNS: 'defaultNS'
        },
        services: {
          resourceStore: {
            data: {}
          }
        },
        changeLanguage: () => {},
        getFixedT(p, ns) {
          return t;
        }
      }
    };
    const instance = new wrapped(props, context);

    expect(typeof instance.getWrappedInstance).toBe('function');
  });
  it('that we can set i18n', () => {
    const t = (message) => message;
    const i18n = {
      options: {
        defaultNS: 'defaultNS'
      },
      services: {
        resourceStore: {
          data: {}
        }
      },
      changeLanguage: () => {},
      getFixedT(p, ns) {
        return t;
      }
    };
    translate.setI18n(i18n);
    const wrap = translate(['ns1', 'ns2'], {});
    const Elem = React.createFactory('Elem');
    const wrapped = wrap(Elem);
    const instance = new wrapped({}, {});

    expect(instance.i18n).toBe(i18n);
  });
  it('reads defaultNS from context if not provided as an argument', () => {
    const context = {
      i18n: {
        options: {
          defaultNS: 'i18nDefaultNS'
        }
      },
      defaultNS: 'contextDefaultNS'
    };
    const props = { initialI18nStore: {}, initialLanguage: 'en' };
    const Elem = React.createFactory('Elem');
    const wrapped = translate()(Elem);
    const instance = new wrapped(props, context);
    expect(instance.namespaces.length).toBe(1);
    expect(instance.namespaces[0]).toBe('contextDefaultNS');
  });
  it('reads namespace from argument when provided', () => {
    const context = {
      i18n: {
        options: {
          defaultNS: 'i18nDefaultNS'
        }
      },
      defaultNS: 'contextDefaultNS'
    };
    const props = { initialI18nStore: {}, initialLanguage: 'en' };
    const Elem = React.createFactory('Elem');
    const wrapped = translate('namespaceFromArgument')(Elem);
    const instance = new wrapped(props, context);
    expect(instance.namespaces.length).toBe(1);
    expect(instance.namespaces[0]).toBe('namespaceFromArgument');
  });
  it('reads namespace from i18n default if neither argument nor context have a defaultNS', () => {
    const context = {
      i18n: {
        options: {
          defaultNS: 'i18nDefaultNS'
        }
      }
    };
    const props = { initialI18nStore: {}, initialLanguage: 'en' };
    const Elem = React.createFactory('Elem');
    const wrapped = translate()(Elem);
    const instance = new wrapped(props, context);
    expect(instance.namespaces.length).toBe(1);
    expect(instance.namespaces[0]).toBe('i18nDefaultNS');
  });
  it('should report namespaces', () => {
    const namespaces = [];
    const C = translate(['ns1', 'ns2'])(<div>text</div>);
    shallow(<C />, {
      context: {
        reportNS: ns => namespaces.push(ns)
      }
    });
    expect(namespaces).toEqual(['ns1', 'ns2']);
  });
});

import React from 'react';
jest.unmock('../src/loadNamespaces');

import loadNamespaces from '../src/loadNamespaces';

describe('translate', () => {
  it('should return a Promise', () => {
    const promise = loadNamespaces({ components: [], i18n: {} });
    expect(typeof promise.then).toBe('function');
  });
  it('should preload all namespaces', (done) => {
    const i18n = {
      loadNamespaces(namespaces, resolve) {
        expect(Array.isArray(namespaces));
        expect(typeof resolve).toBe('function');
        return resolve(namespaces);
      }
    };
    function C1() {}
    C1.namespaces = ['ns1'];
    function C2() {}
    C2.namespaces = ['ns21', 'ns22'];
    const C3 = React.createFactory('Elem');
    C3.namespaces = ['ns31'];
    const C4 = { element: { namespaces: ['ns41'] } }
    const components = [C1, C2, C3, C4];
    const promise = loadNamespaces({ components, i18n });
    promise.then((data) => {
      expect(data.length).toBe(5);
      expect(data[0]).toBe('ns1');
      expect(data[1]).toBe('ns21');
      expect(data[2]).toBe('ns22');
      expect(data[3]).toBe('ns31');
      expect(data[4]).toBe('ns41');
      done();
    });
  });
});

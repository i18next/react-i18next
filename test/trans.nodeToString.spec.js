import React from 'react';
import { nodesToString } from '../src/Trans';

describe('trans nodeToString', () => {
  describe('treat like other components (legacy)', () => {
    it('should handle voidElements eg. br', () => {
      const children = [
        'lorem ',
        { $$typeof: Symbol.for('react.element'), type: 'br', props: {} },
        ' ipsum',
      ];

      const result = nodesToString('', children, 0, { transKeepBasicHtmlNodesFor: [] });
      expect(result).toEqual('lorem <1></1> ipsum');
    });

    it('should handle non voidElements eg. strong not having attributes and only one child typeof string', () => {
      const children = [
        'lorem ',
        { $$typeof: Symbol.for('react.element'), type: 'strong', props: { children: 'bold' } },
        ' ipsum',
      ];

      const result = nodesToString('', children, 0, { transKeepBasicHtmlNodesFor: [] });
      expect(result).toEqual('lorem <1>bold</1> ipsum');
    });
  });

  describe('treat simplified if simple components', () => {
    it('should handle voidElements eg. br', () => {
      const children = [
        'lorem ',
        { $$typeof: Symbol.for('react.element'), type: 'br', props: {} },
        ' ipsum',
      ];

      const result = nodesToString('', children, 0, {
        transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
      });
      expect(result).toEqual('lorem <br/> ipsum');
    });

    it('should handle non voidElements eg. strong not having attributes and only one child typeof string', () => {
      const children = [
        'lorem ',
        { $$typeof: Symbol.for('react.element'), type: 'strong', props: { children: 'bold' } },
        ' ipsum',
      ];

      const result = nodesToString('', children, 0, {
        transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
      });
      expect(result).toEqual('lorem <strong>bold</strong> ipsum');
    });
  });

  describe('treat like other components if not simple (legacy)', () => {
    it('should handle voidElements eg. br', () => {
      const children = [
        'lorem ',
        { $$typeof: Symbol.for('react.element'), type: 'i', props: { className: 'icon-gear' } },
        ' ipsum',
      ];

      const result = nodesToString('', children, 0, {
        transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
      });
      expect(result).toEqual('lorem <1></1> ipsum');
    });

    it('should handle non voidElements eg. strong not having attributes and only one child typeof string', () => {
      const children = [
        'lorem ',
        {
          $$typeof: Symbol.for('react.element'),
          type: 'strong',
          props: { className: 'special', children: 'bold' },
        },
        ' ipsum',
      ];

      const result = nodesToString('', children, 0, {
        transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
      });
      expect(result).toEqual('lorem <1>bold</1> ipsum');
    });
  });

  describe('having dynamic list maps', () => {
    it('should create normal inner children if not set to ignore them', () => {
      const children = [
        'lorem ',
        {
          $$typeof: Symbol.for('react.element'),
          type: 'ul',
          props: {
            children: [
              {
                $$typeof: Symbol.for('react.element'),
                type: 'li',
                props: { children: 'a' },
              },
              {
                $$typeof: Symbol.for('react.element'),
                type: 'li',
                props: { children: 'b' },
              },
            ],
          },
        },
        ' ipsum',
      ];

      const result = nodesToString('', children, 0, {});
      expect(result).toEqual('lorem <1><0>a</0><1>b</1></1> ipsum');
    });

    it('should omit inner children if set', () => {
      const children = [
        'lorem ',
        {
          $$typeof: Symbol.for('react.element'),
          type: 'ul',
          props: {
            i18nIsDynamicList: true,
            children: [
              {
                $$typeof: Symbol.for('react.element'),
                type: 'li',
                props: { children: 'a' },
              },
              {
                $$typeof: Symbol.for('react.element'),
                type: 'li',
                props: { children: 'b' },
              },
            ],
          },
        },
        ' ipsum',
      ];

      const result = nodesToString('', children, 0, {});
      expect(result).toEqual('lorem <1></1> ipsum');
    });
  });
});

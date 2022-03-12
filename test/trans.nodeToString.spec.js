import React from 'react';
import { nodesToString } from '../src/Trans';

describe('trans nodeToString', () => {
  describe('treat like other components (legacy)', () => {
    it('should handle voidElements eg. br', () => {
      const fragment = (
        <>
          lorem <br /> ipsum
        </>
      );
      const expected = 'lorem <1></1> ipsum';
      const transKeepBasicHtmlNodesFor = [];
      const actual = nodesToString(fragment.props.children, { transKeepBasicHtmlNodesFor });
      expect(actual).toEqual(expected);
    });

    it('should handle non voidElements eg. strong not having attributes and only one child typeof string', () => {
      const fragment = (
        <>
          lorem <strong>bold</strong> ipsum
        </>
      );
      const expected = 'lorem <1>bold</1> ipsum';
      const transKeepBasicHtmlNodesFor = [];
      const actual = nodesToString(fragment.props.children, { transKeepBasicHtmlNodesFor });
      expect(actual).toEqual(expected);
    });
  });

  describe('treat simplified if simple components', () => {
    it('should handle voidElements eg. br', () => {
      const fragment = (
        <>
          lorem <br /> ipsum
        </>
      );
      const expected = 'lorem <br/> ipsum';
      const transKeepBasicHtmlNodesFor = ['br', 'strong', 'i'];
      const actual = nodesToString(fragment.props.children, {
        transSupportBasicHtmlNodes: true,
        transKeepBasicHtmlNodesFor,
      });
      expect(actual).toEqual(expected);
    });

    it('should handle non voidElements eg. strong not having attributes and only one child typeof string', () => {
      const fragment = (
        <>
          lorem <strong>bold</strong> ipsum
        </>
      );
      const expected = 'lorem <strong>bold</strong> ipsum';
      const transKeepBasicHtmlNodesFor = ['br', 'strong', 'i'];
      const actual = nodesToString(fragment.props.children, {
        transSupportBasicHtmlNodes: true,
        transKeepBasicHtmlNodesFor,
      });
      expect(actual).toEqual(expected);
    });
  });

  describe('treat like other components if not simple (legacy)', () => {
    it('should handle voidElements eg. br', () => {
      const fragment = (
        <>
          lorem <i className="icon-gear" /> ipsum
        </>
      );
      const expected = 'lorem <1></1> ipsum';
      const transKeepBasicHtmlNodesFor = ['br', 'strong', 'i'];
      const actual = nodesToString(fragment.props.children, {
        transSupportBasicHtmlNodes: true,
        transKeepBasicHtmlNodesFor,
      });
      expect(actual).toEqual(expected);
    });

    it('should handle non voidElements eg. strong not having attributes and only one child typeof string', () => {
      const fragment = (
        <>
          lorem <strong className="special">bold</strong> ipsum
        </>
      );
      const expected = 'lorem <1>bold</1> ipsum';
      const transKeepBasicHtmlNodesFor = ['br', 'strong', 'i'];
      const actual = nodesToString(fragment.props.children, {
        transSupportBasicHtmlNodes: true,
        transKeepBasicHtmlNodesFor,
      });
      expect(actual).toEqual(expected);
    });
  });

  describe('having dynamic list maps', () => {
    it('should create normal inner children if not set to ignore them', () => {
      const fragment = (
        <>
          {'lorem ' /* eslint-disable-line react/jsx-curly-brace-presence */}
          <ul>
            <li>a</li>
            <li>b</li>
          </ul>
          {' ipsum' /* eslint-disable-line react/jsx-curly-brace-presence */}
        </>
      );
      const expected = 'lorem <1><0>a</0><1>b</1></1> ipsum';
      const actual = nodesToString(fragment.props.children, {});
      expect(actual).toEqual(expected);
    });

    it('should omit inner children if set', () => {
      const fragment = (
        <>
          {'lorem ' /* eslint-disable-line react/jsx-curly-brace-presence */}
          <ul i18nIsDynamicList>
            <li>a</li>
            <li>b</li>
          </ul>
          {' ipsum' /* eslint-disable-line react/jsx-curly-brace-presence */}
        </>
      );
      const expected = 'lorem <1></1> ipsum';
      const actual = nodesToString(fragment.props.children, {});
      expect(actual).toEqual(expected);
    });
  });
});

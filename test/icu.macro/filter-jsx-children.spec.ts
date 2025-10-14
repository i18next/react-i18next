import { describe, it, expect } from 'vitest';
import * as BabelTypes from '@babel/types';
import { filterJSXChildren } from '../../src/icu.macro/utils/filter-jsx-children';

describe('filterJSXChildren', () => {
  it('should filter out JSXFragment from children', () => {
    const jsxText = BabelTypes.jsxText('Hello');
    const jsxFragment = BabelTypes.jsxFragment(
      BabelTypes.jsxOpeningFragment(),
      BabelTypes.jsxClosingFragment(),
      [],
    );
    const jsxElement = BabelTypes.jsxElement(
      BabelTypes.jsxOpeningElement(BabelTypes.jsxIdentifier('div'), [], false),
      BabelTypes.jsxClosingElement(BabelTypes.jsxIdentifier('div')),
      [],
      false,
    );

    const children = [jsxText, jsxFragment, jsxElement];
    const result = filterJSXChildren(children as any);

    expect(result).toHaveLength(2);
    expect(result[0].type).toBe('JSXText');
    expect(result[1].type).toBe('JSXElement');
  });

  it('should return empty array if all children are JSXFragment', () => {
    const jsxFragment = BabelTypes.jsxFragment(
      BabelTypes.jsxOpeningFragment(),
      BabelTypes.jsxClosingFragment(),
      [],
    );

    const children = [jsxFragment];
    const result = filterJSXChildren(children as any);

    expect(result).toHaveLength(0);
  });

  it('should return all children if none are JSXFragment', () => {
    const jsxText = BabelTypes.jsxText('Hello');
    const jsxElement = BabelTypes.jsxElement(
      BabelTypes.jsxOpeningElement(BabelTypes.jsxIdentifier('div'), [], false),
      BabelTypes.jsxClosingElement(BabelTypes.jsxIdentifier('div')),
      [],
      false,
    );

    const children = [jsxText, jsxElement];
    const result = filterJSXChildren(children as any);

    expect(result).toHaveLength(2);
  });
});

import { describe, it, expect } from 'vitest';
import * as BabelTypes from '@babel/types';
import { getChildrenFromJSXExpression } from '../../src/icu.macro/utils/get-children-from-jsx';

describe('getChildrenFromJSXExpression', () => {
  it('should return empty array if expression is not JSXElement', () => {
    const container = BabelTypes.jsxExpressionContainer(BabelTypes.identifier('foo'));
    expect(getChildrenFromJSXExpression(container)).toEqual([]);
  });

  it('should return filtered children from JSXElement', () => {
    const jsxText = BabelTypes.jsxText('Hello');
    const jsxElement = BabelTypes.jsxElement(
      BabelTypes.jsxOpeningElement(BabelTypes.jsxIdentifier('strong'), [], false),
      BabelTypes.jsxClosingElement(BabelTypes.jsxIdentifier('strong')),
      [jsxText],
      false,
    );

    const container = BabelTypes.jsxExpressionContainer(jsxElement);
    const result = getChildrenFromJSXExpression(container);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('JSXText');
  });

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
      [jsxText, jsxFragment],
      false,
    );

    const container = BabelTypes.jsxExpressionContainer(jsxElement);
    const result = getChildrenFromJSXExpression(container);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('JSXText');
  });
});

import { describe, it, expect } from 'vitest';
import * as BabelTypes from '@babel/types';
import * as Babel from '@babel/core';
import { processTrans } from '../../src/icu.macro/utils/processor';

describe('processTrans', () => {
  it('should process simple text children', () => {
    const children = [BabelTypes.jsxText('Hello World')];
    const result = processTrans(children, Babel);

    expect(result.defaults).toContain('Hello World');
    expect(result.components).toHaveLength(0);
    expect(result.values).toHaveLength(0);
  });

  it('should process children with interpolation', () => {
    const children = [
      BabelTypes.jsxText('Hello '),
      BabelTypes.jsxExpressionContainer(BabelTypes.identifier('name')),
      BabelTypes.jsxText('!'),
    ];

    const result = processTrans(children, Babel);

    expect(result.defaults).toBe('Hello {name}!');
    expect(result.values).toHaveLength(1);
    expect((result.values[0].key as BabelTypes.Identifier).name).toBe('name');
  });

  it('should process children with JSX elements', () => {
    const strong = BabelTypes.jsxElement(
      BabelTypes.jsxOpeningElement(BabelTypes.jsxIdentifier('strong'), [], false),
      BabelTypes.jsxClosingElement(BabelTypes.jsxIdentifier('strong')),
      [BabelTypes.jsxText('bold')],
      false,
    );

    const children = [BabelTypes.jsxText('Hello '), strong, BabelTypes.jsxText('!')];

    const result = processTrans(children, Babel);

    expect(result.defaults).toContain('<0>bold</0>');
    expect(result.components).toHaveLength(1);
  });

  it('should handle componentStartIndex parameter', () => {
    const strong = BabelTypes.jsxElement(
      BabelTypes.jsxOpeningElement(BabelTypes.jsxIdentifier('strong'), [], false),
      BabelTypes.jsxClosingElement(BabelTypes.jsxIdentifier('strong')),
      [BabelTypes.jsxText('bold')],
      false,
    );

    const children = [strong];
    const result = processTrans(children, Babel, 5);

    expect(result.defaults).toContain('<5>bold</5>');
  });
});

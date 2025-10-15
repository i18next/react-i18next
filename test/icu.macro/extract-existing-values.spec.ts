import { describe, it, expect } from 'vitest';
import * as BabelTypes from '@babel/types';
import { extractExistingValues } from '../../src/icu.macro/utils/extract-existing-values';

describe('extractExistingValues', () => {
  it('should return empty array if no attribute provided', () => {
    expect(extractExistingValues(undefined)).toEqual([]);
  });

  it('should return empty array if attribute is not JSXAttribute', () => {
    const spreadAttr = BabelTypes.jsxSpreadAttribute(BabelTypes.identifier('props'));
    const mockPath = { node: spreadAttr } as any;
    expect(extractExistingValues(mockPath)).toEqual([]);
  });

  it('should return empty array if value is not JSXExpressionContainer', () => {
    const attr = BabelTypes.jsxAttribute(
      BabelTypes.jsxIdentifier('values'),
      BabelTypes.stringLiteral('test'),
    );
    const mockPath = { node: attr } as any;
    expect(extractExistingValues(mockPath)).toEqual([]);
  });

  it('should return empty array if expression is not ObjectExpression', () => {
    const attr = BabelTypes.jsxAttribute(
      BabelTypes.jsxIdentifier('values'),
      BabelTypes.jsxExpressionContainer(BabelTypes.identifier('someVar')),
    );
    const mockPath = { node: attr } as any;
    expect(extractExistingValues(mockPath)).toEqual([]);
  });

  it('should extract object properties from values attribute', () => {
    const attr = BabelTypes.jsxAttribute(
      BabelTypes.jsxIdentifier('values'),
      BabelTypes.jsxExpressionContainer(
        BabelTypes.objectExpression([
          BabelTypes.objectProperty(
            BabelTypes.identifier('name'),
            BabelTypes.identifier('name'),
            false,
            true,
          ),
          BabelTypes.objectProperty(BabelTypes.identifier('count'), BabelTypes.numericLiteral(5)),
        ]),
      ),
    );
    const mockPath = { node: attr } as any;
    const result = extractExistingValues(mockPath);

    expect(result).toHaveLength(2);
    expect(result[0].type).toBe('ObjectProperty');
    expect(result[1].type).toBe('ObjectProperty');
  });

  it('should filter out non-ObjectProperty items (methods, spreads)', () => {
    const attr = BabelTypes.jsxAttribute(
      BabelTypes.jsxIdentifier('values'),
      BabelTypes.jsxExpressionContainer(
        BabelTypes.objectExpression([
          BabelTypes.objectProperty(BabelTypes.identifier('name'), BabelTypes.identifier('name')),
          BabelTypes.spreadElement(BabelTypes.identifier('otherProps')),
        ]),
      ),
    );
    const mockPath = { node: attr } as any;
    const result = extractExistingValues(mockPath);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('ObjectProperty');
  });
});

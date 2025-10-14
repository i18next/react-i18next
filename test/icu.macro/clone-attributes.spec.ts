import { describe, it, expect } from 'vitest';
import * as BabelTypes from '@babel/types';
import { cloneExistingAttributes } from '../../src/icu.macro/utils/clone-attributes';

describe('cloneExistingAttributes', () => {
  it('should clone JSXAttribute nodes', () => {
    const attr1 = BabelTypes.jsxAttribute(BabelTypes.jsxIdentifier('foo'));
    const attr2 = BabelTypes.jsxAttribute(BabelTypes.jsxIdentifier('bar'));

    const mockPaths = [{ node: attr1 } as any, { node: attr2 } as any];

    const result = cloneExistingAttributes(mockPaths);

    expect(result).toHaveLength(2);
    expect(result[0]).toBe(attr1);
    expect(result[1]).toBe(attr2);
  });

  it('should filter out JSXSpreadAttribute', () => {
    const attr = BabelTypes.jsxAttribute(BabelTypes.jsxIdentifier('foo'));
    const spread = BabelTypes.jsxSpreadAttribute(BabelTypes.identifier('props'));

    const mockPaths = [{ node: attr } as any, { node: spread } as any];

    const result = cloneExistingAttributes(mockPaths);

    expect(result).toHaveLength(1);
    expect(result[0]).toBe(attr);
  });

  it('should return empty array for empty input', () => {
    expect(cloneExistingAttributes([])).toEqual([]);
  });

  it('should return empty array if all are spread attributes', () => {
    const spread1 = BabelTypes.jsxSpreadAttribute(BabelTypes.identifier('props1'));
    const spread2 = BabelTypes.jsxSpreadAttribute(BabelTypes.identifier('props2'));

    const mockPaths = [{ node: spread1 } as any, { node: spread2 } as any];

    expect(cloneExistingAttributes(mockPaths)).toEqual([]);
  });
});

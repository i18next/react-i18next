import { describe, it, expect } from 'vitest';
import * as BabelTypes from '@babel/types';
import { findAttribute, attributeExistsAlready } from '../../src/icu.macro/utils/find-attribute';

describe('findAttribute', () => {
  it('should find attribute by name', () => {
    const attr1 = BabelTypes.jsxAttribute(BabelTypes.jsxIdentifier('foo'));
    const attr2 = BabelTypes.jsxAttribute(BabelTypes.jsxIdentifier('bar'));

    const mockPaths = [{ node: attr1 } as any, { node: attr2 } as any];

    const result = findAttribute('bar', mockPaths);
    expect(result?.node).toBe(attr2);
  });

  it('should return undefined if attribute not found', () => {
    const attr = BabelTypes.jsxAttribute(BabelTypes.jsxIdentifier('foo'));
    const mockPaths = [{ node: attr } as any];

    expect(findAttribute('notFound', mockPaths)).toBeUndefined();
  });

  it('should skip JSXSpreadAttribute', () => {
    const spread = BabelTypes.jsxSpreadAttribute(BabelTypes.identifier('props'));
    const attr = BabelTypes.jsxAttribute(BabelTypes.jsxIdentifier('foo'));

    const mockPaths = [{ node: spread } as any, { node: attr } as any];

    const result = findAttribute('foo', mockPaths);
    expect(result?.node).toBe(attr);
  });
});

describe('attributeExistsAlready', () => {
  it('should return true if attribute exists', () => {
    const attrs = [
      BabelTypes.jsxAttribute(BabelTypes.jsxIdentifier('foo')),
      BabelTypes.jsxAttribute(BabelTypes.jsxIdentifier('bar')),
    ];

    expect(attributeExistsAlready('foo', attrs)).toBe(true);
    expect(attributeExistsAlready('bar', attrs)).toBe(true);
  });

  it('should return false if attribute does not exist', () => {
    const attrs = [BabelTypes.jsxAttribute(BabelTypes.jsxIdentifier('foo'))];
    expect(attributeExistsAlready('notFound', attrs)).toBe(false);
  });

  it('should return false for empty array', () => {
    expect(attributeExistsAlready('anything', [])).toBe(false);
  });
});

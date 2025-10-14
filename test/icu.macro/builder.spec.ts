import { describe, it, expect } from 'vitest';
import * as BabelTypes from '@babel/types';
import { buildTransElement } from '../../src/icu.macro/utils/builder';

describe('buildTransElement', () => {
  const t = BabelTypes;

  it('should build a Trans element with defaults, components, and values', () => {
    const extracted = {
      defaults: 'Hello {name}',
      components: [],
      values: [t.objectProperty(t.identifier('name'), t.identifier('name'), false, true)],
    };

    const result = buildTransElement(extracted, [], t, false, false);

    expect(result.type).toBe('JSXOpeningElement');
    expect((result as BabelTypes.JSXOpeningElement).name.type).toBe('JSXIdentifier');
    expect(((result as BabelTypes.JSXOpeningElement).name as BabelTypes.JSXIdentifier).name).toBe(
      'Trans',
    );
    expect((result as BabelTypes.JSXOpeningElement).attributes).toHaveLength(3); // defaults, components, values
  });

  it('should close defaults with } when closeDefaults is true', () => {
    const extracted = {
      defaults: '{count, plural, one {item',
      components: [],
      values: [],
    };

    buildTransElement(extracted, [], t, true, false);

    expect(extracted.defaults).toBe('{count, plural, one {item}');
  });

  it('should wrap defaults in expression container when containing double quotes', () => {
    const extracted = {
      defaults: 'Hello "World"',
      components: [],
      values: [],
    };

    const result = buildTransElement(
      extracted,
      [],
      t,
      false,
      false,
    ) as BabelTypes.JSXOpeningElement;
    const defaultsAttr = result.attributes.find(
      (attr) =>
        attr.type === 'JSXAttribute' &&
        attr.name.type === 'JSXIdentifier' &&
        attr.name.name === 'defaults',
    ) as BabelTypes.JSXAttribute;

    expect(defaultsAttr.value?.type).toBe('JSXExpressionContainer');
  });

  it('should use string literal for defaults without double quotes', () => {
    const extracted = {
      defaults: 'Hello World',
      components: [],
      values: [],
    };

    const result = buildTransElement(
      extracted,
      [],
      t,
      false,
      false,
    ) as BabelTypes.JSXOpeningElement;
    const defaultsAttr = result.attributes.find(
      (attr) =>
        attr.type === 'JSXAttribute' &&
        attr.name.type === 'JSXIdentifier' &&
        attr.name.name === 'defaults',
    ) as BabelTypes.JSXAttribute;

    expect(defaultsAttr.value?.type).toBe('StringLiteral');
  });

  it('should not add defaults if it already exists', () => {
    const extracted = {
      defaults: 'Hello',
      components: [],
      values: [],
    };

    const existingDefaults = t.jsxAttribute(t.jsxIdentifier('defaults'));
    const result = buildTransElement(
      extracted,
      [existingDefaults],
      t,
      false,
      false,
    ) as BabelTypes.JSXOpeningElement;

    const defaultsAttrs = result.attributes.filter(
      (attr) =>
        attr.type === 'JSXAttribute' &&
        attr.name.type === 'JSXIdentifier' &&
        attr.name.name === 'defaults',
    );

    expect(defaultsAttrs).toHaveLength(1);
  });

  it('should return JSXElement when wasElementWithChildren is true', () => {
    const extracted = {
      defaults: 'Hello',
      components: [],
      values: [],
    };

    const result = buildTransElement(extracted, [], t, false, true);

    expect(result.type).toBe('JSXElement');
  });
});

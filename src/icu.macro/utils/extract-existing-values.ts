import { type NodePath } from '@babel/traverse';
import type * as BabelTypes from '@babel/types';

/**
 * Extract existing values from a values attribute
 */
export function extractExistingValues(
  valuesAttribute: NodePath<BabelTypes.JSXAttribute | BabelTypes.JSXSpreadAttribute> | undefined,
): BabelTypes.ObjectProperty[] {
  if (!valuesAttribute) return [];
  if (valuesAttribute.node.type !== 'JSXAttribute') return [];

  const attrValue = valuesAttribute.node.value;
  if (!attrValue || attrValue.type !== 'JSXExpressionContainer') return [];
  if (attrValue.expression.type !== 'ObjectExpression') return [];

  return attrValue.expression.properties.filter(
    (p): p is BabelTypes.ObjectProperty => p.type === 'ObjectProperty',
  );
}

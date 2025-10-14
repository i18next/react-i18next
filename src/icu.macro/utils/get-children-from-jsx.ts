import type * as BabelTypes from '@babel/types';
import type { JSXChild } from './types';
import { filterJSXChildren } from './filter-jsx-children';

/**
 * Get children from a JSXExpressionContainer, filtering out JSXFragment
 */
export function getChildrenFromJSXExpression(
  container: BabelTypes.JSXExpressionContainer,
): JSXChild[] {
  if (container.expression.type !== 'JSXElement') return [];
  return filterJSXChildren(container.expression.children);
}

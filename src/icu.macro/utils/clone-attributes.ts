import { type NodePath } from '@babel/traverse';
import type * as BabelTypes from '@babel/types';

/**
 * Clone existing JSX attributes
 */
export function cloneExistingAttributes(
  attributes: NodePath<BabelTypes.JSXAttribute | BabelTypes.JSXSpreadAttribute>[],
): BabelTypes.JSXAttribute[] {
  const cloned: BabelTypes.JSXAttribute[] = [];
  for (const attr of attributes) {
    if (attr.node.type === 'JSXAttribute') {
      cloned.push(attr.node);
    }
  }
  return cloned;
}

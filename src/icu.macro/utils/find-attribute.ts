import { type NodePath } from '@babel/traverse';
import type * as BabelTypes from '@babel/types';

/**
 * Find an attribute by name in a list of JSX attributes
 */
export function findAttribute(
  name: string,
  attributes: NodePath<BabelTypes.JSXAttribute | BabelTypes.JSXSpreadAttribute>[],
): NodePath<BabelTypes.JSXAttribute | BabelTypes.JSXSpreadAttribute> | undefined {
  return attributes.find((child) => {
    const ele = child.node;
    return (
      ele.type === 'JSXAttribute' && ele.name.type === 'JSXIdentifier' && ele.name.name === name
    );
  });
}

/**
 * Check if an attribute already exists in a list
 */
export function attributeExistsAlready(
  name: string,
  attributes: BabelTypes.JSXAttribute[],
): boolean {
  return !!attributes.find((attr) => attr.name.type === 'JSXIdentifier' && attr.name.name === name);
}
